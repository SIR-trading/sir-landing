<script setup lang="ts">
import Header from "~/components/layout/Header.vue";
import {init} from '@web3-onboard/vue'
import type {AppMetadata} from "@web3-onboard/common";
import injectedModule from '@web3-onboard/injected-wallets'
import coinbaseWallet from '@web3-onboard/coinbase';
import {ethereum, local, sepolia} from "~/web3/chains";

import type {OnboardAPI} from "@web3-onboard/core";
import {useWalletStore} from "~/stores/wallet";
import {useEnv} from "~/composables/useEnv";
import {useToast} from "#ui/composables/useToast";
import {useOnboard} from "@web3-onboard/vue";
import {useWallet} from "~/composables/useWallet";

const injected = injectedModule()
const coinbase = coinbaseWallet()





const web3Onboard = ref<null|OnboardAPI>(null)

const appMetadata: AppMetadata = {
  name: 'Project Name',
  description: 'Project Description',
}

web3Onboard.value = init({
  wallets: [injected, coinbase],
  chains: [local, ethereum, sepolia],
  appMetadata: appMetadata,
  theme: "dark",
  connect: {
    autoConnectLastWallet: true,
    showSidebar: true,
    removeWhereIsMyWalletWarning: true,
  }
})
useSeoMeta({
  title: 'Sir.trading',
  ogTitle: 'Sir.trading',
  description: 'SIR is a DeFi protocol designed to address the key challenges of leveraged trading, such as volatility decay and liquidation risks, making it safer for long-term investing.',
  ogDescription: 'SIR is a DeFi protocol designed to address the key challenges of leveraged trading, such as volatility decay and liquidation risks, making it safer for long-term investing.',
  ogImage: '/twitter_image.png',
})

const walletStore = useWalletStore()
const {chain} = useEnv()
const {changeChain} = useWallet()

/**
 * @dev check if chain is correct.
 */
const isChainCorrect = computed(() => {

  console.log("chain.id.toString() === walletStore.getChainId.toString()", chain.id.toString() === walletStore.getChainId.toString())
  if (!chain) return false
  if (useWalletStore().getChainId)
    return chain.id.toString() === walletStore.getChainId.toString()
})


const toast = useToast()
/**
 * @dev watch for chain change and change-action on notification.
 */

watch(isChainCorrect, (val) => {
  console.log("ChainCorrect::", val)
  if (!val) {
    toast.add({
      title: 'Wrong Chain',
      description: `Please switch to ${chain.label}`,
      color: 'yellow',
      timeout: 60000,
      actions: [
        {
          label: 'Switch',
          onClick: () => changeChain()
        }
      ]
    })
  } else {
    toast.remove('Wrong Chain')
  }
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