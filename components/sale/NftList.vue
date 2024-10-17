<script lang="ts" setup>
import {ref} from 'vue';
import {useNfts} from '~/composables/useNfts';
import {useWallet} from '~/composables/useWallet';
// import SirButton from "~/components/common/SirButton.vue";
// import Modal from "~/components/common/Modal.vue";
import ContributeForm from "~/components/sale/ContributeForm.vue";
import {useSaleStore} from "~/stores/sale";
import Bonus from "~/components/sale/Bonus.vue";

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
if (isConnected) {
  console.log('address', address.value);
  bt.value = await nfts.fetchWalletButerinCards(address.value);
  mj.value = await nfts.fetchWalletMinedJpeg(address.value);
}

const fetchData = async () => {
  bt.value = await nfts.fetchWalletButerinCards(address.value);
  mj.value = await nfts.fetchWalletMinedJpeg(address.value);
}

const saleStore = useSaleStore()

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
    saleStore.selectedItems.splice(nftObject);
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


const isModalOpen: Ref<boolean> = ref(false)

const toggleModal = () => {
  isModalOpen.value = !isModalOpen.value
}

</script>

<template>
  <div class="flex flex-col items-center justify-center w-full rounded-lg p-3 gap-2">
    <div class="flex flex-col w-full md:flex-row items-center justify-center p-6">
      <div class="flex flex-col gap-2 w-full items-center justify-center p-2">
        <h1 class="section-header sir-text-shadow font-bold text-xl mb-[24px]">Contribute</h1>
        <p class="flex flex-col">
          <span>You can withdraw your contribution within 24h</span>
          <span> if you change your mind. After that it’s locked in.</span>
        </p>
      </div>
      <ContributeForm :mined-jpegs="mjSelected" :buterin-cards="btSelected" @refresh="fetchData"/>
    </div>
    <div class="flex flex-col  md:flex-row gap-2 w-full bg-midGray rounded-lg p-3">
      <div class="flex flex-col w-full gap-2 items-center rounded-md  p-3">
        <div>Buterin Cards</div>
        <div class="p-3 max-h-[280px] overflow-y-auto w-full flex flex-col gap-2">
          <div v-for="tokenId in bt" :key="`BT-${tokenId}`" class="flex flex-col items-center justify-center w-full">
            <div class="flex flex-row gap-3 w-full justify-between rounded-md p-2 bg-[#ffffff11] cursor-pointer hover:bg-[#ffffff55]" @click="toggleSelection('BT', tokenId)">
              <div>{{ tokenId }}</div>
              <UCheckbox
                  :model-value="isSelected('BT', tokenId)"
                  @update:model-value="() => toggleSelection('BT', tokenId)"
                  :name="`BT-${tokenId}`"
                  :disabled="totalSelected >= 5 && !isSelected('BT', tokenId)"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="flex flex-col w-full gap-2  items-center rounded-md p-3">
        <div class="flex justify-start">Mined Jpeg</div>
        <div class="p-3 max-h-[280px] overflow-y-auto w-full flex flex-col gap-2">
          <div v-for="tokenId in mj" :key="`MJ-${tokenId}`" class="flex flex-col items-center justify-center w-full">
            <div class="flex flex-row gap-3 w-full justify-between rounded-md p-2 bg-[#ffffff11] cursor-pointer hover:bg-[#ffffff55]" @click="toggleSelection('MJ', tokenId)">
              <div>{{ tokenId }}</div>
              <UCheckbox
                  :model-value="isSelected('MJ', tokenId)"
                  @update:model-value="() => toggleSelection('MJ', tokenId)"
                  :name="`MJ-${tokenId}`"
                  :disabled="totalSelected >= 5 && !isSelected('MJ', tokenId)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="mt-2">
      <Bonus />
    </div>
  </div>
</template>

<style scoped></style>