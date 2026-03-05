<script lang="ts" setup></script>

<template>
  <div
    class="app-wrapper w-full flex flex-col items-center justify-start bg-[#e6e6e6]"
  >
    <div class="fixed-header sticky top-0 z-10 bg-white w-full">
      <NavigationBar class="w-[1200px] mx-auto"></NavigationBar>
    </div>
    <div
      class="w-[1200px] bg-white rounded-lg shadow-lg my-12 px-[15px] py-[15px]"
    >
      <!-- 主容器 -->
      <div class="main-container h-full min-h-[70vh]">
        <!-- 页面主体内容 -->
        <div class="app-main">
          <slot></slot>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.app-wrapper {
  min-height: 100vh;
  // background-image: url("@/common/assets/images/background.png");
  background-repeat: no-repeat;
  background-size: cover;
  // backdrop-filter: calc(50%);
}

.glass-effect {
  /* 1. 设置背景模糊 (关键属性) */
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px); /* 兼容 Safari */

  /* 2. 必须设置半透明背景色 */
  /* 如果背景完全不透明，你就看不到背后的模糊效果了 */
  background-color: rgba(255, 255, 255, 0.5); /* 白色，50% 透明度 */

  /* 可选：添加边框让质感更好 */
  border: 1px solid rgba(255, 255, 255, 0.3);
}
</style>
