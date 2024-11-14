<script lang="ts" setup>
import {ref} from 'vue';
import {useNfts} from '~/composables/useNfts';
import {useWallet} from '~/composables/useWallet';
// import SirButton from "~/components/common/SirButton.vue";
// import Modal from "~/components/common/Modal.vue";
import ContributeForm from "~/components/sale/ContributeForm.vue";
import {useSaleStore} from "~/stores/sale";
import Bonus from "~/components/sale/Bonus.vue";
import PreviousContributions from "~/components/sale/PreviousContributions.vue";

// Initialize composables
const nfts = useNfts();
const wallet = useWallet();
const {address, isConnected} = wallet;

// Reactive variables
const btList = ref([]);
const totalSelected = ref(0);

// Fetch NFTs if connected
let bt = ref([]);
let mj = ref([]);

const fetchData = async () => {
  bt.value = await nfts.fetchWalletButerinCards(address.value);
  mj.value = await nfts.fetchWalletMinedJpeg(address.value);
}

watch([isConnected, address], async ([connected, address]) => {
  if(connected || address) {
    await fetchData();
  }
})

if (isConnected.value) {
  console.log('address', address.value);
  bt.value = await nfts.fetchWalletButerinCards(address.value);
  mj.value = await nfts.fetchWalletMinedJpeg(address.value);
}



const saleStore = useSaleStore()

const totalLocked = computed(() => {
  const bt = !!saleStore.contributions.lockedButerinCards ? saleStore.contributions.lockedButerinCards.amount : 0;
  const mj = !!saleStore.contributions.lockedMinedJpegs ? saleStore.contributions.lockedMinedJpegs.amount : 0;
  return  mj + bt
})

// Method to handle selection
const toggleSelection = (collection: string, nft: number) => {
  const nftObject = {collection: collection, id: nft};
  const index = btList.value.findIndex((item) => item.collection === nftObject.collection && item.id === nftObject.id);
  if (index === -1) {
    if (btList.value.length >= 5) {
      return;
    }
    // Add NFT to the list
    btList.value.push(nftObject);
    saleStore.selectedItems.push(nftObject);
    totalSelected.value += 1;
    console.log("*****************", btList.value, totalSelected.value);
  } else {
    // Remove NFT from the list
    btList.value.splice(index, 1);
    saleStore.selectedItems.splice(nftObject, 1);
    totalSelected.value -= 1;
  }
};

// Check if selected
const isSelected = (collection: string, nft: number) => {
  return btList.value.some((item) => item.collection === collection && item.id === nft);
};

const btSelected = computed(() => {
  return btList.value.map((item) => item.collection === "BT" ? item.id : null).filter(id => id !== null);
})

const mjSelected = computed(() => {
  return btList.value.map((item) => item.collection === "MJ" ? item.id : null).filter(id => id !== null);
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
         hasSaleEnded ? 'md:justify-center': 'md:justify-start']">
      <ContributeForm v-if="!hasSaleEnded" :mined-jpegs="mjSelected" :buterin-cards="btSelected" @refresh="fetchData"/>
      <PreviousContributions />
    </div>

    <div class="flex flex-col  md:flex-row gap-3 md:gap-6 w-full rounded-lg p-1 md:p-3">
      <div class="flex flex-col w-full gap-2 items-center bg-midGray rounded-md p-4">
        <div class="flex justify-start section-header text-lg">Buterin Cards</div>
        <div v-if="bt.length > 0"
             class="px-1 py-4 max-h-[280px] w-full overflow-y-auto flex flex-row flex-wrap gap-2 justify-start items-start">
          <div v-for="tokenId in bt" :key="`BT-${tokenId}`"
               class="flex flex-col items-center justify-center w-[75px] h-[100px]">
            <div
                :class="[
                    'flex flex-col gap-3 w-full justify-center  items-center rounded-tr-lg rounded-br-lg rounded-tl-lg h-[129px] p-2 bg-[#ffffff11] hover:bg-[#ffffff55]',
                    !(isCheckboxDisabled && !isSelected('BT', tokenId)) ? 'cursor-pointer' : 'cursor-not-allowed',
                ]"
                @click="!(isCheckboxDisabled && !isSelected('BT', tokenId)) ? toggleSelection('BT', tokenId) : null">
              <div class="flex flex-col gap-y-1">
                <span>Card</span>
                <span>#{{ tokenId + 1 }}</span>
              </div>
              <UCheckbox
                  @click="toggleSelection('BT', tokenId)"
                  class="z-100 custom-checkbox"
                  :model-value="isSelected('BT', tokenId)"
                  @update:model-value="() => toggleSelection('BT', tokenId)"
                  :name="`BT-${tokenId}`"
                  :disabled="isCheckboxDisabled && !isSelected('BT', tokenId)"
              />
            </div>
          </div>
        </div>
        <div v-else class="flex flex-col gap-2 items-center justify-center w-full h-full italic text-gray-suit-600">
          No cards found.
        </div>
      </div>
      <div class="flex flex-col w-full gap-2  items-center rounded-md bg-midGray p-4">
        <div class="flex justify-start section-header text-lg">MINED JPEG</div>
        <div v-if="mj.length > 0"
            class="px-1 py-4 max-h-[280px] w-full overflow-y-auto flex flex-row flex-wrap gap-2 justify-start items-start">
        <div v-for="tokenId in mj" :key="`MJ-${tokenId}`"
             class="flex flex-col items-center justify-center w-[75px] h-[100px]">
          <div
              :class="[
                    'flex flex-col gap-3 w-full justify-center  items-center rounded-tr-lg rounded-br-lg rounded-tl-lg h-[129px] p-2 bg-[#ffffff11] hover:bg-[#ffffff55]',
                    !(isCheckboxDisabled && !isSelected('MJ', tokenId)) ? 'cursor-pointer' : 'cursor-not-allowed',
                ]"
              @click="!(isCheckboxDisabled && !isSelected('MJ', tokenId)) ? toggleSelection('MJ', tokenId) : null">
            <div class="flex flex-col gap-y-1">
              <span>MJ</span>
              <span>#{{ tokenId + 1 }}</span>
            </div>
              <UCheckbox
                  @click="toggleSelection('MJ', tokenId)"
                  class="z-100 custom-checkbox"
                  :model-value="isSelected('MJ', tokenId)"
                  @update:model-value="() => toggleSelection('MJ', tokenId)"
                  :name="`MJ-${tokenId}`"
                  :disabled="isCheckboxDisabled && !isSelected('MJ', tokenId)"
              />
            </div>
          </div>
        </div>
        <div v-else class="flex flex-col gap-2 items-center justify-center w-full h-full italic text-gray-suit-600">
          No Mined JPEGs
        </div>
      </div>

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
