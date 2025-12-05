// 测试 Medusa 配置文件
require('dotenv').config();

async function testMedusaConfig() {
  console.log('🧪 测试 Medusa 配置文件...\n');
  
  try {
    // 模拟生产环境
    const originalNodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';
    
    // 动态导入配置
    const config = require('./medusa-config.ts');
    
    console.log('1. 测试配置文件加载...');
    console.log('✓ 配置文件加载成功');
    
    console.log('\n2. 测试项目配置...');
    const projectConfig = config.projectConfig;
    
    if (!projectConfig) {
      throw new Error('projectConfig 未定义');
    }
    
    console.log('✓ projectConfig 已定义');
    
    // 测试数据库 URL
    if (!projectConfig.databaseUrl) {
      throw new Error('databaseUrl 未设置');
    }
    
    console.log('✓ databaseUrl 已设置');
    
    // 检查生产环境 SSL 配置
    if (process.env.NODE_ENV === 'production') {
      const expectedSslUrl = process.env.DATABASE_URL.includes('?') 
        ? `${process.env.DATABASE_URL}&sslmode=require&sslrejectunauthorized=false`
        : `${process.env.DATABASE_URL}?sslmode=require&sslrejectunauthorized=false`;
        
      if (projectConfig.databaseUrl !== expectedSslUrl) {
        console.log('⚠️ 生产环境 SSL 配置可能未正确应用');
        console.log(`  期望: ${expectedSslUrl.substring(0, 80)}...`);
        console.log(`  实际: ${projectConfig.databaseUrl.substring(0, 80)}...`);
      } else {
        console.log('✓ 生产环境 SSL 配置已正确应用');
      }
    }
    
    // 测试 HTTP 配置
    if (!projectConfig.http) {
      throw new Error('http 配置未设置');
    }
    
    console.log('✓ HTTP 配置已设置');
    
    const httpConfig = projectConfig.http;
    const requiredCorsFields = ['storeCors', 'adminCors', 'authCors'];
    
    for (const field of requiredCorsFields) {
      if (!httpConfig[field]) {
        throw new Error(`${field} 未设置`);
      }
    }
    
    console.log('✓ CORS 配置已设置');
    
    // 测试模块配置
    console.log('\n3. 测试模块配置...');
    const modules = config.modules;
    
    if (!modules || !Array.isArray(modules)) {
      console.log('⚠️ 模块配置为空或未定义（Redis 模块可能被注释）');
    } else {
      console.log(`✓ 找到 ${modules.length} 个模块配置`);
      
      // 检查 Redis 模块
      const redisModule = modules.find(m => m.resolve === "@medusajs/redis");
      if (redisModule) {
        console.log('✓ Redis 模块已配置');
        if (redisModule.options && redisModule.options.redisUrl) {
          console.log('✓ Redis URL 已设置');
        } else {
          console.log('⚠️ Redis URL 未设置');
        }
      } else {
        console.log('⚠️ Redis 模块未配置（可能被注释）');
      }
    }
    
    // 恢复原始 NODE_ENV
    process.env.NODE_ENV = originalNodeEnv;
    
    console.log('\n🎉 Medusa 配置文件测试完成！');
    
  } catch (error) {
    console.error('\n❌ Medusa 配置文件测试失败:');
    console.error('错误详情:', error.message);
    console.error('错误堆栈:', error.stack);
    return false;
  }
  
  return true;
}

// 运行测试
testMedusaConfig().then(success => {
  process.exit(success ? 0 : 1);
});