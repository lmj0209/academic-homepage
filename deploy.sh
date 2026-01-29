#!/bin/bash
#
# 快速部署脚本 - Vercel + GitHub 自动化
# 使用方法：
#   1. 首次配置：./deploy.sh init
#   2. 每次更新：./deploy.sh push
#

set -e  # 遇到错误时退出

# 颜色定义
RED='\033[1;31m'
GREEN='\033[1;32m'
YELLOW='\033[1;33m'
NC='\033[0m'  # No Color

# 项目配置
REMOTE_REPO=""  # 在这里填入你的 GitHub 仓库地址，格式：https://github.com/username/repo.git
REMOTE_NAME="origin"
MAIN_BRANCH="main"

# Vercel 配置
PROJECT_ID=""  # 首次运行后会自动填充

# 检查命令
check_dependencies() {
    echo -e "${GREEN}检查依赖...${NC}"

    # 检查 Git
    if ! command -v git &> /dev/null; then
        echo -e "${RED}✗ 未安装 Git，正在安装...${NC}"
        if [[ "$OSTYPE" == "darwin"* ]]; then
            brew install git
        else
            echo "请先安装 Git: https://git-scm.com/downloads"
            exit 1
        fi
    fi

    # 检查 Vercel CLI（可选）
    if command -v vercel &> /dev/null; then
        echo -e "${GREEN}✓ 已安装 Vercel CLI${NC}"
    else
        echo -e "${YELLOW}ℹ 未安装 Vercel CLI（可选）${NC}"
    fi

    echo -e "${GREEN}✓ 依赖检查完成${NC}"
}

# 初始化项目
init_project() {
    echo -e "${GREEN}========================================${NC}"
    echo -e "${GREEN}  初始化项目${NC}"
    echo -e "${GREEN}========================================${NC}"

    # 检查是否已有 .git 目录
    if [ -d .git ]; then
        echo -e "${YELLOW}⚠  警告：检测到 .git 目录${NC}"
        echo -e "${YELLOW}  如果需要清理请手动删除：rm -rf .git${NC}"
        read -p "是否继续？(y/n) " -r
        if [ "$REPLY" != "y" ]; then
            echo -e "${RED}已取消${NC}"
            exit 0
        fi
    fi

    # 初始化 Git（如果还没有）
    if [ ! -d .git ]; then
        echo -e "初始化 Git 仓库..."
        git init
        git add .
        git commit -m "Initial commit: Academic homepage - $(date '+%Y-%m-%d %H:%M:%S')"
    else
        echo -e "${GREEN}✓ Git 仓库已初始化${NC}"
    fi

    # 检查远程仓库配置
    if [ -z "$REMOTE_REPO" ]; then
        echo -e "${YELLOW}⚠  请先在脚本顶部配置 REMOTE_REPO 变量${NC}"
        echo -e "${YELLOW}格式：REMOTE_REPO=\"https://github.com/username/repo.git\"${NC}"
        echo -e "${YELLOW}或者使用远程仓库地址作为参数：./deploy.sh init https://github.com/username/repo.git${NC}"
        exit 1
    fi

    # 添加远程仓库
    echo -e "配置远程仓库..."
    if ! git remote | grep -q "$REMOTE_NAME"; then
        git remote add "$REMOTE_NAME" "$REMOTE_REPO"
    else
        echo -e "${GREEN}✓ 远程仓库已配置${NC}"
    fi

    # 推送到 GitHub
    echo -e "推送代码到 GitHub..."
    git push -u "$REMOTE_NAME" "$MAIN_BRANCH"

    if [ $? -eq 0 ]; then
        echo -e "${GREEN}========================================${NC}"
        echo -e "${GREEN}✅ 初始化完成！${NC}"
        echo -e "${GREEN}========================================${NC}"
        echo -e ""
        echo -e "${YELLOW}下一步：${NC}"
        echo -e "1. 登录 Vercel: https://vercel.com/dashboard"
        echo -e "2. 点击 'Add New Project' 或 'Import Project'"
        echo -e "3. 选择 'Import Git Repository'"
        echo -e "4. 连接到你的 GitHub 仓库"
        echo -e "5. Vercel 会自动检测并部署"
        echo -e ""
        echo -e "${YELLOW}💡 提示：配置完成后，以后每次编辑 js/data.js 后只需运行：${NC}"
        echo -e "${YELLOW}   ./deploy.sh push${NC}"
    else
        echo -e "${RED}✗ 推送失败，请检查网络连接和权限${NC}"
        exit 1
    fi
}

