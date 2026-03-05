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

    // 初始化表：如果不存在则创建
    db.exec(`
      CREATE TABLE IF NOT EXISTS page_views (
        path TEXT PRIMARY KEY,
        count INTEGER DEFAULT 0,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `)
  }
  return db
}