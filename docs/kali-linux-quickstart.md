# Fashion AI CLI - Quick Start Commands for Kali Linux

## Prerequisites Check

```bash
# Check current Node.js version (need 20+)
node --version

# Check npm version
npm --version

# Check system architecture
uname -a
```

## Node.js 20+ Installation (if needed)

```bash
# Method 1: NodeSource (Recommended)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Method 2: NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc
nvm install 20 && nvm use 20
```

## Installation Options

```bash
# Option 1: Global install
npm install -g @google/gemini-cli

# Option 2: Run without installing
npx @google/gemini-cli

# Option 3: From source (development)
git clone https://github.com/harshitIIITD/fashion-ai.git
cd fashion-ai && npm install && npm run build
```

## Authentication Setup

```bash
# For Google OAuth (recommended)
fashion-ai  # Follow browser prompts

# For API key authentication
export GEMINI_API_KEY="your-key-here"
fashion-ai

# For Vertex AI
export GOOGLE_API_KEY="your-vertex-key"
export GOOGLE_GENAI_USE_VERTEXAI=true
export GOOGLE_CLOUD_PROJECT="your-project"
fashion-ai
```

## Quick Test Commands

```bash
# Test installation
fashion-ai --version
fashion-ai --help

# Test with fashion prompt
fashion-ai -p "Create a spring color palette"
fashion-ai -p "Analyze sustainable fashion trends"
```

## Troubleshooting Commands

```bash
# Fix npm permissions
sudo chown -R $(whoami) ~/.npm
sudo chown -R $(whoami) $(npm config get prefix)

# Clear authentication
rm -rf ~/.gemini/auth

# Reset npm cache
npm cache clean --force

# Check running processes
ps aux | grep node
```

## Development Commands

```bash
# From source directory
npm install           # Install dependencies
npm run build         # Build project
npm run start         # Start development
npm run test          # Run tests
npm run preflight     # Full validation
```

For detailed instructions, see the [complete Kali Linux setup guide](./kali-linux-setup.md).