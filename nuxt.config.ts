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
      buterinCards: '0x5726C14663A1EaD4A7D320E8A653c9710b2A2E89',
      minedJpeg: '0x7cd51FA7E155805C34F333ba493608742A67Da8e',
      rpc: process.env.NUXT_RPC
    },

  },

  compatibilityDate: "2024-09-16"
})