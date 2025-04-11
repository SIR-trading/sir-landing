<script lang="ts" setup>
// import SirButton from "~/components/common/SirButton.vue";
// import Modal from "~/components/common/Modal.vue";
import ContributeForm from "~/components/sale/ContributeForm.vue";
import {useSaleStore} from "~/stores/sale";
import Bonus from "~/components/sale/Bonus.vue";
import PreviousContributions from "~/components/sale/PreviousContributions.vue";
import type {SelectedItem} from "@/types/data"
// Initialize composables
const nfts = useNfts();
const wallet = useWallet();









const saleStore = useSaleStore()




</script>

<template>
  <div class="flex flex-col items-center justify-center w-full rounded-lg p-1 md:p-3 gap-3">
    {{wallet.isConnected}}
    <div v-if="wallet.isConnected"
         :class="['flex flex-col flex-grow w-full md:flex-row items-center justify-center md:items-start p-1 md:p-3 gap-3 md:gap-6 rounded-lg',
         'md:justify-center items-center md:w-full']">
      {{saleStore.hasSaleEnded}}
      <SaleContributeForm v-if="!saleStore.hasSaleEnded" />
      <PreviousContributions />
    </div>

    <div class="mt-2">
      <Bonus/>
    </div>
  </div>
</template>

<style scoped>
.custom-checkbox {
  cursor: pointer;
}

/* Optionally, to ensure the ghost 'clicking hand' icon on the checkbox */
.custom-checkbox::before {
  content: '';
  position: absolute;
  width: 16px;
  height: 16px;
  cursor: pointer;
}
</style>
