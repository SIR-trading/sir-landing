<script lang="ts" setup>
import {useOnboard} from '@web3-onboard/vue'
import type {EIP1193Provider} from "@web3-onboard/core";
import SirButton from "~/components/common/SirButton.vue";
const {chain} = useEnv()

const {connectWallet, disconnectConnectedWallet, connectedWallet} = useOnboard()

const connect = async () => {
  await connectWallet()
}

const {toast} = useToast()
const {isConnected, address} = useWallet()


watch(isConnected, (value) => {
  if (value) {

    console.log("Connected Wallet: ", connectedWallet.value)
    const provider = connectedWallet.value?.provider as EIP1193Provider

    console.log("Provider: ", provider)

    provider.on('accountsChanged', (accounts: string[]) => {
      console.log("Accounts Changed: ", accounts)
    })

  }
})


</script>

<template>
  <div>
    <SirButton label="Connect wallet" v-if="!isConnected" @click="connect" />
    <UContainer v-else>
      <div class="flex flex-col md:flex-row items-center md:gap-3">
        <div class="text-sm mr-1">{{ formatAddress(address) }}</div>
        <SirButton @click="disconnectConnectedWallet" label="Disconnect" />
      </div>
    </UContainer>
  </div>
</template>

<style scoped></style>