# 更新并推送
update_and_push() {
    echo -e "${GREEN}========================================${NC}"
    echo -e "${GREEN}更新并推送代码${NC}"
    echo -e "${GREEN}========================================${NC}"

    # 检查远程仓库配置
    if [ -z "$REMOTE_REPO" ]; then
        echo -e "${YELLOW}⚠  请先运行 ./deploy.sh init 进行初始化${NC}"
        echo -e "${YELLOW}或使用远程仓库地址作为参数${NC}"
        exit 1
    fi

    # 添加文件
    echo -e "添加更新的文件..."
    git add js/data.js

    # 创建提交
    COMMIT_MSG="Update: $(date '+%Y-%m-%d %H:%M:%S') - Site content changes"

    echo -e "创建提交..."
    git commit -m "$COMMIT_MSG"

    if [ $? -ne 0 ]; then
        echo -e "${YELLOW}⚠ 没有检测到更改，无需提交${NC}"
        echo -e "${YELLOW}如果这是误操作，请使用：git status 检查${NC}"
        exit 0
    fi

    # 推送到 GitHub
    echo -e "推送到 GitHub..."
    git push "$REMOTE_NAME" "$MAIN_BRANCH"

    if [ $? -eq 0 ]; then
        echo -e "${GREEN}========================================${NC}"
        echo -e "${GREEN}✅ 推送完成！${NC}"
        echo -e "${GREEN}========================================${NC}"
        echo -e ""
        echo -e "${GREEN}Vercel 正在自动构建和部署...${NC}"
        echo -e "${YELLOW}⏱ 通常需要 30-60 秒完成${NC}"
        echo -e ""
        echo -e "${GREEN}🌐 访问你的网站查看更新：${NC}"
        echo -e "${YELLOW}  https://yourdomain.com${NC}"
        echo -e ""
        echo -e "${GREEN}🎉 后续更新只需运行：./deploy.sh push${NC}"
    else
        echo -e "${RED}✗ 推送失败，请检查：${NC}"
        echo -e "${RED}  1. 网络连接${NC}"
        echo -e "${RED} 2. 远程仓库权限${NC}"
        echo -e "${RED}  3. Git 配置${NC}"
        exit 1
    fi
}

# 部署到 Vercel
deploy_vercel() {
    echo -e "${GREEN}========================================${NC}"
    echo -e "${GREEN}部署到 Vercel${NC}"
    echo -e "${GREEN}========================================${NC}"

    # 检查 Vercel CLI
    if ! command -v vercel &> /dev/null; then
        echo -e "${YELLOW}ℹ Vercel CLI 未安装${NC}"
        echo -e "${YELLOW}安装中...${NC}"
        npm i -g vercel

        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✓ Vercel CLI 安装完成${NC}"
        else
            echo -e "${RED}✗ Vercel CLI 安装失败${NC}"
            echo -e "${YELLOW}请手动安装：npm i -g vercel${NC}"
            exit 1
        fi
    fi

    # 直接部署到生产环境
    echo -e "部署到生产环境..."
    vercel --prod

    if [ $? -eq 0 ]; then
        echo -e "${GREEN}========================================${NC}"
        echo -e "${GREEN}✅ 部署完成！${NC}"
        echo -e "${GREEN}========================================${NC}"
        echo -e ""
        echo -e "${GREEN}🎉 访问你的网站：${NC}"
        echo -e "${YELLOW}  https://yourdomain.com${NC}"
    else
        echo -e "${RED}✗ 部署失败${NC}"
        echo -e "${YELLOW}请检查：${NC}"
        echo -e "1. Vercel CLI 状态${NC}"
        echo -e "2. 项目文件完整性${NC}"
        exit 1
    fi
}

# 本地开发服务器
dev_server() {
    echo -e "${GREEN}========================================${NC}"
    echo -e "${GREEN}本地开发服务器${NC}"
    echo -e "${GREEN}========================================${NC}"

    # 检查依赖
    if ! command -v vercel &> /dev/null; then
        echo -e "${YELLOW}启动 Vercel 开发服务器...${NC}"
        vercel dev &
        DEV_PID=$!

        echo -e "${GREEN}✓ 开发服务器启动${NC}"
        echo -e "${YELLOW}地址：http://localhost:3000${NC}"
        echo -e "${YELLOW}按 Ctrl+C 停止${NC}"
        echo -e "${YELLOW}或运行：./deploy.sh stop${NC}"
        echo -e ""

        # 等待进程
        wait $DEV_PID

        echo -e "${GREEN}开发服务器已停止${NC}"
    else
        echo -e "${YELLOW}直接运行：vercel dev${NC}"
        exit 1
    fi
}

# 停止开发服务器
stop_dev_server() {
    if [ -f ".vercel-dev.pid" ]; then
        DEV_PID=$(cat .vercel-dev.pid)
        kill $DEV_PID 2>/dev/null
        rm .vercel-dev.pid
        echo -e "${GREEN}✓ 开发服务器已停止${NC}"
    else
        echo -e "${YELLOW}未找到运行中的开发服务器${NC}"
    fi
}

