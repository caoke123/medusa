# Medusa API 脚本实现指南

## 概述
本文档提供了完整的 Medusa API 脚本代码示例，用于产品类别管理、产品添加、价格设置和媒体文件上传。

## 1. 产品类别管理脚本

### 文件: `scripts/category-management.js`

```javascript
/**
 * 产品类别管理 API 脚本
 * 功能：创建、获取、更新、删除产品类别
 */

const axios = require('axios');

class CategoryManager {
  constructor(baseURL, apiKey) {
    this.client = axios.create({
      baseURL: baseURL,
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });
  }

  // 创建产品类别
  async createCategory(categoryData) {
    try {
      const response = await this.client.post('/admin/product-categories', categoryData);
      console.log('类别创建成功:', response.data.product_category);
      return response.data.product_category;
    } catch (error) {
      console.error('创建类别失败:', error.response?.data || error.message);
      throw error;
    }
  }

  // 获取所有类别
  async getAllCategories(limit = 50, offset = 0) {
    try {
      const response = await this.client.get(`/admin/product-categories?limit=${limit}&offset=${offset}`);
      return response.data.product_categories;
    } catch (error) {
      console.error('获取类别失败:', error.response?.data || error.message);
      throw error;
    }
  }

  // 获取单个类别
  async getCategory(categoryId) {
    try {
      const response = await this.client.get(`/admin/product-categories/${categoryId}`);
      return response.data.product_category;
    } catch (error) {
      console.error('获取类别详情失败:', error.response?.data || error.message);
      throw error;
    }
  }

  // 更新类别
  async updateCategory(categoryId, updateData) {
    try {
      const response = await this.client.post(`/admin/product-categories/${categoryId}`, updateData);
      console.log('类别更新成功:', response.data.product_category);
      return response.data.product_category;
    } catch (error) {
      console.error('更新类别失败:', error.response?.data || error.message);
      throw error;
    }
  }

  // 删除类别
  async deleteCategory(categoryId) {
    try {
      const response = await this.client.delete(`/admin/product-categories/${categoryId}`);
      console.log('类别删除成功');
      return response.data;
    } catch (error) {
      console.error('删除类别失败:', error.response?.data || error.message);
      throw error;
    }
  }
}

// 使用示例
const categoryManager = new CategoryManager('http://localhost:9000', 'your_api_key');

// 创建示例类别
const exampleCategory = {
  name: "服装",
  handle: "clothing",
  is_active: true,
  is_internal: false,
  description: "各种服装产品"
};

module.exports = CategoryManager;
```

## 2. 产品管理脚本

### 文件: `scripts/product-management.js`

```javascript
/**
 * 产品管理 API 脚本
 * 功能：创建、获取、更新、删除产品
 */

const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

class ProductManager {
  constructor(baseURL, apiKey) {
    this.client = axios.create({
      baseURL: baseURL,
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });
  }

  // 创建产品
  async createProduct(productData) {
    try {
      const response = await this.client.post('/admin/products', productData);
      console.log('产品创建成功:', response.data.product);
      return response.data.product;
    } catch (error) {
      console.error('创建产品失败:', error.response?.data || error.message);
      throw error;
    }
  }

  // 获取产品列表
  async getProducts(limit = 50, offset = 0, filters = {}) {
    try {
      const queryParams = new URLSearchParams({
        limit: limit.toString(),
        offset: offset.toString(),
        ...filters
      });
      
      const response = await this.client.get(`/admin/products?${queryParams}`);
      return response.data.products;
    } catch (error) {
      console.error('获取产品列表失败:', error.response?.data || error.message);
      throw error;
    }
  }

  // 获取单个产品
  async getProduct(productId) {
    try {
      const response = await this.client.get(`/admin/products/${productId}`);
      return response.data.product;
    } catch (error) {
      console.error('获取产品详情失败:', error.response?.data || error.message);
      throw error;
    }
  }

  // 更新产品
  async updateProduct(productId, updateData) {
    try {
      const response = await this.client.post(`/admin/products/${productId}`, updateData);
      console.log('产品更新成功:', response.data.product);
      return response.data.product;
    } catch (error) {
      console.error('更新产品失败:', error.response?.data || error.message);
      throw error;
    }
  }

  // 删除产品
  async deleteProduct(productId) {
    try {
      const response = await this.client.delete(`/admin/products/${productId}`);
      console.log('产品删除成功');
      return response.data;
    } catch (error) {
      console.error('删除产品失败:', error.response?.data || error.message);
      throw error;
    }
  }

  // 上传产品图片
  async uploadProductImages(productId, imageFiles) {
    try {
      const formData = new FormData();
      
      imageFiles.forEach((file, index) => {
        formData.append('files', fs.createReadStream(file.path));
      });

      const response = await this.client.post(`/admin/products/${productId}/uploads`, formData, {
        headers: {
          ...formData.getHeaders()
        }
      });

      console.log('图片上传成功:', response.data.uploads);
      return response.data.uploads;
    } catch (error) {
      console.error('上传图片失败:', error.response?.data || error.message);
      throw error;
    }
  }
}

// 使用示例
const productManager = new ProductManager('http://localhost:9000', 'your_api_key');

// 创建示例产品
const exampleProduct = {
  title: "基础 T 恤",
  handle: "basic-tshirt",
  subtitle: "舒适日常穿着",
  description: "高质量纯棉 T 恤，适合日常穿着",
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

module.exports = ProductManager;
```

