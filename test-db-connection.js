// 测试数据库连接
const { Client } = require('pg');

// 从环境变量获取数据库 URL
const databaseUrl = process.env.DATABASE_URL || "postgresql://postgres.cyzhakgzydnfijyfizlt:jayxp5219@aws-1-ap-south-1.pooler.supabase.com:6543/postgres";

// 解析数据库 URL 获取连接参数
const urlMatch = databaseUrl.match(/postgresql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/);
let clientConfig;

if (urlMatch) {
  const [, username, password, host, port, database] = urlMatch;
  clientConfig = {
    host: host,
    port: parseInt(port),
    user: username,
    password: password,
    database: database,
    // 在生产环境中添加 SSL 配置
    ssl: process.env.NODE_ENV === 'production' ? {
      rejectUnauthorized: false
    } : false
  };
} else {
  console.error('无法解析数据库 URL');
  process.exit(1);
}

const client = new Client(clientConfig);

async function testDatabaseConnection() {
  try {
    console.log('正在测试数据库连接...');
    
    // 连接到数据库
    await client.connect();
    console.log('✓ 成功连接到数据库');
    
    // 测试查询
    const result = await client.query('SELECT NOW() as current_time, version() as version');
    console.log('✓ 数据库查询成功');
    console.log('  当前时间:', result.rows[0].current_time);
    console.log('  数据库版本:', result.rows[0].version.split(' ')[0]);
    
    // 测试表是否存在
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      LIMIT 5
    `);
    
    if (tablesResult.rows.length > 0) {
      console.log('✓ 找到以下表:');
      tablesResult.rows.forEach(row => {
        console.log('  -', row.table_name);
      });
    } else {
      console.log('! 数据库中还没有表，这可能是因为尚未运行迁移');
    }
    
    console.log('\n🎉 数据库连接测试成功！');
    
  } catch (error) {
    console.error('\n❌ 数据库连接测试失败:');
    console.error('错误详情:', error.message);
    
    if (error.message.includes('ECONNREFUSED')) {
      console.error('建议: 检查数据库 URL 是否正确');
    } else if (error.message.includes('password authentication failed')) {
      console.error('建议: 检查数据库密码是否正确');
    } else if (error.message.includes('SSL')) {
      console.error('建议: 检查 SSL 配置是否正确');
    } else if (error.message.includes('timeout')) {
      console.error('建议: 检查网络连接或防火墙设置');
    }
    
    return false;
  } finally {
    await client.end();
  }
  
  return true;
}

// 加载环境变量
require('dotenv').config();

// 运行测试
testDatabaseConnection().then(success => {
  process.exit(success ? 0 : 1);
});