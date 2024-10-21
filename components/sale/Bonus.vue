<script lang="ts" setup>
import { computed } from 'vue';
import { useSaleStore } from "~/stores/sale";

const saleStore = useSaleStore();
const bonus = computed(() => {
  return saleStore.contributions.lockedMinedJpegs.amount + saleStore.contributions.lockedButerinCards.amount;
});

const lockedNFTs = computed(() => {
  const data = saleStore.contributions;
  const mj = data.lockedMinedJpegs.ids.slice(0, data.lockedMinedJpegs.amount).map(id => `MJ-${id}`);
  const bt = data.lockedButerinCards.ids.slice(0, data.lockedButerinCards.amount).map(id => `BT-${id}`);
  return mj.concat(bt);
});

// Assuming the bonus is a value between 0 and 5
const progressBlocks = computed(() => {
  return Math.min(5, Math.max(0, bonus.value)); // Ensure the value is between 0 and 5
});
</script>

<template>
  <div class="flex flex-col gap-2">
    <label class="font-bold">Bonus level reached {{ progressBlocks }} / 5</label>
    <div id="progress-container" class="bg-softGray p-2 rounded-xl flex flex-row gap-3">
      <div v-for="n in 5" :key="n" :class="[n <= progressBlocks ? 'progress-active' : '', 'rounded-lg', 'flex justify-center items-center']">
        <div v-if="n <= progressBlocks" class="text-black font-bold text-xs flex flex-col gap-1 justify-center items-center">
          <span>{{ lockedNFTs[n-1].split('-')[0]}}</span>
          <span>{{ Number(lockedNFTs[n-1].split('-')[1]) + 1}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
#progress-container div {
  width: 50px;
  height: 50px;
  background-color: rgba(255, 255, 255, 0.1);
}

.progress-active {
  background-color: rgba(255, 255, 255, 0.8) !important;
}
</style>