## 3. 价格管理脚本

### 文件: `scripts/price-management.js`

```javascript
/**
 * 价格管理 API 脚本
 * 功能：设置产品价格、管理价格列表、促销价格
 */

const axios = require('axios');

class PriceManager {
  constructor(baseURL, apiKey) {
    this.client = axios.create({
      baseURL: baseURL,
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });
  }

  // 设置产品价格
  async setProductPrice(productId, variantId, priceData) {
    try {
      const response = await this.client.post(`/admin/products/${productId}/variants/${variantId}`, {
        prices: priceData
      });
      console.log('价格设置成功:', response.data.product_variant);
      return response.data.product_variant;
    } catch (error) {
      console.error('设置价格失败:', error.response?.data || error.message);
      throw error;
    }
  }

  // 批量设置价格
  async setBatchPrices(priceUpdates) {
    const results = [];
    for (const update of priceUpdates) {
      try {
        const result = await this.setProductPrice(update.productId, update.variantId, update.prices);
        results.push({ success: true, ...update, result });
      } catch (error) {
        results.push({ success: false, ...update, error: error.message });
      }
    }
    return results;
  }

  // 创建价格列表
  async createPriceList(priceListData) {
    try {
      const response = await this.client.post('/admin/price-lists', priceListData);
      console.log('价格列表创建成功:', response.data.price_list);
      return response.data.price_list;
    } catch (error) {
      console.error('创建价格列表失败:', error.response?.data || error.message);
      throw error;
    }
  }

  // 获取价格列表
  async getPriceLists(limit = 50, offset = 0) {
    try {
      const response = await this.client.get(`/admin/price-lists?limit=${limit}&offset=${offset}`);
      return response.data.price_lists;
    } catch (error) {
      console.error('获取价格列表失败:', error.response?.data || error.message);
      throw error;
    }
  }

  // 设置促销价格
  async setPromotionPrice(promotionData) {
    try {
      const response = await this.client.post('/admin/promotions', promotionData);
      console.log('促销价格设置成功:', response.data.promotion);
      return response.data.promotion;
    } catch (error) {
      console.error('设置促销价格失败:', error.response?.data || error.message);
      throw error;
    }
  }
}

// 使用示例
const priceManager = new PriceManager('http://localhost:9000', 'your_api_key');

// 示例价格数据
const examplePrices = [
  {
    currency_code: "cny",
    amount: 99.00
  },
  {
    currency_code: "usd",
    amount: 15.00
  }
];

module.exports = PriceManager;
```

## 4. 产品变体管理脚本

### 文件: `scripts/variant-management.js`

