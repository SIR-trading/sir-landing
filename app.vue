<script setup lang="ts">
import Header from "~/components/layout/Header.vue";
import {init} from '@web3-onboard/vue'
import type {AppMetadata} from "@web3-onboard/common";
import injectedModule from '@web3-onboard/injected-wallets'
import coinbaseWallet from '@web3-onboard/coinbase';
import {hychain, hychainTestnet} from "~/web3/chains";
import type {OnboardAPI} from "@web3-onboard/core";

const injected = injectedModule()
const coinbase = coinbaseWallet()

const web3Onboard = ref(null as OnboardAPI)

const appMetadata: AppMetadata = {
  name: 'Project Name',
  description: 'Project Description',
}

web3Onboard.value = init({
  wallets: [injected, coinbase],
  chains: [hychain, hychainTestnet],
  appMetadata: appMetadata,
  theme: 'dark',
  connect: {
    autoConnectLastWallet: true,
    showSidebar: false,
    removeWhereIsMyWalletWarning: true
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
    <main class="content p-1 md:p-3 lg:p-7 h-80">
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
}

.content {
  flex: 1;
}
</style>