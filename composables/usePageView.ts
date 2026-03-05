// composables/usePageView.ts
import { ref, onMounted } from 'vue'

export const usePageView = (path: string) => {
  const viewCount = ref<number>(0)
  const isLoading = ref(true)

  // 配置：去重时间窗口 (毫秒)，这里设为 24 小时
  const TIME_WINDOW_MS = 24 * 60 * 60 * 1000
  const STORAGE_KEY_PREFIX = 'blog_view_record_'

  // 获取或创建用户唯一 ID (存在 localStorage)
  const getUserId = () => {
    let uid = localStorage.getItem('blog_user_uid')
    if (!uid) {
      uid = crypto.randomUUID() // 浏览器原生 API 生成 UUID
      localStorage.setItem('blog_user_uid', uid)
    }
    return uid
  }

  // 检查本地是否已经记录过本次访问
  const hasVisitedRecently = (): boolean => {
    const key = `${STORAGE_KEY_PREFIX}${path}`
    const lastVisitStr = localStorage.getItem(key)

    if (!lastVisitStr) return false

    const lastVisitTime = parseInt(lastVisitStr, 10)
    const now = Date.now()

    // 如果在时间窗口内，视为重复访问
    return (now - lastVisitTime) < TIME_WINDOW_MS
  }

  // 标记为已访问
  const markAsVisited = () => {
    const key = `${STORAGE_KEY_PREFIX}${path}`
    localStorage.setItem(key, Date.now().toString())
  }

  // 获取当前计数
  const fetchCount = async () => {
    try {
      const data = await $fetch('/api/views', {
        method: 'get',
        query: { path }
      })
      viewCount.value = data.count
    } catch (e) {
      console.error('Failed to fetch views', e)
    } finally {
      isLoading.value = false
    }
  }

  // 增加计数 (仅当未在最近访问过时调用)
  const incrementCount = async () => {
    if (hasVisitedRecently()) {
      // 如果是重复访问，只获取最新数字，不触发增加
      await fetchCount()
      return
    }

    try {
      const userId = getUserId()
      const data = await $fetch('/api/views', {
        method: 'post',
        body: {
          path,
          userId // 将用户 ID 传给后端做二次校验
        }
      })
      viewCount.value = data.count
      markAsVisited() // 本地记录成功
    } catch (e) {
      console.error('Failed to increment views', e)
      // 即使失败，也尝试获取一下当前计数以免显示为空
      await fetchCount()
    }
  }

  onMounted(() => {
    // 先展示现有计数
    fetchCount()

    // 延迟一点执行增加逻辑，确保是真实用户行为，且避免阻塞首屏渲染
    setTimeout(() => {
      incrementCount()
    }, 1500)
  })

  return { viewCount, isLoading }
}