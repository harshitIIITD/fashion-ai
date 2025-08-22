#!/bin/bash

# Fashion AI CLI - Kali Linux Setup Verification Script
# This script checks if your Kali Linux system is ready to run Fashion AI CLI

echo "🔍 Fashion AI CLI - Kali Linux Setup Verification"
echo "=================================================="
echo

# Check if running on Linux
if [[ "$OSTYPE" != "linux-gnu"* ]]; then
    echo "❌ This script is designed for Linux systems"
    exit 1
fi

# Check if running as root (not recommended)
if [[ $EUID -eq 0 ]]; then
    echo "⚠️  Warning: Running as root is not recommended"
    echo "   Consider running as a regular user"
    echo
fi

# Check Node.js version
echo "📦 Checking Node.js installation..."
if command -v node >/dev/null 2>&1; then
    NODE_VERSION=$(node --version)
    NODE_MAJOR=$(echo $NODE_VERSION | cut -d. -f1 | sed 's/v//')
    echo "   Node.js version: $NODE_VERSION"
    
    if [[ $NODE_MAJOR -ge 20 ]]; then
        echo "   ✅ Node.js version is compatible (20+)"
    else
        echo "   ❌ Node.js version is too old (need 20+)"
        echo "   📖 See: https://github.com/harshitIIITD/fashion-ai/blob/main/docs/kali-linux-setup.md#nodejs-installation"
        exit 1
    fi
else
    echo "   ❌ Node.js is not installed"
    echo "   📖 See: https://github.com/harshitIIITD/fashion-ai/blob/main/docs/kali-linux-setup.md#nodejs-installation"
    exit 1
fi

# Check npm
echo
echo "📦 Checking npm installation..."
if command -v npm >/dev/null 2>&1; then
    NPM_VERSION=$(npm --version)
    echo "   npm version: $NPM_VERSION"
    echo "   ✅ npm is available"
else
    echo "   ❌ npm is not installed"
    exit 1
fi

# Check system dependencies
echo
echo "🔧 Checking system dependencies..."
MISSING_DEPS=()

# Check individual tools rather than packages
for cmd in curl wget git gcc python3; do
    if ! command -v $cmd >/dev/null 2>&1; then
        MISSING_DEPS+=($cmd)
    fi
done

if [[ ${#MISSING_DEPS[@]} -eq 0 ]]; then
    echo "   ✅ All essential dependencies are available"
else
    echo "   ❌ Missing commands: ${MISSING_DEPS[*]}"
    echo "   Install missing packages with: sudo apt install -y ${MISSING_DEPS[*]}"
    exit 1
fi

# Check npm permissions
echo
echo "🔐 Checking npm permissions..."
NPM_PREFIX=$(npm config get prefix)
if [[ -w "$NPM_PREFIX" ]] || [[ -w "$NPM_PREFIX/lib/node_modules" ]] 2>/dev/null; then
    echo "   ✅ npm permissions look good"
else
    echo "   ⚠️  npm permissions may need fixing"
    echo "   Run: sudo chown -R \$(whoami) \$(npm config get prefix)"
fi

# Check for existing Fashion AI CLI installation
echo
echo "🎯 Checking Fashion AI CLI installation..."
if command -v fashion-ai >/dev/null 2>&1; then
    FASHION_AI_VERSION=$(fashion-ai --version 2>/dev/null | head -1)
    echo "   ✅ Fashion AI CLI is installed: $FASHION_AI_VERSION"
elif command -v gemini >/dev/null 2>&1; then
    GEMINI_VERSION=$(gemini --version 2>/dev/null | head -1)
    echo "   ✅ Gemini CLI is installed: $GEMINI_VERSION"
else
    echo "   ℹ️  Fashion AI CLI is not installed yet"
    echo "   To install: npm install -g @google/gemini-cli"
    echo "   Or use: npx @google/gemini-cli"
fi

# Check .gemini directory
echo
echo "📁 Checking configuration directory..."
if [[ -d "$HOME/.gemini" ]]; then
    echo "   ✅ .gemini directory exists"
    if [[ -f "$HOME/.gemini/settings.json" ]]; then
        echo "   ✅ settings.json exists"
    else
        echo "   ℹ️  settings.json will be created on first run"
    fi
else
    echo "   ℹ️  .gemini directory will be created on first run"
fi

# Check internet connectivity
echo
echo "🌐 Checking internet connectivity..."
if curl -s --max-time 5 https://www.google.com >/dev/null; then
    echo "   ✅ Internet connection is working"
else
    echo "   ❌ No internet connection or connectivity issues"
    echo "   Fashion AI CLI requires internet access to work"
fi

# Check authentication options
echo
echo "🔑 Checking authentication setup..."
if [[ -n "$GEMINI_API_KEY" ]]; then
    echo "   ✅ GEMINI_API_KEY environment variable is set"
elif [[ -n "$GOOGLE_API_KEY" ]]; then
    echo "   ✅ GOOGLE_API_KEY environment variable is set"
elif [[ -f "$HOME/.gemini/auth/tokens.json" ]]; then
    echo "   ✅ OAuth tokens found"
else
    echo "   ℹ️  No authentication configured yet"
    echo "   You'll need to set up authentication on first run"
    echo "   📖 See: https://github.com/harshitIIITD/fashion-ai/blob/main/docs/kali-linux-setup.md#authentication-setup"
fi

echo
echo "🎉 System check completed!"
echo
echo "📖 For complete setup instructions, visit:"
echo "   https://github.com/harshitIIITD/fashion-ai/blob/main/docs/kali-linux-setup.md"
echo
echo "⚡ Quick start commands:"
echo "   npm install -g @google/gemini-cli"
echo "   fashion-ai"
echo