```javascript
/**
 * 产品变体管理 API 脚本
 * 功能：创建、管理产品变体和选项
 */

const axios = require('axios');

class VariantManager {
  constructor(baseURL, apiKey) {
    this.client = axios.create({
      baseURL: baseURL,
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });
  }

  // 创建产品变体
  async createVariant(productId, variantData) {
    try {
      const response = await this.client.post(`/admin/products/${productId}/variants`, variantData);
      console.log('变体创建成功:', response.data.product_variant);
      return response.data.product_variant;
    } catch (error) {
      console.error('创建变体失败:', error.response?.data || error.message);
      throw error;
    }
  }

  // 更新变体
  async updateVariant(productId, variantId, updateData) {
    try {
      const response = await this.client.post(`/admin/products/${productId}/variants/${variantId}`, updateData);
      console.log('变体更新成功:', response.data.product_variant);
      return response.data.product_variant;
    } catch (error) {
      console.error('更新变体失败:', error.response?.data || error.message);
      throw error;
    }
  }

  // 删除变体
  async deleteVariant(productId, variantId) {
    try {
      const response = await this.client.delete(`/admin/products/${productId}/variants/${variantId}`);
      console.log('变体删除成功');
      return response.data;
    } catch (error) {
      console.error('删除变体失败:', error.response?.data || error.message);
      throw error;
    }
  }

  // 更新库存
  async updateInventory(variantId, quantity, locationId = null) {
    try {
      const inventoryData = {
        inventory_item_id: variantId,
        quantity: quantity
      };
      
      if (locationId) {
        inventoryData.location_id = locationId;
      }

      const response = await this.client.post(`/admin/inventory-items/${variantId}/location-levels`, inventoryData);
      console.log('库存更新成功:', response.data.inventory_level);
      return response.data.inventory_level;
    } catch (error) {
      console.error('更新库存失败:', error.response?.data || error.message);
      throw error;
    }
  }

  // 批量创建变体
  async createBatchVariants(productId, variantsData) {
    const results = [];
    for (const variantData of variantsData) {
      try {
        const result = await this.createVariant(productId, variantData);
        results.push({ success: true, ...variantData, result });
      } catch (error) {
        results.push({ success: false, ...variantData, error: error.message });
      }
    }
    return results;
  }
}

// 使用示例
const variantManager = new VariantManager('http://localhost:9000', 'your_api_key');

// 示例变体数据
const exampleVariant = {
  title: "M / 白色",
  sku: "TSHIRT-M-WHT",
  manage_inventory: true,
  allow_backorder: false,
  inventory_quantity: 150,
  prices: [
    {
      currency_code: "cny",
      amount: 99.00
    }
  ],
  options: [
    { value: "M" },
    { value: "白色" }
  ]
};

module.exports = VariantManager;
```

## 5. 媒体上传脚本

### 文件: `scripts/media-upload.js`

```javascript
/**
 * 媒体上传 API 脚本
 * 功能：上传图片到 Cloudinary，管理产品媒体
 */

const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

class MediaUploader {
  constructor(baseURL, apiKey) {
    this.client = axios.create({
      baseURL: baseURL,
      headers: {
        'Authorization': `Bearer ${apiKey}`
      }
    });
  }

  // 上传单个文件
  async uploadFile(filePath, purpose = 'main') {
    try {
      const formData = new FormData();
      formData.append('files', fs.createReadStream(filePath));
      
      const response = await this.client.post('/admin/uploads', formData, {
        headers: {
          ...formData.getHeaders()
        }
      });

      console.log('文件上传成功:', response.data.uploads);
      return response.data.uploads;
    } catch (error) {
      console.error('文件上传失败:', error.response?.data || error.message);
      throw error;
    }
  }

  // 批量上传文件
  async uploadMultipleFiles(filePaths, purpose = 'main') {
    const results = [];
    
    for (const filePath of filePaths) {
      try {
        const result = await this.uploadFile(filePath, purpose);
        results.push({ success: true, filePath, result });
      } catch (error) {
        results.push({ success: false, filePath, error: error.message });
      }
    }
    
    return results;
  }

  // 上传产品图片
  async uploadProductImages(productId, imagePaths) {
    try {
      const uploadResults = await this.uploadMultipleFiles(imagePaths, 'product');
      
      // 将上传的图片关联到产品
      const imageUpdates = uploadResults
        .filter(result => result.success)
        .map(result => ({
          url: result.result[0].url,
          metadata: result.result[0].metadata
        }));

      if (imageUpdates.length > 0) {
        const response = await this.client.post(`/admin/products/${productId}/images`, {
          images: imageUpdates
        });
        
        console.log('产品图片关联成功:', response.data.product);
        return response.data.product;
      }
      
      return uploadResults;
    } catch (error) {
      console.error('上传产品图片失败:', error.response?.data || error.message);
      throw error;
    }
  }

  // 删除媒体文件
  async deleteMediaFile(fileId) {
    try {
      const response = await this.client.delete(`/admin/uploads/${fileId}`);
      console.log('媒体文件删除成功');
      return response.data;
    } catch (error) {
      console.error('删除媒体文件失败:', error.response?.data || error.message);
      throw error;
    }
  }

  // 获取上传的文件列表
  async getUploadedFiles(limit = 50, offset = 0) {
    try {
      const response = await this.client.get(`/admin/uploads?limit=${limit}&offset=${offset}`);
      return response.data.uploads;
    } catch (error) {
      console.error('获取文件列表失败:', error.response?.data || error.message);
      throw error;
    }
  }
}

// 使用示例
const mediaUploader = new MediaUploader('http://localhost:9000', 'your_api_key');

// 示例使用
const exampleImagePaths = [
  './images/product1-front.jpg',
  './images/product1-back.jpg',
  './images/product1-detail.jpg'
];

module.exports = MediaUploader;
```

## 6. 完整工作流示例

### 文件: `scripts/complete-workflow.js`

