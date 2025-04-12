<script lang="ts" setup>
import {ref} from 'vue';

// Initialize composables
const nfts = useNfts();
const wallet = useWallet();

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

const saleStore = usePresaleStore()

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
