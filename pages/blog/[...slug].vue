<script setup lang="ts">
const route = useRoute();

const { data: page } = await useAsyncData("page-" + route.path, () => {
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

if (!page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: "Page not found",
    fatal: true,
  });
}
</script>

<template>
  <div>
    <div class="prose prose-slate max-w-none p-4">
      <ContentRenderer v-if="page" :value="page" />
    </div>
  </div>
</template>
