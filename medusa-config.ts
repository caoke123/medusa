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
    }
  },
  // Redis模块配置暂时注释，因为@medusajs/redis包在当前版本中不可用
  // modules: [
  //   {
  //     resolve: "@medusajs/redis",
  //     options: {
  //       redisUrl: process.env.UPSTASH_REDIS_REST_URL || process.env.REDIS_URL,
  //       redisOptions: {
  //         password: process.env.UPSTASH_REDIS_REST_TOKEN,
  //         tls: process.env.UPSTASH_REDIS_REST_URL?.startsWith("rediss://") ? {} : undefined,
  //       },
  //     },
  //   },
  // ],
})
