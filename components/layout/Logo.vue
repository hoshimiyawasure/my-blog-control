<template>
  <div class="logo-container">
    <transition name="layout-logo-fade">
      <nuxt-link to="/">
        <img
          src="@/common/assets/images/logo.png"
          class="w-[40px] h-[40px]"
          alt=""
        />
      </nuxt-link>
    </transition>
  </div>
</template>

<style lang="scss" scoped></style>
