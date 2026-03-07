// server/api/views.get.ts
import { getDB } from '../utils/db'
import { defineEventHandler, getQuery, createError } from 'h3'

export default defineEventHandler((event) => {
  const query = getQuery(event)
  const path = query.path as string

  if (!path) {
    throw createError({ statusCode: 400, message: 'Missing path' })
  }

  const db = getDB()

  // ✅ 修改点 1: 表名从 page_views 改为 view_summary
  // ✅ 修改点 2: 字段名从 count 改为 total_count
  const stmt = db.prepare('SELECT total_count FROM view_summary WHERE path = ?')

  const row = stmt.get(path) as { total_count: number } | undefined

  return {
    path,
    // ✅ 修改点 3: 返回 row.total_count
    count: row ? row.total_count : 0
  }
})