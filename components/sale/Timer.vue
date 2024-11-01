<script lang="ts" setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useSaleStore } from "@/stores/sale";

const MS_PER_SECOND = 1000;
const SECONDS_PER_HOUR = 3600;
const SECONDS_PER_MINUTE = 60;

const saleStore = useSaleStore();
const startDate = ref(0)
const endDate = ref(0);

const timeRemaining = ref(0);

const updateTimer = () => {
  const now = Date.now();
  timeRemaining.value = endDate.value - now;
};

const formatTime = (totalSeconds: number): string => {
  const hours = String(Math.floor(totalSeconds / SECONDS_PER_HOUR)).padStart(2, '0');
  const minutes = String(Math.floor((totalSeconds % SECONDS_PER_HOUR) / SECONDS_PER_MINUTE)).padStart(2, '0');
  const seconds = String(totalSeconds % SECONDS_PER_MINUTE).padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
};

onMounted( async () => {

  await useSaleStore().fetchWalletContributions(useWallet().address.value as string );
  startDate.value = saleStore.contributions.timeLastContribution * MS_PER_SECOND;
  endDate.value = startDate.value + (MS_PER_SECOND * 60 * 60 * 24);
  updateTimer();
  const interval = setInterval(updateTimer, MS_PER_SECOND);

  const {$listen} = useNuxtApp();
  $listen('sale:update', async () => {
    console.log("EVENT: sale:update")
    await useSaleStore().fetchWalletContributions(useWallet().address.value as string );
    startDate.value = saleStore.contributions.timeLastContribution * MS_PER_SECOND;
    endDate.value = startDate.value + (MS_PER_SECOND * 60 * 60 * 24);
    updateTimer();
    console.log(startDate.value)
  })
  onUnmounted(() => clearInterval(interval));
});

const timer = computed(() => {
  const totalSeconds = Math.floor(timeRemaining.value / MS_PER_SECOND);
  return formatTime(totalSeconds);
});
</script>

<template>
  <div>
    <div>
      <label class="text-xs cursor-pointer">{{ timer }}</label>
    </div>
  </div>
</template>