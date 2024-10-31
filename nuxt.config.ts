// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@nuxt/ui", "@nuxt/image", "@pinia/nuxt"],

  colorMode: {
    preference: 'dark',
  },

  tailwindcss: {
    cssPath: '~/assets/global.css',
  },

  runtimeConfig: {

    public: {
      testnetContract: process.env.NUXT_TESTNET_CONTRACT,
      contract: process.env.NUXT_MAINNET_CONTRACT,
      env: process.env.NUXT_ENV,
      buterinCards: '0x8Cde5620D62E03826b114b307A58EB0B637a888a',
      minedJpeg: '0x5e7a7E1200d378f07Dd3006F99111bb07c12580f',
      rpc: process.env.NUXT_RPC
    },

  },

  compatibilityDate: "2024-09-16"
})