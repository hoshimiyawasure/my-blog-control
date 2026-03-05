<script setup lang="ts"></script>
<template>
  <div class="py-[15px] flex flex-row items-center justify-between">
    <Logo class="px-[15px]"></Logo>
    <div class="flex flex-1 flex-row items-center gap-[20px]">
      <nuxt-link class="text-gray-600 hover:text-red-500" to="/"
        >最新</nuxt-link
      >
      <nuxt-link class="text-gray-600 hover:text-red-500" to="/category"
        >分类</nuxt-link
      >
      <nuxt-link class="text-gray-600 hover:text-red-500" to="/tag"
        >乱七倒八</nuxt-link
      >
      <nuxt-link class="text-gray-600 hover:text-red-500" to="/image"
        >我的图片收集</nuxt-link
      >
      <nuxt-link class="text-gray-600 hover:text-red-500" to="/about"
        >关于</nuxt-link
      >
    </div>
    <div class="flex flex-row items-center gap-[10px]">
      <Icon name="mdi:magnify" class="w-6 h-6"></Icon>
      <Icon name="line-md:bell-loop" class="w-6 h-6"></Icon>
      <Icon name="line-md:account" class="w-6 h-6"></Icon>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
