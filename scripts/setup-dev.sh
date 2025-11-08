#!/bin/bash

##############################################################################
# Developer Environment Setup Script
#
# This script sets up a complete development environment for the
# better-convex-auth monorepo.
#
# Usage: ./scripts/setup-dev.sh
##############################################################################

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
print_header() {
    echo -e "\n${BLUE}===================================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}===================================================${NC}\n"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}➜ $1${NC}"
}

# Check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

##############################################################################
# 1. Check Prerequisites
##############################################################################

print_header "Checking Prerequisites"

# Check Node.js
if ! command_exists node; then
    print_error "Node.js is not installed. Please install Node.js 20+ from https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 20 ]; then
    print_error "Node.js version 20 or higher is required. Current: $(node -v)"
    exit 1
fi
print_success "Node.js $(node -v)"

# Check pnpm
if ! command_exists pnpm; then
    print_info "pnpm not found. Installing pnpm..."
    npm install -g pnpm@10.4.1
fi
print_success "pnpm $(pnpm -v)"

# Check git
if ! command_exists git; then
    print_error "Git is not installed. Please install Git from https://git-scm.com/"
    exit 1
fi
print_success "Git $(git --version | cut -d' ' -f3)"

##############################################################################
# 2. Install Dependencies
##############################################################################

print_header "Installing Dependencies"

print_info "Running pnpm install..."
pnpm install

print_success "Dependencies installed"

##############################################################################
# 3. Environment Setup
##############################################################################

print_header "Setting Up Environment"

# Create .env.local if it doesn't exist
if [ ! -f "apps/web/.env.local" ]; then
    print_info "Creating apps/web/.env.local from .env.example..."
    
    if [ -f "apps/web/.env.example" ]; then
        cp apps/web/.env.example apps/web/.env.local
        print_success "Created apps/web/.env.local"
        print_info "Please update apps/web/.env.local with your configuration"
    else
        print_info "No .env.example found. Creating minimal .env.local..."
        cat > apps/web/.env.local << EOF
# Convex
NEXT_PUBLIC_CONVEX_URL=
CONVEX_DEPLOYMENT=

# Better Auth
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=http://localhost:3000

# OAuth Providers (Optional)
# GOOGLE_CLIENT_ID=
# GOOGLE_CLIENT_SECRET=
# GITHUB_CLIENT_ID=
# GITHUB_CLIENT_SECRET=

# Email (Resend)
RESEND_API_KEY=
EOF
        print_success "Created minimal apps/web/.env.local"
        print_info "Please configure your environment variables in apps/web/.env.local"
    fi
else
    print_success "apps/web/.env.local already exists"
fi

# Create backend .env if it doesn't exist
if [ ! -f "packages/backend/.env" ]; then
    print_info "Creating packages/backend/.env..."
    cat > packages/backend/.env << EOF
# Convex Deployment
CONVEX_DEPLOYMENT=

# This file is for local development only
# Production secrets should be set via Convex dashboard
EOF
    print_success "Created packages/backend/.env"
else
    print_success "packages/backend/.env already exists"
fi

##############################################################################
# 4. Build Packages
##############################################################################

print_header "Building Packages"

print_info "Running initial build..."
pnpm build

print_success "Build completed"

##############################################################################
# 5. Convex Setup
##############################################################################

print_header "Convex Setup"

print_info "To set up Convex, you need to:"
echo "  1. Create a Convex account at https://convex.dev"
echo "  2. Create a new project"
echo "  3. Run: cd packages/backend && npx convex dev"
echo "  4. Follow the prompts to link your project"
echo "  5. Copy the deployment URL to apps/web/.env.local"

read -p "Would you like to set up Convex now? (y/N) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    print_info "Opening Convex setup..."
    cd packages/backend
    npx convex dev --once
    cd ../..
    print_success "Convex setup initiated"
else
    print_info "Skipping Convex setup. You can run it later with: cd packages/backend && npx convex dev"
fi

##############################################################################
# 6. Git Hooks Setup (Optional)
##############################################################################

print_header "Git Hooks Setup"

read -p "Would you like to set up pre-commit hooks for code quality? (y/N) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    print_info "Installing Husky..."
    pnpm add -D -w husky
    pnpm exec husky init
    
    # Create pre-commit hook
    cat > .husky/pre-commit << 'EOF'
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

# Run biome check on staged files
pnpm biome check --staged --no-errors-on-unmatched
EOF
    
    chmod +x .husky/pre-commit
    print_success "Git hooks configured"
else
    print_info "Skipping git hooks setup"
fi

##############################################################################
# 7. Summary
##############################################################################

print_header "Setup Complete! 🎉"

echo "Your development environment is ready!"
echo ""
echo "Next steps:"
echo ""
echo "  1. Configure environment variables:"
echo "     - Edit apps/web/.env.local"
echo "     - Add your Convex deployment URL"
echo "     - Add Better Auth secret (generate with: openssl rand -base64 32)"
echo "     - (Optional) Add OAuth provider credentials"
echo ""
echo "  2. Start development servers:"
echo "     ${GREEN}pnpm dev${NC}"
echo ""
echo "  3. Open your browser:"
echo "     http://localhost:3000"
echo ""
echo "Useful commands:"
echo "  ${GREEN}pnpm dev${NC}          - Start Next.js + Convex dev servers"
echo "  ${GREEN}pnpm build${NC}        - Build all packages"
echo "  ${GREEN}pnpm check${NC}        - Run Biome linter/formatter"
echo "  ${GREEN}pnpm typecheck${NC}    - Run TypeScript type checking"
echo ""
echo "Documentation:"
echo "  - README.md                  - Project overview"
echo "  - packages/auth/*/README.md  - Auth package documentation"
echo "  - docs/                      - Additional documentation"
echo ""

print_success "Happy coding! 🚀"
