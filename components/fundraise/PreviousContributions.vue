<script lang="ts" setup>
import {ref} from "vue";
import {useFundraiseStore} from "~/stores/fundraise";
import type {Contribution} from "~/types";

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




</script>

<template>
  <div class="flex flex-col items-center justify-center w-full bg-midGray rounded-lg p-3 gap-2">
    <div>
      {{ contributions.amountFinalNoDecimals }}
    </div>
    <div class="flex flex-col md:flex-row items-center justify-around w-full bg-midGray rounded-lg p-3 gap-2">
      <div>Contributions made within 24h</div>
      <div>{{ contributions.amountWithdrawableNoDecimals }}</div>
      <div class="text-sm">
        <UButton color="gray" @click="fetchContributions">Refresh</UButton>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
