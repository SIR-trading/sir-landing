<script lang="ts" setup>

// Initialize composables
const nfts = useNfts();
const wallet = useWallet();

// Fetch NFTs if connected
let bt:Ref<Array<number>> = ref([]);
let mj:Ref<Array<number>> = ref([]);

const fetchData = async () => {
  bt.value = await nfts.fetchWalletButerinCards(wallet.address.value as string) as Array<number>;
  mj.value = await nfts.fetchWalletMinedJpeg(wallet.address.value as string) as Array<number>;
}

watch([wallet.isConnected, wallet.address], async ([connected, address]) => {
  if(connected || address) {
    await fetchData();
  }
})

if (wallet.isConnected.value) {
  console.log('address', wallet.address.value);
  bt.value = await nfts.fetchWalletButerinCards(wallet.address.value as string) as Array<number>;
  mj.value = await nfts.fetchWalletMinedJpeg(wallet.address.value as string) as Array<number>;
}
</script>

<template>
  <div class="flex flex-col items-center justify-center w-full rounded-lg p-1 md:p-3 gap-3">
    <div v-if="wallet.isConnected"
         :class="['flex flex-col flex-grow w-full md:flex-row items-center justify-center md:items-start p-1 md:p-3 gap-3 md:gap-6 rounded-lg',
         'md:justify-center items-center md:w-full']">
      <PresalePreviousContributions />
    </div>

    <div class="mt-2">
      <PresaleBonus/>
    </div>
  </div>
</template>

<style scoped>
</style>
