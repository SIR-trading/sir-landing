<script lang="ts" setup>
import {ref} from "vue";
import type {Contribution, Token} from "~/types";
import {Stablecoin} from "~/types/data";
import {useErc20} from "~/composables/useErc20";
import Timer from "~/components/sale/Timer.vue";

const presaleStore = usePresaleStore();

const {address, isConnected} = useWallet()
const hasFetchedContributions = ref(false);

const {withdrawNfts} = usePreSaleClient();
const isWithdrawing: Ref<boolean> = ref(false);

const withdrawNFTs = async () => {
  isWithdrawing.value = true;
  await withdrawNfts().then(() => {
    isWithdrawing.value = false;
  })
}

const fetchContributions = async () => {
  if (!isConnected.value) return;
  await presaleStore.fetchWalletContributions(address.value as string);
  hasFetchedContributions.value = true;
}

// Watch for changes in 'isConnected' to fetch contributions
watch(isConnected, fetchContributions);

const contributions = computed(() => presaleStore.contributions as Contribution)

// Initially, call fetchContributions if already connected
fetchContributions();

onBeforeMount(async () => {
  await fetchContributions()
  })

onMounted(async () => {
  await presaleStore.fetchWalletContributions(useWallet().address.value as string);
})

const {getTokenInfo} = useErc20();
// Create a ref to hold the token
const tokenData = ref<Token | undefined>(undefined);

// Create a computed property for the ticker
const tokenTicker = computed((): string | undefined => {
  const listStables = Stablecoin;
  if (!contributions.value.stablecoin) return undefined;
  const tIndex = contributions.value.stablecoin;
  return listStables[tIndex] as string;
});

// Watch for changes to the ticker and fetch the token
watch(tokenTicker, async (newTicker) => {
  if (newTicker) {
    tokenData.value = await getTokenInfo(newTicker);
  } else {
    tokenData.value = undefined;
  }
}, { immediate: true });

// Replace the original computed with a ref that will be updated asynchronously
const token = computed(() => tokenData.value);

const {isBoostedAddress} = useWallet();

const itemsLocked = computed(() => {
  const mj:number = !!contributions.value.lockedMinedJpegs?.amount ? contributions.value.lockedMinedJpegs?.amount : 0;
  const bt:number = !!contributions.value.lockedButerinCards?.amount ? contributions.value.lockedButerinCards?.amount : 0;
  return mj + bt;
})

const tokenAllocation = computed(() => {
  const contributed = contributions.value.amountFinalNoDecimals;
  const withdrawable = contributions.value.amountWithdrawableNoDecimals;
  return (contributed + withdrawable) * 6045
})

const bonusAllocation = computed(() => {
  const contributed = contributions.value.amountFinalNoDecimals;
  const withdrawable = contributions.value.amountWithdrawableNoDecimals;

  return 362.7 * (contributed + withdrawable) * (isBoostedAddress.value ? 5 : itemsLocked.value)
})

const formatNumber = (value: number, digits: number = 2) => {
  const factor = Math.pow(10, digits);
  const roundedValue = Math.floor(value * factor) / factor;
  return roundedValue.toLocaleString(undefined, {maximumFractionDigits: digits});
}

</script>

<template>
  <div
      :class="[
          'flex flex-col  items-center justify-center md:justify-center rounded-lg gap-1 text-sm w-full',
          'md:w-2/3'
      ]"
  >
    <div
      class="flex flex-col md:flex-row items-stretch justify-between w-full h-full rounded-lg  gap-1 bg-[#ffffff15] p-3"
    >
      <div>Total contribution:</div>
      <div>
        <span class="font-semibold text-md"> {{ formatNumber(contributions.amountFinalNoDecimals) }}</span>
        <span class="text-xs top-2 ml-1 text-gray-suit-500"> {{ token?.name }}</span></div>
    </div>
    <!-- <div
        class="flex flex-col md:flex-row items-center justify-between w-full h-full bg-midGray rounded-lg gap-1 bg-[#ffffff15] p-3">
      <div>Token allocation:</div>
      <div class="">
        <div class="flex flex-row items-center justify-center font-semibold text-md">
          <UTooltip :text="`${ formatNumber(tokenAllocation, 0) } SIR + ${formatNumber(bonusAllocation,0)} SIR bonus`">
            <UIcon name="heroicons:question-mark-circle" class="w-6 h-6 mr-2"/>
          </UTooltip>

        <div>
          <span class="text-md"> {{ formatNumber(tokenAllocation + bonusAllocation, 0) }}</span>
        <span class="text-xs ml-1 text-gray-suit-500 font-normal">SIR</span>
        </div>
        </div>
      </div>
    </div> -->
    <div
        class="flex flex-col md:flex-row items-stretch justify-between w-full h-full bg-midGray rounded-lg gap-1 bg-[#ffffff15] p-3">
      <div>Number of locked NFTs:</div>
      <UButton color="red" variant="outline"
               v-if="itemsLocked > 0 && presaleStore.saleState.timeSaleEnded"
               class="withdraw-btn text-xs ring-1 ring-redAccent hover:ring-black-russian-950"
               @click="withdrawNFTs"
      >
        withdraw
        <Timer :start-date="presaleStore.saleState.timeSaleEnded" :days-duration="365"/>
      </UButton>
      <div><span class="font-semibold text-md"> {{ itemsLocked }}</span></div>
    </div>
  </div>
</template>

<style scoped>
.withdraw-btn {
  display: inline-flex;
  border-radius: 5px;
  padding: 5px;
  flex-direction: row;
  gap: 10px;
  font-weight: 600;
  color: #fca5a5;

  &:hover {
    background-color: #f87171;
    color: #090522;

  }
}
</style>