# 预览生产构建
preview_build() {
    echo -e "${GREEN}========================================${NC}"
    echo -e "${GREEN}预览生产构建${NC}"
    echo -e "${GREEN}========================================${NC}"

    echo -e "生成预览构建..."
    vercel --prod preview

    echo -e "${GREEN}✓ 预览构建完成${NC}"
    echo -e "${GREEN}访问预览：${NC}"
    vercel ls
}

# 显示状态
show_status() {
    echo -e "${GREEN}========================================${NC}"
    echo -e "${GREEN}当前状态${NC}"
    echo -e "${GREEN}========================================${NC}"

    echo -e "Git 状态："
    if [ -d .git ]; then
        echo -e "${GREEN}✓ Git 仓库已初始化${NC}"

        if [ -n "$REMOTE_REPO" ]; then
            echo -e "${YELLOW}ℹ 未配置远程仓库${NC}"
        else
            echo -e "${GREEN}✓ 远程仓库：$REMOTE_REPO${NC}"
        fi

        # 显示最新提交
        echo -e "最近提交："
        git log -1 --oneline
    else
        echo -e "${YELLOW}ℹ Git 仓库未初始化${NC}"
    fi

    echo -e ""
    echo -e "Vercel CLI："
    if command -v vercel &> /dev/null; then
        echo -e "${GREEN}✓ 已安装${NC}"
    else
        echo -e "${YELLOW}未安装（运行 ./deploy.sh vercel 安装）${NC}"
    fi

    if [ -n "$PROJECT_ID" ]; then
        echo -e "${YELLOW}未连接到 Vercel 项目${NC}"
        echo -e "${YELLOW}首次部署请运行：./deploy.sh init${NC}"
    else
        echo -e "${GREEN}✓ 项目 ID：$PROJECT_ID${NC}"
    fi
}

# 帮助信息
show_help() {
    cat << 'EOF'
${GREEN}使用方法：${NC}

${YELLOW}初始化项目（首次使用）:${NC}
  ./deploy.sh init [远程仓库地址]
  或：编辑脚本中的 REMOTE_REPO 变量，然后运行
  ./deploy.sh init

${YELLOW}更新并推送（日常使用）:${NC}
  ./deploy.sh push

${YELLOW}其他命令：${NC}
  ./deploy.sh vercel          # 部署到 Vercel 生产环境
  ./deploy.sh dev             # 启动本地开发服务器
  ./deploy.sh stop           # 停止开发服务器
  ./deploy.sh preview         # 预览生产构建
  ./deploy.sh status          # 查看当前状态

${GREEN}配置远程仓库：${NC}
  在脚本顶部设置 REMOTE_REPO 变量：
  REMOTE_REPO="https://github.com/yourusername/your-repo.git"

${GREEN}配置本地 Git：${NC}
  1. 克隆你的 GitHub 仓库到本地
  2. 将现有的文件复制到仓库目录
  3. 运行 ./deploy.sh push

${YELLOW}故障排除：${NC}
  - 如果遇到权限错误，检查远程仓库的访问权限
  - 如果遇到连接错误，检查网络和防火墙设置
  - 清理 Git 缓存：rm -rf .git

${GREEN}参考文档：${NC}
  DEPLOYMENT.md
  https://vercel.com/docs
  https://docs.github.com/

EOF
}

# 主程序
main() {
    # 解析命令行参数
    COMMAND="${1:-init}"
    REPO_OVERRIDE="${2:-}"

    # 解析参数
    shift
    while [[ $# -gt 0 ]]; do
        case "$1" in
            init)
                COMMAND="init"
                ;;
            push)
                COMMAND="push"
                ;;
            vercel)
                COMMAND="vercel"
                ;;
            dev)
                COMMAND="dev"
                ;;
            stop)
                COMMAND="stop"
                ;;
            preview)
                COMMAND="preview"
                ;;
            status)
                COMMAND="status"
                ;;
            help|--help|-h)
                COMMAND="help"
                ;;
            *)
                # 处理远程仓库参数
                if [[ "$1" =~ ^https?://.*\.git$ ]]; then
                    REPO_OVERRIDE="$1"
                fi
                ;;
        esac
        shift
    done

    # 如果提供了远程仓库地址，覆盖默认配置
    if [ -n "$REPO_OVERRIDE" ]; then
        REMOTE_REPO="$REPO_OVERRIDE"
    fi

    # 根据命令执行相应操作
    case "$COMMAND" in
        init)
            check_dependencies
            init_project
            ;;
        push)
            check_dependencies
            update_and_push
            ;;
        vercel)
            deploy_vercel
            ;;
        dev)
            dev_server
            ;;
        stop)
            stop_dev_server
            ;;
        preview)
            preview_build
            ;;
        status)
            show_status
            ;;
        help)
            show_help
            ;;
        *)
            echo -e "${RED}未知命令: $1${NC}"
            echo -e ""
            show_help
            exit 1
            ;;
    esac
}

# 执行主程序
main "$@"
