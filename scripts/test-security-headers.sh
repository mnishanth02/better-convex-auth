#!/bin/bash

# Security Headers Testing Script
# Run this to test the security configuration of your application

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
APP_URL="${1:-http://localhost:3000}"
OUTPUT_DIR="security-test-results"

echo -e "${BLUE}🔒 Security Headers Testing for $APP_URL${NC}"
echo "=================================================="

# Create output directory
mkdir -p "$OUTPUT_DIR"

# Test function
test_security_header() {
    local header_name="$1"
    local expected_pattern="$2"
    local description="$3"
    
    echo -e "\n📋 Testing $description..."
    
    local response=$(curl -sI "$APP_URL" | grep -i "^$header_name:" | head -1)
    
    if [ -z "$response" ]; then
        echo -e "${RED}❌ FAIL: $header_name header not found${NC}"
        return 1
    fi
    
    if [[ "$response" =~ $expected_pattern ]]; then
        echo -e "${GREEN}✅ PASS: $response${NC}"
        return 0
    else
        echo -e "${YELLOW}⚠️  WARNING: $response${NC}"
        echo -e "   Expected pattern: $expected_pattern"
        return 1
    fi
}

# Comprehensive security header tests
echo -e "\n${BLUE}🔍 Running Security Header Tests...${NC}"

# Critical Security Headers
test_security_header "Content-Security-Policy" "default-src.*self" "Content Security Policy"
test_security_header "X-Frame-Options" "DENY" "Clickjacking Protection"
test_security_header "X-Content-Type-Options" "nosniff" "MIME Type Sniffing Protection"
test_security_header "Strict-Transport-Security" "max-age.*includeSubDomains" "HTTPS Enforcement"
test_security_header "Referrer-Policy" "strict-origin" "Referrer Control"

# Additional Security Headers
test_security_header "X-XSS-Protection" "1.*mode=block" "XSS Protection"
test_security_header "Permissions-Policy" "camera=.*microphone=" "Feature Policy"
test_security_header "Cross-Origin-Opener-Policy" "same-origin" "Cross-Origin Opener Policy"
test_security_header "Cross-Origin-Embedder-Policy" "require-corp" "Cross-Origin Embedder Policy"

# Test specific endpoints
echo -e "\n${BLUE}🔍 Testing API Endpoint Security...${NC}"

# Test API routes
api_response=$(curl -sI "$APP_URL/api/auth/session" 2>/dev/null || true)
if [[ "$api_response" == *"X-Robots-Tag"* ]]; then
    echo -e "${GREEN}✅ API routes have robot restrictions${NC}"
else
    echo -e "${YELLOW}⚠️  API routes may be missing robot restrictions${NC}"
fi

# Test for sensitive headers that should be removed
echo -e "\n${BLUE}🔍 Testing for Sensitive Information Disclosure...${NC}"

sensitive_headers=("Server" "X-Powered-By" "X-AspNet-Version" "X-AspNetMvc-Version")

for header in "${sensitive_headers[@]}"; do
    response=$(curl -sI "$APP_URL" | grep -i "^$header:" | head -1)
    if [ -z "$response" ]; then
        echo -e "${GREEN}✅ $header header properly removed${NC}"
    else
        echo -e "${RED}❌ $header header present: $response${NC}"
    fi
done

# Generate detailed report
echo -e "\n${BLUE}📄 Generating Security Report...${NC}"

curl -sI "$APP_URL" > "$OUTPUT_DIR/security-headers-raw.txt"

cat > "$OUTPUT_DIR/security-report.md" << EOF
# Security Headers Test Report

**Application URL**: $APP_URL  
**Test Date**: $(date)  
**Status**: See individual test results below

## Security Headers Analysis

$(curl -sI "$APP_URL" | grep -E "(Content-Security-Policy|X-Frame-Options|X-Content-Type-Options|Strict-Transport-Security|Referrer-Policy)" | sed 's/^/- /')

## Recommendations

### High Priority
- Ensure all security headers are properly configured
- Test CSP policy for any console errors
- Verify HSTS is working in production with HTTPS

### Medium Priority  
- Consider implementing additional CSP directives
- Add security.txt file for responsible disclosure
- Monitor security headers with automated testing

### Low Priority
- Consider adding Expect-CT header
- Review Permissions-Policy for your use case
- Add security monitoring and alerting

## Manual Testing Checklist

- [ ] Load application and check browser console for CSP violations
- [ ] Verify no mixed content warnings with HTTPS
- [ ] Test iframe embedding is blocked
- [ ] Confirm robots.txt excludes sensitive paths
- [ ] Validate certificate and HSTS in production

## Tools for Further Testing

\`\`\`bash
# Online security scanners
# https://securityheaders.com/?q=$APP_URL
# https://observatory.mozilla.org/analyze?host=$APP_URL

# Local testing with HTTPie
pip install httpie
http HEAD $APP_URL

# cURL testing
curl -I $APP_URL
\`\`\`
EOF

echo -e "\n${BLUE}📊 Security Score Estimation...${NC}"

# Simple scoring based on critical headers
score=0
critical_headers=("Content-Security-Policy" "X-Frame-Options" "X-Content-Type-Options" "Strict-Transport-Security")

for header in "${critical_headers[@]}"; do
    if curl -sI "$APP_URL" | grep -qi "^$header:"; then
        ((score++))
    fi
done

percentage=$((score * 100 / ${#critical_headers[@]}))

if [ $percentage -ge 75 ]; then
    echo -e "${GREEN}🎉 Security Score: $percentage% (${score}/${#critical_headers[@]}) - Good${NC}"
elif [ $percentage -ge 50 ]; then
    echo -e "${YELLOW}⚠️  Security Score: $percentage% (${score}/${#critical_headers[@]}) - Needs Improvement${NC}"
else
    echo -e "${RED}🚨 Security Score: $percentage% (${score}/${#critical_headers[@]}) - Critical Issues${NC}"
fi

echo -e "\n${BLUE}📁 Results saved to $OUTPUT_DIR/${NC}"
echo "   - security-headers-raw.txt (raw headers)"
echo "   - security-report.md (detailed analysis)"

echo -e "\n${GREEN}🔒 Security testing complete!${NC}"
echo "   Run 'pnpm security:test' to test again"
echo "   Check https://securityheaders.com for online analysis"