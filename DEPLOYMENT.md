# Vercel 自动化部署指南

## 概述

使用 Vercel + GitHub 实现代码修改后自动部署的效果。

## 方案选择

### 方案A：Vercel + GitHub（推荐）

**优势**：
- 完全免费
- 自动 HTTPS + CDN
- 边缘节点全球加速
- 预览功能
- Git 版本管理

---

## 方案A 实施步骤

### 第1步：初始化 Git 仓库

如果你的项目还没有初始化 Git：

```bash
# 初始化 Git
git init

# 添加所有文件到 Git
git add .

# 首次提交
git commit -m "Initial commit: Academic homepage"
```

### 第2步：创建 GitHub 仓库

1. 登录 [GitHub](https://github.com/new)
2. 创建新仓库，命名为 `academic-homepage`（或你喜欢的名字）
3. 可选：设置为 Private（私有仓库）
4. 创建完成后，会显示远程仓库地址，类似：
   ```
   https://github.com/yourusername/academic-homepage.git
   ```

### 第3步：连接本地仓库到 GitHub

```bash
# 添加远程仓库（替换为你的仓库地址）
git remote add origin https://github.com/yourusername/academic-homepage.git

# 推送到 GitHub（首次需要输入 GitHub 用户名和密码）
git push -u origin main
```

### 第4步：连接 Vercel 到 GitHub

1. 登录 [Vercel Dashboard](https://vercel.com/dashboard)
2. 点击 "Add New Project" 或 "Import Project"
3. 选择 "Import Git Repository"
4. 授权 Vercel 访问你的 GitHub 仓库
5. Vercel 会自动检测到你的 `academic-homepage` 仓库
6. 点击 "Import" 或 "Deploy"
7. Vercel 会自动构建和部署

### 第5步：配置自定义域名（可选）

1. 在 Vercel 项目设置中
2. 点击 "Settings" → "Domains"
3. 添加你的自定义域名（如 `yourdomain.com`）
4. 按照提示配置 DNS

---

## 后续更新流程（你的新工作流）

### 工作流 A：直接在网页上编辑

1. 点击 "编辑" 按钮进入编辑模式
2. 修改内容
3. 点击 "保存" 按钮
4. 刷新页面查看更新 ✓

### 工作流 B：使用 Vercel CLI（推荐用于频繁更新）

1. 在编辑器中修改 `js/data.js`
2. 保存文件
3. 在项目目录运行部署命令：
   ```bash
   vercel deploy --prod
   ```
4. Vercel 会自动构建和部署，通常 30-60 秒完成

### 工作流 C：完全自动化（最佳方案）

**在保存按钮中添加 Git Push 功能**

1. 点击 "保存" 后，自动生成并执行 Git 命令
2. 自动推送到 GitHub
3. Vercel 自动检测并部署

**实现方式**：
- 使用 Git LFS 处理大文件推送限制
- 配置 Webhook 实现零延迟部署

---

## 快速开始（30秒完成部署）

如果你已经有了 Git 仓库和 Vercel 项目：

```bash
# 一次性配置（只需执行一次）
git remote set-url origin https://github.com/yourusername/academic-homepage.git

# 后续每次更新只需要执行
git add js/data.js
git commit -m "Update: $(date)"
git push origin main
```

---

## 版本管理建议

### 开发分支策略

```bash
# 创建开发分支
git checkout -b develop

# 在 develop 分支上进行编辑和测试
# 完成后合并到 main 分支
git checkout main
git merge develop
git push origin main
```

### 标签管理

```bash
# 为重要版本打标签
git tag -a v1.0.0 -m "Release version 1.0.0"

# 推送标签
git push origin v1.0.0
```

---

## Vercel 环境变量配置（可选）

在 Vercel Dashboard → Settings → Environment Variables 中添加：

```bash
NODE_ENV=production
```

---

## 环境说明文件

在项目根目录创建 `.vercelignore` 文件：

```gitignore
# Vercel 部署时忽略的文件
.vercel
.idea
.DS_Store
Thumbs.db
*.log
node_modules
```

---

## Vercel CLI 本地开发（可选）

### 安装 Vercel CLI

```bash
# 使用 npm 安装
npm i -g vercel

# 或使用 yarn 安装
yarn global add vercel

# 或使用 Homebrew 安装（macOS）
brew install vercel-cli

# 验证安装
vercel --version
```

### 本地开发服务器

```bash
# 在项目根目录运行
vercel dev

# 本地开发服务器会启动在 http://localhost:3000
# 热重载时会自动更新
```

### 本地预览生产构建

```bash
# 预览生产构建
vercel --prod preview

# 生成的预览 URL 可以分享给他人
```

---

## 故障排除

### 问题：部署失败

**解决方案**：
1. 检查 Vercel Dashboard 中的部署日志
2. 确保 `js/data.js` 文件格式正确（可以用 JSON validator 验证）
3. 清除缓存：`vercel --prod rm && vercel --prod deploy`

### 问题：构建错误

**解决方案**：
1. 检查浏览器控制台的 JavaScript 错误
2. 确保所有 JavaScript 文件都正确加载
3. 使用 `vercel logs` 查看构建日志

### 问题：自定义域名无法访问

**解决方案**：
1. 等待 DNS 传播（通常 5-60 分钟）
2. 使用 `vercel dns inspect yourdomain.com` 检查 DNS 配置
3. 在域名注册商处检查 DNS 记录

---

## 性能优化建议

### 1. 启用 Vercel 的图片优化

Vercel 会自动优化图片并使用 CDN 加速。

### 2. 使用缓存策略

在 `index.html` 中添加缓存控制：

```html
<head>
  <meta http-equiv="Cache-Control" content="public, max-age=31536000, immutable">
</head>
```

### 3. 压缩资源

Vercel 会自动压缩 HTML、CSS、JavaScript。

---

## 最佳实践

1. **定期备份**：定期将代码推送到 GitHub 作为备份
2. **版本控制**：每次重大更新前创建分支
3. **文档更新**：重大功能更新时更新 `CHANGELOG.md`
4. **测试部署**：部署后在多个浏览器中测试功能
5. **监控状态**：设置 Vercel 状态检查

---

## 相关资源

- [Vercel 文档](https://vercel.com/docs)
- [GitHub 文档](https://docs.github.com/)
- [Git 教程](https://git-scm.com/docs/githug-pages)

---

## 一键部署脚本

创建 `deploy.sh` 文件（在项目根目录）：

```bash
#!/bin/bash

# 自动部署脚本
echo "🚀 开始部署到 Vercel..."

# 提交所有更改
git add .
git commit -m "Auto-commit: $(date '+%Y-%m-%d %H:%M:%S')"

# 推送到 GitHub
git push origin main

echo "✅ 推送完成！"
echo "📦 等待 Vercel 自动部署（约 30-60 秒）..."
echo "🌐 访问你的网站：https://yourdomain.com"

# 可选：打开网站
if [ "$1" == "--open" ]; then
    open https://yourdomain.com
fi
```

使用方法：

```bash
# 添加执行权限
chmod +x deploy.sh

# 执行部署
./deploy.sh
```

---

## 总结

✅ 配置一次（Git + Vercel）
✅ 后续只需：修改 `js/data.js` + 刷新页面 + 推送代码
✅ Vercel 自动部署
✅ 全球 CDN 加速
✅ 自动 HTTPS
✅ Git 版本管理
✅ 完全免费
