<script setup lang="ts">
const route = useRoute();

// 1. 标准化路径 (去掉末尾斜杠，防止路径不匹配)
const cleanPath = computed(() => {
  const path = route.path.endsWith("/") ? route.path.slice(0, -1) : route.path;
  return path;
});

const { data: post } = await useAsyncData("page-" + route.path, () => {
  // 从路由路径中移除 /blog 前缀 后获取到内容名/文章title
  let contentPath = route.path.replace(/^\/blog/, "");
  // 处理 /blog/ 路径，默认使用 index
  if (contentPath === "" || contentPath === "/") {
    contentPath = "/index";
  }
  // 确保路径以 / 开头
  if (!contentPath.startsWith("/")) {
    contentPath = "/" + contentPath;
  }
  return queryCollection("content").path(contentPath).first();
});

// 如果内容确实不存在，抛出 404，让用户看到正确的错误页
if (!post.value) {
  // 可选：打印日志调试
  console.warn(`Article not found for path: ${cleanPath.value}`);

  // 关键：使用 showErrorPage 或 throw createError 触发 Nuxt 原生 404
  throw createError({
    statusCode: 404,
    statusMessage: "文章未找到",
    fatal: true, // 标记为致命错误，停止后续渲染
  });
}

// 3. 设置 SEO (只有在文章存在时才设置)
useSeoMeta({
  title: post.value.title,
  description: post.value.description,
  ogTitle: post.value.title,
  ogDescription: post.value.description,
  // 如果有图片
  // ogImage: post.value.image
});

// 4. 访问量逻辑 (独立于内容加载，失败不影响页面显示)
const viewCount = ref<number>(0);
const isViewLoading = ref(true);

const fetchAndIncrementViews = async () => {
  try {
    // A. 先获取当前计数 (用于立即展示)
    const { count } = await $fetch("/api/views", {
      method: "get",
      query: { path: cleanPath.value },
    });
    viewCount.value = count;

    // B. 尝试增加计数 (防重复逻辑在 composable 或这里内部处理)
    // 为了代码清晰，建议把之前的 usePageView 逻辑搬过来，这里简化演示
    const hasVisited = checkLocalVisitRecord(cleanPath.value); // 假设你有这个辅助函数

    if (!hasVisited) {
      const userId = getOrCreateUserId();
      await $fetch("/api/views", {
        method: "post",
        body: { path: cleanPath.value, userId },
      })
        .then(({ count: newCount }) => {
          viewCount.value = newCount;
          saveLocalVisitRecord(cleanPath.value);
        })
        .catch((err) => {
          // 统计失败静默处理，不要 throw
          console.error("View increment failed:", err);
        });
    }
  } catch (err) {
    // 获取计数失败也静默处理
    console.error("Failed to load view count:", err);
    viewCount.value = 0; // 或者显示 '-'
  } finally {
    isViewLoading.value = false;
  }
};

// 辅助函数 (实际项目中请移到 utils 或 composables)
const STORAGE_KEY_PREFIX = "blog_view_";
const getOrCreateUserId = () => {
  if (import.meta.client) {
    let uid = localStorage.getItem("blog_uid");
    if (!uid) {
      uid = crypto.randomUUID();
      localStorage.setItem("blog_uid", uid);
    }
    return uid;
  }
  return "server-side";
};
const checkLocalVisitRecord = (path: string) => {
  if (!import.meta.client) return false;
  const key = `${STORAGE_KEY_PREFIX}${path}`;
  const last = localStorage.getItem(key);
  if (!last) return false;
  return Date.now() - parseInt(last) < 24 * 60 * 60 * 1000;
};
const saveLocalVisitRecord = (path: string) => {
  if (import.meta.client) {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}${path}`, Date.now().toString());
  }
};

// 仅在客户端执行统计逻辑
if (import.meta.client) {
  onMounted(() => {
    // 稍微延迟，避免阻塞 LCP (最大内容绘制)
    setTimeout(fetchAndIncrementViews, 500);
  });
}
</script>

<template>
  <div>
    <h1>
      {{ viewCount }}
    </h1>
    <div class="prose prose-slate max-w-none p-4">
      <ContentRenderer v-if="post" :value="post" />
    </div>
  </div>
</template>
