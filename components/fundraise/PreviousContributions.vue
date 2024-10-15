<script lang="ts" setup>
import {ref} from "vue";
import {useFundraiseStore} from "~/stores/fundraise";
import type {Contribution, Token} from "~/types";
import {Stablecoin} from "~/types/data";
import {useErc20} from "~/composables/useErc20";

const fundraiseStore = useFundraiseStore();

const {address, isConnected} = useWallet()
const hasFetchedContributions = ref(false);

const fetchContributions = async () => {
  if (!isConnected.value) return;
  console.log("fetching contributions")
  await fundraiseStore.fetchWalletContributions(address.value);
  hasFetchedContributions.value = true;
  console.log("FETCHED", fundraiseStore.getWalletContributions)
};

// Watch for changes in 'isConnected' to fetch contributions
watch(isConnected, fetchContributions);

const contributions = computed(() => fundraiseStore.contributions as Contribution)

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


</script>

<template>
  <div class="flex flex-col items-center justify-center w-full bg-midGray rounded-lg p-3 gap-2">
    <div class="flex flex-col md:flex-row items-stretch justify-between w-full bg-midGray rounded-lg p-3 gap-2">
      <div>Locked contributions</div>
      <div>{{ contributions.amountFinalNoDecimals }}</div>
    </div>
    <div class="flex flex-col md:flex-row items-center justify-between w-full bg-midGray rounded-lg p-3 gap-2">
      <div>Contributions made within 24h</div>
      <div class="flex flex-inline gap-1">
        {{ contributions.amountWithdrawableNoDecimals }}
        <div class="flex flex-inline gap-1 justify-center items-center">
<!--          <img :src="token.icon" class="w-5 h-5 mr-1"  :alt="token.ticker"/>-->
        </div>
      </div>
      <div class="text-sm">
        <UButton color="gray" @click="fetchContributions">Refresh</UButton>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
