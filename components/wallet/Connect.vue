<script lang="ts" setup>
import {useOnboard} from '@web3-onboard/vue'
import type {EIP1193Provider} from "@web3-onboard/core";
import SirButton from "~/components/common/SirButton.vue";
import {useWalletStore} from "~/stores/wallet";
import {useWallet} from "~/composables/useWallet";


const {chain} = useEnv()
const {connectWallet, disconnectConnectedWallet, connectedWallet} = useOnboard()

const connect = async () => {
  await connectWallet()
}

const saleStore = useSaleStore()
const walletStore = useWalletStore()
const {isConnected, address, changeChain, isChainCorrect} = useWallet()

const manageChain = async () => {
    const provider = connectedWallet.value?.provider as EIP1193Provider
    await provider.request({method: 'eth_chainId'}).then((_chainId: string) => {
      useWalletStore().chain = _chainId
    })

    provider.on('accountsChanged', async (accounts: string[]) => {
      console.log("Accounts Changed: ", accounts)
      await saleStore.fetchSaleState()
      await saleStore.fetchWalletContributions(accounts[0])
      await walletStore.checkAgreed(accounts[0])
    })

    provider.on('chainChanged', async (_chainId: string) => {
      console.log("Chain Changed: ", _chainId)
      useWalletStore().chain = _chainId
    })

}

watch([isConnected, isChainCorrect], async ([isConnected, isChainCorrect]) => {
  if(isConnected) {
    await manageChain()
  }
  if(isChainCorrect) {
    useToast().add({
      title: 'Connected to the correct chain',
      description: `Connected to ${chain.label}`,
      timeout: 3000,
      color: 'green'
    })
  }else {
    console.log("Connected to the wrong chain")
  }
})

onMounted(async () => {
  if(isConnected) {
    await manageChain()
  }
})
</script>

<template>
  <div>
    <SirButton v-if="!isConnected" label="Connect wallet" @click="connect" />
    <UContainer v-else>
      <div class="flex flex-col md:flex-row items-center md:gap-3">
        <div class="text-sm mr-1">{{ formatAddress(address as string) }}</div>
        <SirButton v-if="isChainCorrect" @click="disconnectConnectedWallet" label="Disconnect" />
        <UButton v-else color="red" variant="outline" label="Wrong Chain" @click="changeChain"/>
      </div>
    </UContainer>
  </div>
</template>

<style scoped></style>
