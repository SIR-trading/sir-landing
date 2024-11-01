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
const {withdraw} = useEthClient()
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


onMounted(() => {
  fetchContributions()
})
const {getTokenInfo} = useErc20();
const token = computed(() => {
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
  return (contributed + withdrawable) * 12.09
})

const bonusAllocation = computed(() => {
  const contributed = contributions.value.amountFinalNoDecimals;
  const withdrawable = contributions.value.amountWithdrawableNoDecimals;

  return 0.7254 * (contributed + withdrawable) * itemsLocked.value
})


</script>

<template>
  <div class="flex flex-col flex-grow items-center justify-center md:justify-center h-full w-full  rounded-lg gap-1  text-sm">
    <div class="flex flex-col md:flex-row items-stretch justify-between w-full h-full rounded-lg  gap-1 bg-[#ffffff15] p-3">
      <div>Total locked contributions:</div>
      <div><span class="font-semibold text-md"> {{ contributions.amountFinalNoDecimals }}</span> <span class="text-xs top-2 text-gray-suit-500">SIR</span></div>
    </div>
    <div v-if="contributions.amountWithdrawableNoDecimals > 0"
        class="flex flex-col md:flex-row items-center justify-between w-full h-full bg-midGray rounded-lg gap-1 bg-[#ffffff15] p-3">
      <div>Withdrawable balance:</div>
      <div role="button"
           class="withdraw-btn text-xs ring-1 ring-redAccent hover:ring-black-russian-950" @click="withdraw"
      >
        withdraw
        <Timer />
      </div>
      <div><span class="font-semibold text-md"> {{ contributions.amountWithdrawableNoDecimals }}</span> <span class="text-xs top-2 text-gray-suit-500">SIR</span></div>
    </div>
    <div class="flex flex-col md:flex-row items-stretch justify-between w-full h-full bg-midGray rounded-lg gap-1 bg-[#ffffff15] p-3">
      <div>Current token allocation:</div>
      <div><span class="font-semibold text-md"> {{ tokenAllocation }}</span> <span class="text-xs top-2 text-gray-suit-500">SIR</span></div>
    </div>
    <div class="flex flex-col md:flex-row items-stretch justify-between w-full h-full bg-midGray rounded-lg gap-1 bg-[#ffffff15] p-3">
      <div>Number of locked NFTs:</div>
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
