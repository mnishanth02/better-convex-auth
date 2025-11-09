#!/usr/bin/env bash
#
# Package Boundary Validation Script
# 
# This script validates that packages only import from public APIs
# and do not import from internal /src/ or /dist/ directories.
#
# Usage:
#   ./scripts/validate-boundaries.sh
#
# Exit codes:
#   0 - All boundary checks passed
#   1 - Boundary violations detected

set -euo pipefail

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

echo "🔍 Validating package boundaries..."
echo ""

# Track violations
VIOLATIONS=0

# Forbidden import patterns
FORBIDDEN_PATTERNS=(
  "@auth/core/src"
  "@auth/core/dist"
  "@auth/utils/src"
  "@auth/utils/dist"
  "@auth/web/src"
  "@auth/types/src"
  "@auth/types/dist"
  "@auth/ui/src"
  "@auth/quickstart/src"
  "@workspace/ui/src"
)

# Files to check (TypeScript and JavaScript files)
FILE_PATTERNS=(
  "packages/auth/*/src/**/*.ts"
  "packages/auth/*/src/**/*.tsx"
  "apps/*/**/*.ts"
  "apps/*/**/*.tsx"
  "apps/*/components/**/*.ts"
  "apps/*/components/**/*.tsx"
  "apps/*/lib/**/*.ts"
  "apps/*/lib/**/*.tsx"
)

# Function to check a single file
check_file() {
  local file="$1"
  local has_violations=0
  
  for pattern in "${FORBIDDEN_PATTERNS[@]}"; do
    if grep -q "from ['\"]${pattern}" "$file" 2>/dev/null; then
      if [ $has_violations -eq 0 ]; then
        echo -e "${RED}✗${NC} Boundary violation in: ${file}"
        has_violations=1
      fi
      
      # Show the violating lines
      grep -n "from ['\"]${pattern}" "$file" | while read -r line; do
        echo -e "  ${YELLOW}Line:${NC} $line"
      done
      
      VIOLATIONS=$((VIOLATIONS + 1))
    fi
  done
  
  return 0
}

# Check all files
echo "Checking files for forbidden imports..."
echo ""

checked_files=0
for pattern in "${FILE_PATTERNS[@]}"; do
  while IFS= read -r -d '' file; do
    check_file "$file"
    checked_files=$((checked_files + 1))
  done < <(find "$PROJECT_ROOT" -path "*/$pattern" -type f -print0 2>/dev/null || true)
done

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if [ $VIOLATIONS -eq 0 ]; then
  echo -e "${GREEN}✓${NC} All boundary checks passed!"
  echo -e "${GREEN}✓${NC} Checked $checked_files files"
  echo ""
  exit 0
else
  echo -e "${RED}✗${NC} Found $VIOLATIONS boundary violation(s)"
  echo ""
  echo "Forbidden import patterns:"
  for pattern in "${FORBIDDEN_PATTERNS[@]}"; do
    echo "  • ${pattern}"
  done
  echo ""
  echo "Allowed imports:"
  echo "  • @auth/core"
  echo "  • @auth/utils"
  echo "  • @auth/web"
  echo "  • @auth/types"
  echo "  • @auth/ui"
  echo "  • @auth/quickstart"
  echo "  • @workspace/ui"
  echo ""
  echo "Fix: Update imports to use package exports instead of internal paths"
  exit 1
fi
