<script lang="ts" setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useSaleStore } from "@/stores/sale";

const MS_PER_SECOND = 1000;
const SECONDS_PER_HOUR = 3600;
const SECONDS_PER_MINUTE = 60;
const SECONDS_PER_DAY = SECONDS_PER_HOUR * 24;

const startDate = ref(0)
const endDate = ref(0);
const timeRemaining = ref(0);

const props = defineProps({
  startDate: {
    type: Number,
    required: true
  },
  daysDuration: {
    type: Number,
    required: true
  },
  noDays: {
    type: Boolean,
    default: false
  }
});

const calculateEndDate = (startDate: number, daysDuration: number) => {
  return startDate + (MS_PER_SECOND * SECONDS_PER_DAY * daysDuration);
};

const updateTimer = () => {
  const now = Date.now();
  timeRemaining.value = endDate.value - now;
};

const formatTime = (totalSeconds: number): string => {
  const days = String(Math.floor(totalSeconds / SECONDS_PER_DAY)).padStart(2, '0');
  const remainingSecondsAfterDays = totalSeconds % SECONDS_PER_DAY;
  const hours = String(Math.floor(remainingSecondsAfterDays / SECONDS_PER_HOUR)).padStart(2, '0');
  const minutes = String(Math.floor((remainingSecondsAfterDays % SECONDS_PER_HOUR) / SECONDS_PER_MINUTE)).padStart(2, '0');
  const seconds = String(remainingSecondsAfterDays % SECONDS_PER_MINUTE).padStart(2, '0');
  console.log(days, hours, minutes, seconds);
  return props.noDays ? `${hours}:${minutes}:${seconds}` : `${days}:${hours}:${minutes}:${seconds}`;
};

const initializeTimer = async () => {
  endDate.value = calculateEndDate(props.startDate, props.daysDuration);
  console.log("startDate: ", props.startDate, "endDate: ", endDate.value);
  updateTimer();

  const interval = setInterval(updateTimer, MS_PER_SECOND);

  const { $listen } = useNuxtApp();
  $listen('sale:update', async () => {
    console.log("EVENT: sale:update");
    endDate.value = calculateEndDate(props.startDate, props.daysDuration);
    updateTimer();
    console.log(props.startDate);
  });

  onUnmounted(() => clearInterval(interval));
};

onMounted(initializeTimer);

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