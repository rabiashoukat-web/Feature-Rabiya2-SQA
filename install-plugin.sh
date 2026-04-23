#!/bin/bash
# Jenkins Plugin Installer Script
# Usage: ./install-plugin.sh <plugin-name>

if [ $# -eq 0 ]; then
    echo "Usage: $0 <plugin-name>"
    echo "Example: $0 git"
    exit 1
fi

PLUGIN_NAME=$1
JENKINS_CONTAINER="test-automation-1-jenkins-1"
PLUGINS_DIR="/var/jenkins_home/plugins"

echo "Installing Jenkins plugin: $PLUGIN_NAME"

# Download plugin
docker exec $JENKINS_CONTAINER curl -L -o $PLUGINS_DIR/$PLUGIN_NAME.jpi \
    https://updates.jenkins.io/download/plugins/$PLUGIN_NAME/latest/$PLUGIN_NAME.hpi

if [ $? -eq 0 ]; then
    echo "✅ Plugin $PLUGIN_NAME downloaded successfully"
    echo "🔄 Restarting Jenkins to load plugin..."
    docker restart $JENKINS_CONTAINER
    echo "✅ Plugin installation complete"
else
    echo "❌ Failed to download plugin $PLUGIN_NAME"
    exit 1
fi