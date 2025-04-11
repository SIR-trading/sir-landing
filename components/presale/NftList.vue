<script lang="ts" setup>
import {ref} from 'vue';
// import SirButton from "~/components/common/SirButton.vue";
// import Modal from "~/components/common/Modal.vue";
import ContributeForm from "~/components/sale/ContributeForm.vue";
import {useSaleStore} from "~/stores/sale";
import Bonus from "~/components/sale/Bonus.vue";
import PreviousContributions from "~/components/sale/PreviousContributions.vue";
import type {SelectedItem} from "@/types/data"
// Initialize composables
const nfts = useNfts();
const { address, isConnected, isBoostedAddress } = useWallet();

declare interface INftObject {
  collection: string;
  id: string;
}

// Reactive variables
const btList: Ref<Array<INftObject|undefined>> = ref([]);
const totalSelected: Ref<number> = ref(0);

// Fetch NFTs if connected
let bt:Ref<Array<number>> = ref([]);
let mj:Ref<Array<number>> = ref([]);

const fetchData = async () => {
  bt.value = await nfts.fetchWalletButerinCards(address.value as string) as Array<number>;
  mj.value = await nfts.fetchWalletMinedJpeg(address.value as string) as Array<number>;
}

watch([isConnected, address], async ([connected, address]) => {
  if(connected || address) {
    await fetchData();
  }
})

if (isConnected.value) {
  console.log('address', address.value);
  bt.value = await nfts.fetchWalletButerinCards(address.value as string) as Array<number>;
  mj.value = await nfts.fetchWalletMinedJpeg(address.value as string) as Array<number>;
}

const saleStore = useSaleStore()

const totalLocked = computed(() => {
  const bt = !!saleStore.contributions.lockedButerinCards ? saleStore.contributions.lockedButerinCards.amount : 0;
  const mj = !!saleStore.contributions.lockedMinedJpegs ? saleStore.contributions.lockedMinedJpegs.amount : 0;
  return  mj + bt
})

const MAX_BT_LIST_LENGTH = 5;

const addNFTItem = (item: INftObject) => {
  btList.value.push(item);
  saleStore.selectedItems.push(item);
  totalSelected.value += 1;
};

const removeNFTItem = (index: number, item: INftObject) => {
  btList.value.splice(index, 1);
  saleStore.selectedItems = saleStore.selectedItems.filter(
      (selectedItem) => selectedItem.id !== item.id || selectedItem.collection !== item.collection
  );
  totalSelected.value -= 1;
};

const toggleSelection = (collection: string, nft: number) => {
  const nftItem = {collection: collection, id: nft.toString()};
  const index = btList.value.findIndex(
      (item: INftObject | undefined) =>
          item?.collection === nftItem.collection && item?.id === nftItem.id
  );

  if (index === -1) {
    if (btList.value.length >= MAX_BT_LIST_LENGTH) {
      return;
    }
    addNFTItem(nftItem);
  } else {
    removeNFTItem(index, nftItem);
  }
};
// Check if selected
const isSelected = (collection: string, nft: number) => {
  return btList.value.some((item: SelectedItem|undefined) => item?.collection === collection && item?.id === nft.toString());
};

const btSelected = computed(() => {
  return btList.value.map((item: SelectedItem|undefined) => item?.collection === "BT" ? item?.id : null).filter(id => id !== null);
})

const mjSelected = computed(() => {
  return btList.value.map((item: SelectedItem|undefined) => item?.collection === "MJ" ? item?.id : null).filter(id => id !== null);
})

const isCheckboxDisabled = computed(() => {
  return ((totalLocked.value + totalSelected.value) >= 5)
})

const hasSaleEnded = computed(() => {
  return saleStore.hasSaleEnded
})

</script>

<template>
  <div class="flex flex-col items-center justify-center w-full rounded-lg p-1 md:p-3 gap-3">
    <div v-if="isConnected"
         :class="['flex flex-col flex-grow w-full md:flex-row items-center justify-center md:items-start p-1 md:p-3 gap-3 md:gap-6 rounded-lg',
         'md:justify-center items-center md:w-full']">
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
