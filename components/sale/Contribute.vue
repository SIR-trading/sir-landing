<script lang="ts" setup>

// Initialize composables
const wallet = useWallet();
// Initialize store
const saleStore = useSaleStore()
const isConnected = computed(() => wallet.isConnected);
const hasSaleEnded = computed(() => saleStore.hasSaleEnded);
</script>

<template>
  <div class="flex flex-col items-center justify-center w-full rounded-lg p-1 md:p-3 gap-3">
    <div v-if="isConnected.value"
         :class="['flex flex-col flex-grow w-full md:flex-row items-center justify-center md:items-start p-1 md:p-3 gap-3 md:gap-6 rounded-lg',
     'md:justify-center items-center md:w-full']">
      <SaleContributeForm v-if="!hasSaleEnded" class="w-full md:w-1/2" />
      <SalePreviousContributions class="w-full md:w-1/2" />
    </div>
    <div v-else>
      <WalletConnect />
    </div>
  </div>
</template>

