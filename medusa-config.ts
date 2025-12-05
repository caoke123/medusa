import { loadEnv, defineConfig } from '@medusajs/framework/utils'

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    // 在生产环境中修改 DATABASE_URL 以包含 SSL 配置，解决 Supabase 连接超时问题
    ...(process.env.NODE_ENV === 'production' && process.env.DATABASE_URL && {
      databaseUrl: process.env.DATABASE_URL.includes('?')
        ? `${process.env.DATABASE_URL}&sslmode=require&sslrejectunauthorized=false`
        : `${process.env.DATABASE_URL}?sslmode=require&sslrejectunauthorized=false`
    }),
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    }
  },
  // Redis模块配置暂时注释，因为@medusajs/redis包在当前版本中不可用
  // modules: [
  //   {
  //     resolve: "@medusajs/redis",
  //     options: {
  //       // 使用 REDIS_URL 环境变量，已包含完整的连接信息和认证
  //       redisUrl: process.env.REDIS_URL,
  //     },
  //   },
  // ],
})
