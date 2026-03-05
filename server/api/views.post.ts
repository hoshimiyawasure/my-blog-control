// server/api/views.post.ts
import { getDB } from '../utils/db'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { path, userId } = body

  if (!path || !userId) {
    throw createError({ statusCode: 400, message: 'Missing path or userId' })
  }

  const db = getDB()
  const now = Date.now()
  const TIME_WINDOW_MS = 24 * 60 * 60 * 1000

  // 1. 检查该用户最近是否访问过
  const checkStmt = db.prepare('SELECT visited_at FROM page_views WHERE path = ? AND user_id = ?')
  const record = checkStmt.get(path, userId) as { visited_at: number } | undefined

  if (record) {
    // 如果已有记录，检查时间窗口
    if ((now - record.visited_at) < TIME_WINDOW_MS) {
      // 在时间窗口内，不增加计数，直接返回当前总数
      const countStmt = db.prepare('SELECT total_count FROM view_summary WHERE path = ?')
      const summary = countStmt.get(path) as { total_count: number } | undefined
      return { path, count: summary ? summary.total_count : 0 }
    } else {
      // 超过时间窗口，更新访问时间 (不增加总数，因为之前加过了?
      // 逻辑修正：通常逻辑是“每24小时算一次新访问”。
      // 如果超过24小时，应该算作新的访问，需要 +1 并更新时间。

      // 更新访问时间
      const updateStmt = db.prepare('UPDATE page_views SET visited_at = ? WHERE path = ? AND user_id = ?')
      updateStmt.run(now, path, userId)

      // 增加总数
      db.exec(`
        INSERT INTO view_summary (path, total_count)
        VALUES ('${path}', 1)
        ON CONFLICT(path) DO UPDATE SET total_count = total_count + 1
      `)
    }
  } else {
    // 2. 新用户首次访问
    // 插入访问记录
    const insertStmt = db.prepare('INSERT INTO page_views (path, user_id, visited_at) VALUES (?, ?, ?)')
    insertStmt.run(path, userId, now)

    // 增加总数
    db.exec(`
      INSERT INTO view_summary (path, total_count)
      VALUES ('${path}', 1)
      ON CONFLICT(path) DO UPDATE SET total_count = total_count + 1
    `)
  }

  // 返回最新的总数
  const finalStmt = db.prepare('SELECT total_count FROM view_summary WHERE path = ?')
  const summary = finalStmt.get(path) as { total_count: number } | undefined

  return {
    path,
    count: summary ? summary.total_count : 1
  }
})