<script lang="ts" setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useSaleStore } from "@/stores/sale";

const saleStore = useSaleStore();
const startDate = saleStore.contributions.timeLastContribution;
const endDate = startDate +  (1000 * 60 * 60 * 24);
console.log(new Date(endDate).toLocaleDateString());
const timeRemaining = ref(0);

const updateTimer = () => {
  const now = Date.now();
  timeRemaining.value = endDate - now;
};

// Initialize timer on mounted
onMounted(() => {
  updateTimer(); // Initial call
  const interval = setInterval(updateTimer, 1000);

  // Clean up interval on component unmount
  onUnmounted(() => {
    clearInterval(interval);
  });
});

const timer = computed(() => {
  const totalSeconds = Math.floor(timeRemaining.value / 1000);

  const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
  const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
  const seconds = String(totalSeconds % 60).padStart(2, '0');
  console.log( startDate, endDate);
  return new Date(startDate)//`${hours}:${minutes}:${seconds}`;
});
</script>

<template>
  <div>
    <div>
      <label>Time Remaining: {{ timer }}</label>
    </div>
  </div>
</template>