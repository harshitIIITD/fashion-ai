# Running Fashion AI CLI on Kali Linux

This guide provides comprehensive instructions for setting up and running Fashion AI CLI on Kali Linux systems.

> **Quick Start**: If you just want the essential commands, see our [Kali Linux Quick Start Guide](./kali-linux-quickstart.md).

## Prerequisites

### System Requirements

- **Operating System**: Kali Linux (any recent version)
- **Node.js**: Version 20.0.0 or higher
- **Memory**: At least 2GB RAM recommended
- **Storage**: At least 1GB free space for dependencies

### Required System Packages

Install essential build tools and dependencies:

```bash
# Update package list
sudo apt update

# Install essential build tools
sudo apt install -y curl wget git build-essential python3 python3-pip

# Install additional tools that may be needed
sudo apt install -y unzip tar gzip ca-certificates
```

## Node.js Installation

Kali Linux may not have Node.js 20+ by default. Here are several methods to install the correct version:

### Method 1: Using NodeSource Repository (Recommended)

```bash
# Download and install NodeSource repository
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -

# Install Node.js
sudo apt install -y nodejs

# Verify installation
node --version  # Should show v20.x.x
npm --version   # Should show npm version
```

### Method 2: Using Node Version Manager (NVM)

```bash
# Install NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# Reload your shell or run:
source ~/.bashrc

# Install and use Node.js 20
nvm install 20
nvm use 20
nvm alias default 20

# Verify installation
node --version
```

### Method 3: Manual Installation

```bash
# Download Node.js 20 binary
wget https://nodejs.org/dist/v20.19.4/node-v20.19.4-linux-x64.tar.xz

# Extract and install
tar -xf node-v20.19.4-linux-x64.tar.xz
sudo mv node-v20.19.4-linux-x64 /opt/nodejs
sudo ln -s /opt/nodejs/bin/node /usr/local/bin/node
sudo ln -s /opt/nodejs/bin/npm /usr/local/bin/npm

# Verify installation
node --version
```

## Installation Methods

### Option 1: Global Installation via NPM (Easiest)

```bash
# Install globally
npm install -g @google/gemini-cli

# Run the CLI
fashion-ai
# or
gemini
```

### Option 2: Run with NPX (No Installation)

```bash
# Run directly without installation
npx @google/gemini-cli
```

### Option 3: From Source (For Development)

```bash
# Clone the repository
git clone https://github.com/harshitIIITD/fashion-ai.git
cd fashion-ai

# Install dependencies
npm install

# Build the project
npm run build

# Run from source
npm run start
# or use the built binary
node bundle/gemini.js
```

### Option 4: Docker Installation

If you prefer containerized execution:

```bash
# Pull the Docker image
docker pull us-docker.pkg.dev/gemini-code-dev/gemini-cli/sandbox:0.1.21

# Run in Docker
docker run --rm -it us-docker.pkg.dev/gemini-code-dev/gemini-cli/sandbox:0.1.21

# Or run with local directory mounted
docker run --rm -it -v $(pwd):/workspace us-docker.pkg.dev/gemini-code-dev/gemini-cli/sandbox:0.1.21
```

## Authentication Setup

Fashion AI CLI supports multiple authentication methods:

### Option 1: OAuth with Google Account (Recommended)

```bash
# Start the CLI
fashion-ai

# Choose OAuth authentication when prompted
# Follow the browser authentication flow
```

### Option 2: Gemini API Key

```bash
# Get your API key from https://aistudio.google.com/apikey
export GEMINI_API_KEY="your-api-key-here"

# Run the CLI
fashion-ai
```

### Option 3: Vertex AI (Enterprise)

```bash
# Install Google Cloud CLI
curl https://sdk.cloud.google.com | bash
exec -l $SHELL
gcloud init

# Authenticate
gcloud auth application-default login

# Set environment variables
export GOOGLE_API_KEY="your-vertex-api-key"
export GOOGLE_GENAI_USE_VERTEXAI=true
export GOOGLE_CLOUD_PROJECT="your-project-id"

# Run the CLI
fashion-ai
```

## Kali Linux Specific Configurations

### File Permissions

Ensure proper permissions for the CLI directories:

```bash
# Create .gemini directory with correct permissions
mkdir -p ~/.gemini
chmod 755 ~/.gemini

# Set npm global directory permissions (if using global install)
sudo chown -R $(whoami) $(npm config get prefix)/{lib/node_modules,bin,share}
```

### Firewall Configuration

If you're running local telemetry or MCP servers:

```bash
# Allow local ports for telemetry (if using local telemetry)
sudo ufw allow 16686  # Jaeger UI
sudo ufw allow 4317   # OTEL collector

# Or disable firewall temporarily for testing
sudo ufw disable
```

