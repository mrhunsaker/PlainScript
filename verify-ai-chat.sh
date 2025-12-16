#!/bin/bash

# AI Chat Implementation Verification Script
# This script verifies that all AI chat components are properly installed

set -e

echo "🔍 PlainScript AI Chat - Installation Verification"
echo "=================================================="
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

errors=0
warnings=0

# Function to check file exists
check_file() {
    local file=$1
    local description=$2
    
    if [ -f "$file" ]; then
        echo -e "${GREEN}✓${NC} Found: $description"
        return 0
    else
        echo -e "${RED}✗${NC} Missing: $description"
        errors=$((errors + 1))
        return 1
    fi
}

# Function to check directory exists
check_dir() {
    local dir=$1
    local description=$2
    
    if [ -d "$dir" ]; then
        echo -e "${GREEN}✓${NC} Found: $description"
        return 0
    else
        echo -e "${RED}✗${NC} Missing: $description"
        errors=$((errors + 1))
        return 1
    fi
}

# Function to verify imports in file
check_import() {
    local file=$1
    local import=$2
    local description=$3
    
    if grep -q "$import" "$file"; then
        echo -e "${GREEN}✓${NC} Verified: $description"
        return 0
    else
        echo -e "${YELLOW}⚠${NC} Warning: $description - might be missing"
        warnings=$((warnings + 1))
        return 1
    fi
}

echo "📁 Checking Component Files..."
echo ""

check_file "custom-ui/src/frontend/ai-chat-widget.ts" "AI Chat Widget component"
check_file "custom-ui/src/frontend/ai-service.ts" "AI Service core"
check_file "custom-ui/src/frontend/ai-chat-contribution.ts" "Theia integration"
check_file "custom-ui/src/frontend/style/ai-chat.less" "AI Chat styles"

echo ""
echo "📚 Checking Documentation Files..."
echo ""

check_file "AI_CHAT_QUICKSTART.md" "Quick start guide"
check_file "AI_CHAT_README.md" "Complete documentation"
check_file "AI_CHAT_EXAMPLES.ts" "Provider examples"
check_file "AI_CHAT_VISUAL_REFERENCE.md" "Architecture diagrams"
check_file "AI_CHAT_SUMMARY.md" "Implementation summary"

echo ""
echo "🔗 Checking Integration..."
echo ""

check_import "custom-ui/src/frontend/index.ts" "AIService" "AIService binding in index.ts"
check_import "custom-ui/src/frontend/index.ts" "AIChatWidget" "AIChatWidget binding in index.ts"
check_import "custom-ui/src/frontend/index.ts" "initAIChatContribution" "AI Chat contribution initialization"

echo ""
echo "📦 Checking Dependencies..."
echo ""

if grep -q "@theia/core" "custom-ui/package.json"; then
    echo -e "${GREEN}✓${NC} Theia core dependency present"
else
    echo -e "${YELLOW}⚠${NC} Warning: Theia core dependency not found"
    warnings=$((warnings + 1))
fi

if grep -q "react" "custom-ui/package.json"; then
    echo -e "${GREEN}✓${NC} React dependency present"
else
    echo -e "${YELLOW}⚠${NC} Warning: React dependency not found (might be via Theia)"
    warnings=$((warnings + 1))
fi

echo ""
echo "🎨 Checking Style Import..."
echo ""

if grep -q "import './style/ai-chat.less'" "custom-ui/src/frontend/ai-chat-widget.ts"; then
    echo -e "${GREEN}✓${NC} Style sheet imported in widget"
else
    echo -e "${RED}✗${NC} Style sheet not imported in widget"
    errors=$((errors + 1))
fi

echo ""
echo "=================================================="
echo "📊 Verification Results"
echo "=================================================="
echo ""

if [ $errors -eq 0 ]; then
    echo -e "${GREEN}✓ All checks passed!${NC}"
    if [ $warnings -gt 0 ]; then
        echo -e "${YELLOW}⚠ $warnings warning(s) found (non-critical)${NC}"
    fi
else
    echo -e "${RED}✗ $errors error(s) found!${NC}"
    echo ""
    echo "Please ensure all files are created as per the documentation."
fi

echo ""
echo "📋 Next Steps:"
echo ""

if [ $errors -eq 0 ]; then
    echo "1. ✅ All components are installed correctly"
    echo "2. 📖 Follow the setup in AI_CHAT_QUICKSTART.md"
    echo "3. 🔑 Set your AI provider API key"
    echo "4. 🏗️  Run: npm run build"
    echo "5. ▶️  Open PlainScript and go to View → AI Chat"
else
    echo "1. ❌ Fix the errors listed above"
    echo "2. 📖 Check AI_CHAT_README.md for troubleshooting"
    echo "3. 🔄 Re-run this script to verify"
fi

echo ""
echo "📚 Documentation:"
echo "  - Quick Start: cat AI_CHAT_QUICKSTART.md"
echo "  - Full Docs: cat AI_CHAT_README.md"
echo "  - Examples: cat AI_CHAT_EXAMPLES.ts"
echo "  - Architecture: cat AI_CHAT_VISUAL_REFERENCE.md"
echo ""

if [ $errors -eq 0 ]; then
    exit 0
else
    exit 1
fi
