// server/api/views.get.ts
import { getDB } from '../utils/db'
import { z } from 'zod' // 建议安装 zod 做验证，或者手动验证

export default defineEventHandler((event) => {
  const query = getQuery(event)
  const path = query.path as string

  if (!path) {
    throw createError({ statusCode: 400, message: 'Missing path' })
  }

  const db = getDB()
  const stmt = db.prepare('SELECT count FROM page_views WHERE path = ?')
  const row = stmt.get(path) as { count: number } | undefined

  return {
    path,
    count: row ? row.count : 0
  }
})