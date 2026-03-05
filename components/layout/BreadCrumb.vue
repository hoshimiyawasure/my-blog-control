<script setup lang="ts">
const breadcrumbs = [
  {
    meta: {
      title: "首页",
    },
  },
  {
    meta: {
      title: "分类",
    },
  },
  {
    meta: {
      title: "文章列表",
    },
  },
];
</script>
<template>
  <div class="flex flex-row items-center gap-[10px] px-[15px] py-[10px]">
    <div v-for="(item, index) in breadcrumbs">
      <!-- <span v-if="item.meta.title" class="breacrumb-groupName">
        {{ item.meta.title }} /
      </span> -->
      <nuxt-link to="/" class="text-gray-600 hover:text-blue-500">
        {{ item.meta.title }}
        <span v-if="index < breadcrumbs.length - 1"> / </span>
      </nuxt-link>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.breacrumb-groupName {
  color: #606266;
}
</style>