```javascript
/**
 * 完整产品管理工作流示例
 */

const CategoryManager = require('./category-management');
const ProductManager = require('./product-management');
const PriceManager = require('./price-management');
const VariantManager = require('./variant-management');
const MediaUploader = require('./media-upload');

class ProductWorkflow {
  constructor(baseURL, apiKey) {
    this.categoryManager = new CategoryManager(baseURL, apiKey);
    this.productManager = new ProductManager(baseURL, apiKey);
    this.priceManager = new PriceManager(baseURL, apiKey);
    this.variantManager = new VariantManager(baseURL, apiKey);
    this.mediaUploader = new MediaUploader(baseURL, apiKey);
  }

  // 完整产品创建流程
  async createCompleteProduct(productData, categoryData, imagePaths) {
    try {
      console.log('开始创建完整产品流程...');
      
      // 1. 创建类别（如果不存在）
      let category;
      const existingCategories = await this.categoryManager.getAllCategories();
      const existingCategory = existingCategories.find(cat => cat.handle === categoryData.handle);
      
      if (!existingCategory) {
        category = await this.categoryManager.createCategory(categoryData);
        console.log('新类别创建成功:', category.name);
      } else {
        category = existingCategory;
        console.log('使用现有类别:', category.name);
      }

      // 2. 创建产品
      const productWithCategory = {
        ...productData,
        categories: [{ id: category.id }]
      };
      
      const product = await this.productManager.createProduct(productWithCategory);
      console.log('产品创建成功:', product.title);

      // 3. 上传产品图片
      if (imagePaths && imagePaths.length > 0) {
        await this.mediaUploader.uploadProductImages(product.id, imagePaths);
        console.log('产品图片上传完成');
      }

      // 4. 设置价格（如果需要特殊价格处理）
      if (productData.variants && productData.variants.length > 0) {
        for (const variant of productData.variants) {
          await this.priceManager.setProductPrice(
            product.id, 
            variant.id, 
            variant.prices
          );
        }
        console.log('产品价格设置完成');
      }

      console.log('完整产品创建流程完成！');
      return product;
      
    } catch (error) {
      console.error('产品创建流程失败:', error.message);
      throw error;
    }
  }

  // 批量产品导入
  async batchImportProducts(productsData) {
    const results = [];
    
    for (const productData of productsData) {
      try {
        const result = await this.createCompleteProduct(
          productData.product,
          productData.category,
          productData.images
        );
        results.push({ success: true, product: productData.product.title, result });
      } catch (error) {
        results.push({ success: false, product: productData.product.title, error: error.message });
      }
    }
    
    return results;
  }
}

// 使用示例
const workflow = new ProductWorkflow('http://localhost:9000', 'your_api_key');

// 示例数据
const exampleProductData = {
  product: {
    title: "经典牛仔裤",
    handle: "classic-jeans",
    subtitle: "经典版型牛仔裤",
    description: "舒适耐穿的经典牛仔裤",
    status: "published",
    options: [
      { title: "尺寸" },
      { title: "颜色" }
    ],
    variants: [
      {
        title: "32 / 蓝色",
        sku: "JEANS-32-BLU",
        manage_inventory: true,
        allow_backorder: false,
        inventory_quantity: 80,
        prices: [
          {
            currency_code: "cny",
            amount: 299.00
          }
        ],
        options: [
          { value: "32" },
          { value: "蓝色" }
        ]
      }
    ]
  },
  category: {
    name: "裤装",
    handle: "pants",
    is_active: true,
    is_internal: false,
    description: "各种裤装产品"
  },
  images: [
    './images/jeans-front.jpg',
    './images/jeans-back.jpg'
  ]
};

module.exports = ProductWorkflow;
```

## 7. 配置和运行

### 环境配置文件
创建 `.env` 文件：
```env
MEDUSA_BACKEND_URL=http://localhost:9000
MEDUSA_API_KEY=your_secret_api_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_FOLDER=veebipop-products
```

### 安装依赖
```bash
cd veebipop-backend-v2
npm install axios form-data
```

### 运行脚本
```bash
# 创建类别
node scripts/category-management.js

# 创建产品
node scripts/product-management.js

# 完整工作流
node scripts/complete-workflow.js
```

## 8. 错误处理和最佳实践

### 错误处理
- 所有 API 调用都包含 try-catch 错误处理
- 详细的错误日志记录
- 批量操作中的部分失败处理

### 最佳实践
- 使用环境变量管理敏感信息
- 实现重试机制处理网络问题
- 批量操作以提高效率
- 详细的日志记录便于调试

这个完整的 API 脚本指南提供了产品管理的所有必要功能，可以根据具体需求进行定制和扩展。