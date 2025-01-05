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
    public: {
      testnetContract: process.env.NUXT_TESTNET_CONTRACT,
      contract: process.env.NUXT_MAINNET_CONTRACT,
      env: process.env.NUXT_ENV,
      buterinCards: process.env.NUXT_BUTERIN_CARDS,
      minedJpeg: process.env.NUXT_MINED_JPEG,
      rpc: process.env.NUXT_RPC,
      manualSaleLimit: process.env.NUXT_MANUAL_SALE_LIMIT || "100_000",
    },

  },

  compatibilityDate: "2024-09-16"
})