### Security Context

Kali Linux may have stricter security policies:

```bash
# If you encounter permission issues, you may need to adjust AppArmor
sudo aa-complain /usr/bin/node  # Use with caution

# Or run with specific security context
sudo setsebool -P httpd_can_network_connect 1  # If SELinux is enabled
```

## Verification and Testing

### Automated Setup Verification

Use our verification script to check if your system is properly configured:

```bash
# Download and run the verification script
curl -fsSL https://raw.githubusercontent.com/harshitIIITD/fashion-ai/main/scripts/verify-kali-setup.sh | bash

# Or if you have the repository cloned:
./scripts/verify-kali-setup.sh
```

This script will check:
- Node.js version (20+)
- npm installation and permissions
- System dependencies
- Internet connectivity
- Authentication setup
- Fashion AI CLI installation status

### Manual Testing

#### Test Basic Functionality

```bash
# Test CLI installation
fashion-ai --version

# Test help command
fashion-ai --help

# Test with a simple prompt
fashion-ai -p "Hello, Fashion AI!"
```

### Test Fashion-Specific Features

```bash
# Test trend analysis
fashion-ai -p "Analyze spring 2024 trends for women's apparel"

# Test color palette generation
fashion-ai -p "Create a color palette inspired by ocean themes"

# Test market research
fashion-ai -p "Research sustainable fashion trends"
```

## Troubleshooting

### Common Issues and Solutions

#### Node.js Version Issues

```bash
# Check current Node.js version
node --version

# If version is below 20.0.0, reinstall using one of the methods above
```

#### Permission Denied Errors

```bash
# Fix npm permissions
sudo chown -R $(whoami) ~/.npm
sudo chown -R $(whoami) $(npm config get prefix)

# Or configure npm to use a different directory
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
export PATH=~/.npm-global/bin:$PATH
```

#### Network/Firewall Issues

```bash
# Check if ports are blocked
sudo netstat -tlnp | grep :4317
sudo netstat -tlnp | grep :16686

# Test internet connectivity
curl -I https://generativelanguage.googleapis.com
```

#### Authentication Issues

```bash
# Clear existing authentication
rm -rf ~/.gemini/auth

# For Google Cloud authentication issues
gcloud auth revoke
gcloud auth application-default login
```

#### Build Issues from Source

```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# If build fails, try with verbose logging
npm run build --verbose
```

### Getting Help

If you encounter issues not covered here:

1. Check the [troubleshooting guide](./troubleshooting.md)
2. Use the CLI's built-in bug reporting: `fashion-ai /bug`
3. Search existing [GitHub issues](https://github.com/harshitIIITD/fashion-ai/issues)
4. Create a new issue with detailed error information

## Advanced Configuration

### Custom MCP Servers

Configure custom Model Context Protocol servers in `~/.gemini/settings.json`:

```json
{
  "telemetry": {
    "enabled": false
  },
  "mcpServers": {
    "fashion-tools": {
      "command": "npx",
      "args": ["@fashion/mcp-server"]
    }
  }
}
```

### Telemetry Setup

For local telemetry and monitoring:

```bash
# Start local telemetry services
npm run telemetry -- --target=local

# View traces at http://localhost:16686
```

### Development Environment

For contributing to the project:

```bash
# Clone and setup for development
git clone https://github.com/harshitIIITD/fashion-ai.git
cd fashion-ai

# Install dependencies
npm install

# Run preflight checks
npm run preflight

# Start development server
npm run start

# Run tests
npm run test
```

## Performance Optimization

### For Better Performance on Kali Linux

```bash
# Increase Node.js memory limit if needed
export NODE_OPTIONS="--max-old-space-size=4096"

# Use faster DNS resolver
echo "nameserver 8.8.8.8" | sudo tee /etc/resolv.conf

# Optimize npm for faster installs
npm config set registry https://registry.npmjs.org/
npm config set cache ~/.npm-cache
```

### Resource Monitoring

```bash
# Monitor resource usage
htop

# Monitor Node.js processes
ps aux | grep node

# Check disk usage
df -h
du -sh ~/.gemini
```

## Next Steps

After successful installation:

1. Read the [getting started guide](./cli/index.md)
2. Explore [fashion-specific features](../README.md#-key-features)
3. Set up [MCP servers](./tools/mcp-server.md) for extended functionality
4. Configure [IDE integration](./ide-integration.md) for VS Code

For questions specific to fashion industry use cases, see the [fashion demo](../fashion-demo.md) and [fashion tools demo](../fashion-tools-demo.md).