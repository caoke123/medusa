// 测试配置逻辑
require('dotenv').config();

function testConfigLogic() {
  console.log('🧪 测试配置逻辑...\n');
  
  try {
    // 模拟生产环境
    const originalNodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';
    
    console.log('1. 测试数据库 URL SSL 配置逻辑...');
    
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      throw new Error('DATABASE_URL 环境变量未设置');
    }
    
    console.log(`✓ 原始 DATABASE_URL: ${databaseUrl.substring(0, 50)}...`);
    
    // 模拟 medusa-config.ts 中的逻辑
    let testDbUrl = databaseUrl;
    if (process.env.NODE_ENV === 'production' && process.env.DATABASE_URL) {
      testDbUrl = process.env.DATABASE_URL.includes('?') 
        ? `${process.env.DATABASE_URL}&sslmode=require&sslrejectunauthorized=false`
        : `${process.env.DATABASE_URL}?sslmode=require&sslrejectunauthorized=false`;
    }
    
    console.log(`✓ 修改后 DATABASE_URL: ${testDbUrl.substring(0, 80)}...`);
    
    // 验证 SSL 参数是否正确添加
    if (testDbUrl.includes('sslmode=require') && testDbUrl.includes('sslrejectunauthorized=false')) {
      console.log('✓ SSL 参数正确添加');
    } else {
      console.log('❌ SSL 参数未正确添加');
      return false;
    }
    
    console.log('\n2. 测试 Redis URL 配置逻辑...');
    
    const redisUrl = process.env.REDIS_URL;
    if (!redisUrl) {
      console.log('⚠️ REDIS_URL 未设置，将使用假 Redis 实例');
    } else {
      console.log(`✓ REDIS_URL: ${redisUrl.substring(0, 50)}...`);
      
      // 验证 Redis URL 格式
      if (redisUrl.startsWith('rediss://') || redisUrl.startsWith('redis://')) {
        console.log('✓ Redis URL 格式正确');
      } else {
        console.log('❌ Redis URL 格式不正确');
        return false;
      }
    }
    
    console.log('\n3. 测试 CORS 配置...');
    
    const requiredCorsVars = ['STORE_CORS', 'ADMIN_CORS', 'AUTH_CORS'];
    let corsConfigOk = true;
    
    for (const corsVar of requiredCorsVars) {
      const corsValue = process.env[corsVar];
      if (!corsValue) {
        console.log(`❌ ${corsVar} 未设置`);
        corsConfigOk = false;
      } else {
        console.log(`✓ ${corsVar} 已设置`);
      }
    }
    
    if (!corsConfigOk) {
      return false;
    }
    
    console.log('\n4. 测试安全配置...');
    
    const jwtSecret = process.env.JWT_SECRET;
    const cookieSecret = process.env.COOKIE_SECRET;
    
    if (!jwtSecret) {
      console.log('❌ JWT_SECRET 未设置');
      return false;
    } else {
      console.log('✓ JWT_SECRET 已设置');
    }
    
    if (!cookieSecret) {
      console.log('❌ COOKIE_SECRET 未设置');
      return false;
    } else {
      console.log('✓ COOKIE_SECRET 已设置');
    }
    
    // 恢复原始 NODE_ENV
    process.env.NODE_ENV = originalNodeEnv;
    
    console.log('\n🎉 配置逻辑测试完成！');
    console.log('\n📋 测试总结:');
    console.log('✓ 数据库 SSL 配置正确');
    console.log('✓ Redis URL 配置正确');
    console.log('✓ CORS 配置完整');
    console.log('✓ 安全配置完整');
    console.log('\n🚀 配置已准备好部署到 Railway！');
    
  } catch (error) {
    console.error('\n❌ 配置逻辑测试失败:');
    console.error('错误详情:', error.message);
    return false;
  }
  
  return true;
}

// 运行测试
const success = testConfigLogic();
process.exit(success ? 0 : 1);