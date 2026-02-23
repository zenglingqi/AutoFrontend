#!/usr/bin/env bash
set -e

SERVER=ubuntu@43.165.68.133

SCRIPT_DIR=$(cd "$(dirname "$0")" && pwd)
FRONTEND_DIR=$SCRIPT_DIR
BACKEND_DIR=$SCRIPT_DIR/../AutoBackend

REMOTE_BACKEND_DIR=/opt/maxuniverse-shop-api
REMOTE_FRONTEND_DIR=/var/www/maxuniverse.shop/www


rm -rf .next

echo "▶ 编译前端"

cd "$FRONTEND_DIR"
npm run build


echo "▶ 上传前端必要文件"
# 1. 上传编译结果 (.next)
# 2. 上传静态资源 (public)
# 3. 上传环境配置 (.env, next.config.mjs)
# 4. 上传运行脚本 (package.json)
scp -r .next public .env next.config.ts package.json "$SERVER:$REMOTE_FRONTEND_DIR/"

#tailwind.config.cjs	否	仅编译时需要。
#postcss.config.mjs	否	仅编译时需要
#755 建议不二次上传后改为，要777

ssh "$SERVER" "
    cd $REMOTE_FRONTEND_DIR

    # 修复权限
    sudo chmod -R 755 .

    # 安装生产环境依赖 (不安装 devDependencies，节省空间和时间)
    #npm install --production

    pm2 restart all
    # 使用 PM2 重启服务 (假设你之前已启动过，起名为 max-store)
    #pm2 reload www-maxuniverse-shop || pm2 start npm --name 'www-maxuniverse-shop' -- start
"

echo "✅ 一条命令完成前后端发布（systemd 版）"
