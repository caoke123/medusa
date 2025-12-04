# Cloudinary 配置指南

## 概述
本文档介绍如何在 Medusa v2 中配置 Cloudinary 作为文件存储提供商。

## 步骤 1: 安装必要的依赖

首先，需要安装 Cloudinary 文件模块：

```bash
cd veebipop-backend-v2
npm install @medusajs/file-cloudinary
```

## 步骤 2: 配置环境变量

在 `.env` 文件中添加以下 Cloudinary 配置：

```env
# Cloudinary 配置
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_FOLDER=veebipop-products
```

## 步骤 3: 更新 Medusa 配置

在 `medusa-config.ts` 中添加 Cloudinary 文件模块配置：

```typescript
import { loadEnv, defineConfig } from '@medusajs/framework/utils'

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    },
    // 添加文件存储配置
    fileSystemProvider: {
      resolve: "@medusajs/file-cloudinary",
      options: {
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
        folder: process.env.CLOUDINARY_FOLDER || "medusa-uploads",
      },
    },
  }
})
```

## 步骤 4: 重启 Medusa 服务器

配置完成后，需要重启 Medusa 开发服务器：

```bash
# 停止当前运行的服务器 (Ctrl+C)
# 然后重新启动
npm run dev
```

## 验证配置

配置完成后，您可以通过以下方式验证 Cloudinary 是否正确配置：

1. 在管理面板中上传产品图片
2. 检查图片是否成功上传到 Cloudinary
3. 确认图片 URL 指向 Cloudinary 域名

## 常见问题

### 问题 1: 上传失败
- 检查 Cloudinary 凭据是否正确
- 确认 Cloudinary 账户有足够的配额
- 检查网络连接

### 问题 2: 图片不显示
- 确认 Cloudinary 文件夹权限设置
- 检查 CORS 配置
- 验证图片 URL 格式

## 下一步

配置完成后，您可以：
1. 创建产品类别
2. 添加产品和变体
3. 上传产品图片到 Cloudinary
4. 设置产品价格