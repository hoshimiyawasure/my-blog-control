// server/utils/db.ts
import Database from 'better-sqlite3'
import { join } from 'pathe' // Nuxt 内置的路径处理工具
import { useRuntimeConfig } from '#imports'

let db: Database.Database | null = null

export const getDB = () => {
  if (!db) {
    // 数据库文件存放在 .nuxt 目录或根目录，建议放在根目录的 .data 文件夹以便持久化
    const dbPath = process.env.NUXT_DB_PATH || join(process.cwd(), '.data', 'blog.db')

    // 确保目录存在 (实际生产中可能需要 fs.mkdirSync)
    // 简单起见，假设 .data 目录已存在或使用相对路径

    db = new Database(dbPath)

    // 修改建表语句
    db.exec(`
      CREATE TABLE IF NOT EXISTS page_views (
        path TEXT,
        user_id TEXT,
        visited_at INTEGER, -- 存储时间戳
        PRIMARY KEY (path, user_id) -- 联合主键：同一用户对同一文章只有一条记录
      )
    `)

    // 另外需要一个表或字段存总计数，或者实时计算
    // 为了性能，建议单独存一个总计数表，或者每次 SELECT COUNT(*)
    // 这里为了简单，我们假设有一个 total_counts 表，或者每次查询时 COUNT(page_views WHERE path=?)
    // 更好的方式：维护一个 summary 表
    db.exec(`
      CREATE TABLE IF NOT EXISTS view_summary (
        path TEXT PRIMARY KEY,
        total_count INTEGER DEFAULT 0
      )
    `)
  }
  return db
}