<script setup lang="ts">
import Header from "~/components/layout/Header.vue";
import {init} from '@web3-onboard/vue'
import type {AppMetadata} from "@web3-onboard/common";
import injectedModule from '@web3-onboard/injected-wallets'
import coinbaseWallet from '@web3-onboard/coinbase';
import {ethereum, local} from "~/web3/chains";

import type {OnboardAPI} from "@web3-onboard/core";

const injected = injectedModule()
const coinbase = coinbaseWallet()

const config = useRuntimeConfig()



const web3Onboard = ref(null as OnboardAPI)

const appMetadata: AppMetadata = {
  name: 'Project Name',
  description: 'Project Description',
}


web3Onboard.value = init({
  wallets: [injected, coinbase],
  chains: [local, ethereum],
  appMetadata: appMetadata,
  theme: "dark",
  connect: {
    autoConnectLastWallet: true,
    showSidebar: true,
    removeWhereIsMyWalletWarning: true,

  }
})
// console.log("web3Onboard", web3Onboard)
useSeoMeta({
  title: 'Sir.trading',
  ogTitle: 'Sir.trading',
  description: 'SIR is a DeFi protocol designed to address the key challenges of leveraged trading, such as volatility decay and liquidation risks, making it safer for long-term investing.',
  ogDescription: 'SIR is a DeFi protocol designed to address the key challenges of leveraged trading, such as volatility decay and liquidation risks, making it safer for long-term investing.',
  ogImage: '/twitter_image.png',
  twitterCard: '/twitter_image.png',
})
</script>
<template>
  <div class="main-layout">
    <Header/>
    <main class="content h-80">
      <NuxtPage/>
      <UNotifications/>

    </main>
  </div>
</template>

<style scoped>
.main-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: radial-gradient(55.25% 55.16% at 48.63% 44.84%, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.02) 100%);
  background-blend-mode: lighten;
}

.content {
  flex: 1;
}
</style>