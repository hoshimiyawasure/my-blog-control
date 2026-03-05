// server/api/views.post.ts
import { getDB } from '../utils/db'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const path = body.path

  if (!path) {
    throw createError({ statusCode: 400, message: 'Missing path' })
  }

  const db = getDB()

  // 事务操作：如果存在则 +1，不存在则插入 1
  // 使用 exec 或 prepare run
  const stmt = db.prepare(`
    INSERT INTO page_views (path, count, updated_at)
    VALUES (?, 1, CURRENT_TIMESTAMP)
    ON CONFLICT(path) DO UPDATE SET
      count = count + 1,
      updated_at = CURRENT_TIMESTAMP
  `)

  stmt.run(path)

  // 返回新的计数
  const selectStmt = db.prepare('SELECT count FROM page_views WHERE path = ?')
  const row = selectStmt.get(path) as { count: number }

  return {
    path,
    count: row.count
  }
})