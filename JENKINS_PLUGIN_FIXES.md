# Jenkins Plugin Installation Solutions

## Problem: Plugin Downloads Failing

### Root Causes:
1. **Network timeouts** during plugin downloads
2. **Jenkins Update Center connectivity issues**
3. **Proxy/firewall blocking downloads**
4. **Concurrent installation conflicts**

## ✅ Solutions Applied:

### 1. Manual Plugin Installation (Already Done)
- ✅ htmlpublisher
- ✅ pipeline-stage-view
- ✅ pipeline-utility-steps

### 2. Plugin Installer Script
Use the `install-plugin.sh` script for future installations:

```bash
# Install individual plugins
./install-plugin.sh git
./install-plugin.sh github
./install-plugin.sh docker-workflow
```

### 3. Bulk Plugin Installation
For multiple plugins at once:

```bash
# Create a plugins list
cat > plugins.txt << EOF
git:latest
github:latest
docker-workflow:latest
blueocean:latest
EOF

# Install all plugins
while read plugin; do
    name=$(echo $plugin | cut -d: -f1)
    ./install-plugin.sh $name
done < plugins.txt
```

### 4. Alternative: Pre-install Plugins in Dockerfile

```dockerfile
FROM jenkins/jenkins:lts

# Copy plugins to Jenkins home
COPY plugins.txt /usr/share/jenkins/ref/plugins.txt
RUN jenkins-plugin-cli --plugin-file /usr/share/jenkins/ref/plugins.txt

# Plugin list format: plugin-name:version
# Example plugins.txt:
# git:4.13.0
# workflow-aggregator:2.6
# pipeline-stage-view:2.24
```

### 5. Jenkins Configuration Fixes

**In Jenkins Web UI:**
1. Go to **Manage Jenkins** → **Manage Plugins**
2. Click **Advanced** tab
3. **Update Site**: `https://updates.jenkins.io/update-center.json`
4. **Connection Timeout**: Increase to 60 seconds
5. **Retry Count**: Set to 3

### 6. Network Troubleshooting

```bash
# Test connectivity from container
docker exec test-automation-1-jenkins-1 curl -I https://updates.jenkins.io/

# Check DNS resolution
docker exec test-automation-1-jenkins-1 nslookup updates.jenkins.io

# Test plugin download
docker exec test-automation-1-jenkins-1 curl -L -o /tmp/test.hpi \
    https://updates.jenkins.io/download/plugins/git/latest/git.hpi
```

### 7. If All Else Fails: Fresh Jenkins Install

```bash
# Stop and remove current setup
docker compose down -v

# Clean up volumes
docker volume rm test-automation-1_jenkins_home

# Rebuild and start fresh
docker compose up -d --build
```

## 🎯 Quick Fix Commands:

```bash
# Install common CI/CD plugins
./install-plugin.sh git
./install-plugin.sh github
./install-plugin.sh docker-workflow
./install-plugin.sh pipeline-utility-steps
./install-plugin.sh htmlpublisher

# Restart Jenkins after plugin installation
docker restart test-automation-1-jenkins-1
```

## 📋 Essential Plugins for Playwright Testing:

- `git` - Git integration
- `github` - GitHub integration
- `pipeline` - Pipeline support
- `docker-workflow` - Docker in pipelines
- `htmlpublisher` - Publish test reports
- `junit` - JUnit test results
- `testng` - TestNG support