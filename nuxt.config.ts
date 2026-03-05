// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/content', '@nuxtjs/tailwindcss', '@nuxt/icon'],
  content: {
    markdown: {
      highlight: {
        theme: 'github-dark', // 代码高亮主题
        preload: ['json', 'js', 'ts', 'html', 'css', 'vue']
      }
    }
  },
  ssr: true,
  nitro: {
    prerender: {
      routes: ['/']
    }
  },
  components:[
    {
      path:'~/components/layout',
      pathPrefix:false,
    },
    {
      path:"~/components/common/",
      pathPrefix:false,
    }
  ]
})