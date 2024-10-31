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

const fetchContributions = async () => {
  if (!isConnected.value) return;
  console.log("fetching contributions")
  await saleStore.fetchWalletContributions(address.value);
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
  <div class="flex flex-col flex-grow items-center justify-center md:justify-center h-full w-full bg-midGray rounded-lg gap-1 p-4">
    <div class="flex flex-col md:flex-row items-stretch justify-between w-full h-full  rounded-lg gap-1">
      <div>Total locked contributions:</div>
      <div>{{ contributions.amountFinalNoDecimals }}</div>
    </div>
    <div class="flex flex-col md:flex-row items-stretch justify-between w-full h-full bg-midGray rounded-lg gap-1">
      <div>Withdrawable balance:</div>
      <div>{{ contributions.amountWithdrawableNoDecimals }}</div>
    </div>
    <div class="flex flex-col md:flex-row items-stretch justify-between w-full h-full bg-midGray rounded-lg gap-1">
      <div>Current token allocation:</div>
      <div>{{ tokenAllocation + bonusAllocation }}</div>
    </div>
    <div class="flex flex-col md:flex-row items-stretch justify-between w-full h-full bg-midGray rounded-lg gap-1">
      <div>Number of locked NFTs:</div>
      <div>{{ itemsLocked}}</div>
    </div>
  </div>
</template>

<style scoped></style>
