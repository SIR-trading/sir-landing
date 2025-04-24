// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@nuxt/ui", "@nuxt/image", "@pinia/nuxt"],
  plugins: ['~/plugins/mitt'],
  colorMode: {
    preference: 'dark',
  },

  tailwindcss: {
    cssPath: '~/assets/global.css',
  },

  runtimeConfig: {
    kvRestApiUrl: process.env.NUXT_KV_REST_API_URL,
    kvRestApiToken: process.env.NUXT_KV_REST_API_TOKEN,
    rpc: process.env.NUXT_RPC,
    public: {
      testnetSaleContract: process.env.NUXT_TESTNET_SALE_CONTRACT,
      testnetPresaleContract: process.env.NUXT_TESTNET_PRESALE_CONTRACT,
      preSaleContract: process.env.NUXT_MAINNET_PRESALE_CONTRACT,
      saleContract: process.env.NUXT_MAINNET_SALE_CONTRACT,
      env: process.env.NUXT_ENV,
      buterinCards: process.env.NUXT_BUTERIN_CARDS,
      minedJpeg: process.env.NUXT_MINED_JPEG,
      testnetButerinCards: process.env.NUXT_TESTNET_BUTERIN_CARDS,
      testnetMinedJpeg: process.env.NUXT_TESTNET_MINED_JPEG,

      manualSaleLimit: process.env.NUXT_MANUAL_SALE_LIMIT || "100000",
    },

  },

  compatibilityDate: "2024-09-16"
})
