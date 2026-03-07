// server/utils/db.ts
import Database from 'better-sqlite3'
import { join } from 'pathe'
import { existsSync, mkdirSync } from 'fs'

let db: Database.Database | null = null

export const getDB = () => {
  if (!db) {
    const dbDir = join(process.cwd(), '.data')
    if (!existsSync(dbDir)) {
      mkdirSync(dbDir, { recursive: true })
    }

    const dbPath = join(dbDir, 'blog.db')
    db = new Database(dbPath)

    // 开启外键支持 (可选)
    db.pragma('journal_mode = WAL')

    // 表 1: 详细访问记录 (用于去重)
    // 主键是 path + user_id，确保同一用户对同一文章只有一条最新记录
    db.exec(`
      CREATE TABLE IF NOT EXISTS page_views (
        path TEXT NOT NULL,
        user_id TEXT NOT NULL,
        visited_at INTEGER NOT NULL,
        PRIMARY KEY (path, user_id)
      )
    `)

    // 表 2: 访问总数汇总 (用于快速读取计数)
    db.exec(`
      CREATE TABLE IF NOT EXISTS view_summary (
        path TEXT PRIMARY KEY,
        total_count INTEGER DEFAULT 0
      )
    `)

    console.log('[DB] Tables initialized successfully.')
  }
  return db
}