<script lang="ts" setup>
import {ref} from "vue";
import {useSaleStore} from "~/stores/sale";
import type {Contribution, Token} from "~/types";
import {Stablecoin} from "~/types/data";
import {useErc20} from "~/composables/useErc20";
import Timer from "~/components/sale/Timer.vue";

const saleStore = useSaleStore();

const {address, isConnected} = useWallet()
const hasFetchedContributions = ref(false);

const {withdraw, withdrawNfts} = useEthClient()
const isWithdrawing: Ref<boolean> = ref(false);
const withdrawFromWallet = async () => {
  isWithdrawing.value = true;
  await withdraw().then(() => {
    isWithdrawing.value = false;
  })
}

const withdrawNFTs = async () => {
  isWithdrawing.value = true;
  await withdrawNfts().then(() => {
    isWithdrawing.value = false;
  })
}


const fetchContributions = async () => {
  if (!isConnected.value) return;
  console.log("fetching contributions")
  await saleStore.fetchWalletContributions(address.value as string);
  hasFetchedContributions.value = true;
  console.log("FETCHED", saleStore.getWalletContributions)
};

// Watch for changes in 'isConnected' to fetch contributions
watch(isConnected, fetchContributions);

const contributions = computed(() => saleStore.contributions as Contribution)

// Initially, call fetchContributions if already connected
fetchContributions();

const timeLastContribution = ref(0);
const timeSaleEnded = ref(new Date().getTime());

const hasSaleEnded = computed(() => {
  return saleStore.hasSaleEnded
})

onBeforeMount(async () => {
  await fetchContributions()
  timeLastContribution.value = saleStore.contributions.timeLastContribution;
  console.log("timeLastContribution", timeLastContribution.value, timeSaleEnded.value)


})

onMounted(async () => {
  await useSaleStore().fetchWalletContributions(useWallet().address.value as string);
})
const {getTokenInfo} = useErc20();
const token = computed((): Token | null => {
  const listStables = Stablecoin;
  if (!contributions.value.stablecoin) return null;
  const tIndex = contributions.value.stablecoin;
  const ticker = listStables[tIndex] as string;
  return getTokenInfo(ticker) as Token;
})

const itemsLocked = computed(() => {
  const mj = !!contributions.value.lockedMinedJpegs?.amount ? contributions.value.lockedMinedJpegs?.amount : 0;
  const bt = !!contributions.value.lockedButerinCards?.amount ? contributions.value.lockedButerinCards?.amount : 0;
  return +mj + +bt;
})

const tokenAllocation = computed(() => {
  const contributed = contributions.value.amountFinalNoDecimals;
  const withdrawable = contributions.value.amountWithdrawableNoDecimals;
  return (contributed + withdrawable) * 1209
})

const bonusAllocation = computed(() => {
  const contributed = contributions.value.amountFinalNoDecimals;
  const withdrawable = contributions.value.amountWithdrawableNoDecimals;

  return 72.54 * (contributed + withdrawable) * itemsLocked.value
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
          hasSaleEnded ? 'md:w-2/3' : 'md:w-full'
      ]"
  >
    <div
        class="flex flex-col md:flex-row items-stretch justify-between w-full h-full rounded-lg  gap-1 bg-[#ffffff15] p-3">
      <div>Total locked contributions:</div>
      <div>
        <span class="font-semibold text-md"> {{ formatNumber(contributions.amountFinalNoDecimals) }}</span>
        <span class="text-xs top-2 ml-1 text-gray-suit-500"> {{ token?.name }}</span></div>
    </div>
    <div
        class="flex flex-col md:flex-row items-center justify-between w-full h-full bg-midGray rounded-lg gap-1 bg-[#ffffff15] p-3">
      <div>Withdrawable balance:</div>
      <UButton :loading="isWithdrawing" color="red" variant="outline"
               v-if="contributions.amountWithdrawableNoDecimals > 0"
               class="withdraw-btn text-xs ring-1 ring-redAccent hover:ring-black-russian-950"
               @click="withdrawFromWallet"
      >
        withdraw
        <Timer :start-date="timeLastContribution" :days-duration="1" :no-days="true"/>
      </UButton>
      <div>
        <span class="font-semibold text-md"> {{ formatNumber(contributions.amountWithdrawableNoDecimals) }}</span>
        <span class="text-xs top-2 ml-1 text-gray-suit-500">{{ token?.name }}</span></div>
    </div>
    <div
        class="flex flex-col md:flex-row items-stretch justify-between w-full h-full bg-midGray rounded-lg gap-1 bg-[#ffffff15] p-3">
      <div>Current token allocation:</div>
      <div>
        <span class="font-semibold text-md">
          <UTooltip :text="`${ formatNumber(tokenAllocation, 0) } SIR + ${formatNumber(bonusAllocation,0)} SIR bonus`">
            <UIcon name="heroicons:question-mark-circle" class="w-6 h-6 mr-2"/>
            {{ formatNumber(tokenAllocation + bonusAllocation, 0) }}
          </UTooltip>
        </span>
        <span class="text-xs ml-1 text-gray-suit-500">SIR</span>
      </div>
    </div>
    <div
        class="flex flex-col md:flex-row items-stretch justify-between w-full h-full bg-midGray rounded-lg gap-1 bg-[#ffffff15] p-3">
      <div>Number of locked NFTs:</div>
      <UButton color="red" variant="outline"
               v-if="hasSaleEnded"
               class="withdraw-btn text-xs ring-1 ring-redAccent hover:ring-black-russian-950"
               @click="withdrawNFTs"
      >
        withdraw
        <Timer :start-date="timeSaleEnded" :days-duration="365"/>
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
