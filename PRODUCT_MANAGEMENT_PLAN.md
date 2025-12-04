# Medusa 产品管理 API 完整方案

## 概述
本文档提供了使用 Medusa API 进行产品类别管理、产品添加、价格设置和媒体文件上传的完整方案。

## 1. Cloudinary 配置

### 环境变量配置
在 `.env` 文件中添加：
```env
# Cloudinary 配置
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_FOLDER=veebipop-products
```

### Medusa 配置更新
在 `medusa-config.ts` 中添加：
```typescript
fileSystemProvider: {
  resolve: "@medusajs/file-cloudinary",
  options: {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    folder: process.env.CLOUDINARY_FOLDER || "medusa-uploads",
  },
},
```

## 2. API 脚本结构

### 2.1 产品类别管理脚本 (`scripts/category-management.js`)
功能：
- 创建产品类别
- 获取所有类别
- 更新类别信息
- 删除类别

### 2.2 产品管理脚本 (`scripts/product-management.js`)
功能：
- 创建新产品
- 获取产品列表
- 更新产品信息
- 删除产品
- 产品搜索

### 2.3 价格管理脚本 (`scripts/price-management.js`)
功能：
- 设置产品价格
- 创建价格列表
- 管理货币价格
- 促销价格设置

### 2.4 产品变体管理脚本 (`scripts/variant-management.js`)
功能：
- 创建产品变体
- 管理变体选项（尺寸、颜色等）
- 设置变体库存
- 变体价格管理

### 2.5 媒体上传脚本 (`scripts/media-upload.js`)
功能：
- 上传产品图片到 Cloudinary
- 管理产品媒体文件
- 设置图片排序
- 媒体文件删除

## 3. API 使用示例

### 3.1 创建产品类别
```javascript
// POST /admin/product-categories
const categoryData = {
  name: "服装",
  handle: "clothing",
  is_active: true,
  is_internal: false,
  parent_category_id: null
};
```

### 3.2 创建产品
```javascript
// POST /admin/products
const productData = {
  title: "基础 T 恤",
  handle: "basic-tshirt",
  subtitle: "舒适日常穿着",
  description: "高质量纯棉 T 恤",
  status: "published",
  categories: [{ id: "category_id" }],
  options: [
    { title: "尺寸" },
    { title: "颜色" }
  ],
  variants: [
    {
      title: "S / 黑色",
      sku: "TSHIRT-S-BLK",
      manage_inventory: true,
      allow_backorder: false,
      inventory_quantity: 100,
      prices: [
        {
          currency_code: "cny",
          amount: 99.00
        }
      ],
      options: [
        { value: "S" },
        { value: "黑色" }
      ]
    }
  ]
};
```

### 3.3 上传媒体文件
```javascript
// POST /admin/uploads
const formData = new FormData();
formData.append('files', imageFile);
```

## 4. 完整工作流程

### 4.1 设置流程
1. 配置 Cloudinary
2. 安装必要依赖
3. 重启 Medusa 服务器
4. 验证配置

### 4.2 产品创建流程
1. 创建产品类别
2. 上传产品图片到 Cloudinary
3. 创建产品基本信息
4. 添加产品变体
5. 设置价格和库存
6. 发布产品

### 4.3 产品管理流程
1. 获取产品列表
2. 更新产品信息
3. 管理库存
4. 调整价格
5. 处理媒体文件

## 5. 错误处理和最佳实践

### 5.1 API 错误处理
- 统一错误响应格式
- 重试机制
- 日志记录

### 5.2 性能优化
- 批量操作
- 缓存策略
- 分页处理

### 5.3 安全考虑
- API 密钥管理
- 权限验证
- 数据验证

## 6. 测试方案

### 6.1 单元测试
- API 端点测试
- 数据验证测试
- 错误处理测试

### 6.2 集成测试
- 完整工作流测试
- Cloudinary 集成测试
- 性能测试

## 7. 部署和维护

### 7.1 生产环境配置
- 环境变量管理
- 安全配置
- 监控设置

### 7.2 维护任务
- 定期备份
- 性能监控
- 安全更新

## 8. 扩展功能

### 8.1 高级功能
- 批量导入/导出
- 自动化工作流
- 高级搜索

### 8.2 集成选项
- 第三方服务集成
- 自定义插件开发
- API 扩展

## 下一步

1. 等待 Cloudinary 配置信息
2. 创建具体的 API 脚本
3. 实施测试方案
4. 部署到生产环境