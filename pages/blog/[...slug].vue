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

// 4. 访问量逻辑 - 服务端获取初始值，客户端处理增量
const { data: initialViewCount } = await useAsyncData(
  "view-count-" + cleanPath.value,
  async () => {
    try {
      // 服务端获取初始访问量
      const { count } = await $fetch("/api/views", {
        method: "get",
        query: { path: cleanPath.value },
      });
      return count;
    } catch (err) {
      console.error("Failed to load initial view count:", err);
      return 0;
    }
  },
);

const viewCount = ref<number>(initialViewCount.value || 0);
const isViewLoading = ref(false);

// 客户端处理增量逻辑
if (import.meta.client) {
  const incrementViews = async () => {
    try {
      const hasVisited = checkLocalVisitRecord(cleanPath.value);
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
            console.error("View increment failed:", err);
          });
      }
    } catch (err) {
      console.error("Failed to increment views:", err);
    } finally {
      isViewLoading.value = false;
    }
  };

  // 辅助函数 (实际项目中请移到 utils 或 composables)
  const STORAGE_KEY_PREFIX = "blog_view_";
  const getOrCreateUserId = () => {
    let uid = localStorage.getItem("blog_uid");
    if (!uid) {
      uid = crypto.randomUUID();
      localStorage.setItem("blog_uid", uid);
    }
    return uid;
  };
  const checkLocalVisitRecord = (path: string) => {
    const key = `${STORAGE_KEY_PREFIX}${path}`;
    const last = localStorage.getItem(key);
    if (!last) return false;
    return Date.now() - parseInt(last) < 24 * 60 * 60 * 1000;
  };
  const saveLocalVisitRecord = (path: string) => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}${path}`, Date.now().toString());
  };

  // 客户端挂载后执行增量逻辑
  onMounted(() => {
    // 稍微延迟，避免阻塞 LCP (最大内容绘制)
    setTimeout(incrementViews, 500);
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
    <Giscus />
  </div>
</template>
