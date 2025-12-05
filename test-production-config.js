// 测试生产环境配置
const { Client } = require('pg');
require('dotenv').config();

async function testProductionConfig() {
  console.log('🧪 测试生产环境配置...\n');
  
  // 模拟生产环境变量
  const originalNodeEnv = process.env.NODE_ENV;
  process.env.NODE_ENV = 'production';
  
  try {
    // 测试数据库 URL 配置
    console.log('1. 测试数据库 URL 配置...');
    const databaseUrl = process.env.DATABASE_URL;
    
    if (!databaseUrl) {
      throw new Error('DATABASE_URL 环境变量未设置');
    }
    
    console.log('✓ DATABASE_URL 已设置');
    
    // 测试 SSL 配置是否正确添加到 URL
    let testDbUrl = databaseUrl;
    if (process.env.NODE_ENV === 'production') {
      testDbUrl = databaseUrl.includes('?') 
        ? `${databaseUrl}&sslmode=require&sslrejectunauthorized=false`
        : `${databaseUrl}?sslmode=require&sslrejectunauthorized=false`;
    }
    
    console.log('✓ 生产环境 SSL 配置已添加');
    console.log(`  原始 URL: ${databaseUrl.substring(0, 50)}...`);
    console.log(`  修改后 URL: ${testDbUrl.substring(0, 80)}...`);
    
    // 测试 Redis URL 配置
    console.log('\n2. 测试 Redis URL 配置...');
    const redisUrl = process.env.REDIS_URL;
    
    if (!redisUrl) {
      console.log('⚠️ REDIS_URL 环境变量未设置，将使用假 Redis 实例');
    } else {
      console.log('✓ REDIS_URL 已设置');
      console.log(`  Redis URL: ${redisUrl.substring(0, 50)}...`);
    }
    
    // 测试数据库连接（使用生产配置）
    console.log('\n3. 测试生产环境数据库连接...');
    
    const urlMatch = databaseUrl.match(/postgresql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/);
    if (!urlMatch) {
      throw new Error('无法解析数据库 URL');
    }
    
    const [, username, password, host, port, database] = urlMatch;
    const clientConfig = {
      host: host,
      port: parseInt(port),
      user: username,
      password: password,
      database: database,
      ssl: {
        rejectUnauthorized: false
      }
    };
    
    const client = new Client(clientConfig);
    
    try {
      await client.connect();
      console.log('✓ 生产环境数据库连接成功');
      
      const result = await client.query('SELECT NOW() as current_time');
      console.log(`✓ 数据库查询成功，当前时间: ${result.rows[0].current_time}`);
      
      await client.end();
    } catch (error) {
      console.error('❌ 数据库连接失败:', error.message);
      throw error;
    }
    
    // 测试 CORS 配置
    console.log('\n4. 测试 CORS 配置...');
    const storeCors = process.env.STORE_CORS;
    const adminCors = process.env.ADMIN_CORS;
    const authCors = process.env.AUTH_CORS;
    
    if (!storeCors || !adminCors || !authCors) {
      console.log('⚠️ CORS 配置不完整');
    } else {
      console.log('✓ CORS 配置已设置');
    }
    
    // 测试 JWT 和 Cookie 密钥
    console.log('\n5. 测试安全配置...');
    const jwtSecret = process.env.JWT_SECRET;
    const cookieSecret = process.env.COOKIE_SECRET;
    
    if (!jwtSecret || jwtSecret === 'supersecret') {
      console.log('⚠️ JWT_SECRET 使用默认值，生产环境应更改');
    } else {
      console.log('✓ JWT_SECRET 已设置');
    }
    
    if (!cookieSecret || cookieSecret === 'supersecret') {
      console.log('⚠️ COOKIE_SECRET 使用默认值，生产环境应更改');
    } else {
      console.log('✓ COOKIE_SECRET 已设置');
    }
    
    console.log('\n🎉 生产环境配置测试完成！');
    
  } catch (error) {
    console.error('\n❌ 生产环境配置测试失败:');
    console.error('错误详情:', error.message);
    return false;
  } finally {
    // 恢复原始 NODE_ENV
    process.env.NODE_ENV = originalNodeEnv;
  }
  
  return true;
}

// 运行测试
testProductionConfig().then(success => {
  process.exit(success ? 0 : 1);
});