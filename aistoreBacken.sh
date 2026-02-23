#!/usr/bin/env bash
set -e

SERVER=ubuntu@43.165.68.133

SCRIPT_DIR=$(cd "$(dirname "$0")" && pwd)
FRONTEND_DIR=$SCRIPT_DIR
BACKEND_DIR=$SCRIPT_DIR/../AutoBackend

REMOTE_BACKEND_DIR=/opt/maxuniverse-shop-api
REMOTE_FRONTEND_DIR=/var/www/maxuniverse.shop/www

cd "$BACKEND_DIR"

echo "▶ 处理 jar → app.jar"
JAR_FILE=$(ls target/*.jar | grep -v sources | grep -v javadoc | head -n 1)
cp "$JAR_FILE" target/app.jar

echo "▶ 上传后端 app.jar"
scp target/app.jar "$SERVER:$REMOTE_BACKEND_DIR/app.jar"

echo "▶ 上传后端配置"
scp "$BACKEND_DIR/src/main/resources/application-prod.yaml" \
    "$SERVER:$REMOTE_BACKEND_DIR/config/"

echo "▶ 使用 systemd 重启后端（唯一方式）"
ssh "$SERVER" "
sudo systemctl restart maxuniverse-shop-api &&
sudo systemctl status maxuniverse-shop-api --no-pager
"
