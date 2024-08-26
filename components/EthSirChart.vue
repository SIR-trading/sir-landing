<template>
  <ClientOnly>
    <div class="w-full flex items-center justify-center">
      <Line v-if="chartData" type="line" :data="chartData" :options="chartOptions"/>
      <div v-else class="flex items-center justify-center">
        <div class="spinner"></div>
      </div>
    </div>
  </ClientOnly>
</template>

<script setup>
import {Line} from 'vue-chartjs';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  LineElement,
  CategoryScale,
  PointElement,
  LinearScale,
} from 'chart.js';
import {ref} from 'vue';

ChartJS.register(
    Title,
    Tooltip,
    Legend,
    BarElement,
    LineElement,
    PointElement,
    CategoryScale,
    LinearScale
);

const loading = ref(true); // Add a loading state
const chartData = ref(null); // Initialize chartData as null
const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: true,
  animation: {
    duration: 1000,
    easing: 'easeInOutQuart'
  },
  scales: {
    x: {
      beginAtZero: true,
    },
    y: {
      beginAtZero: true,
    },
  },
});



import { useChartStore } from '@/stores/chart';

const {loadChartData, getChartData} = useChartStore();

onBeforeMount(async () => {
  await loadChartData().then(
      () => {
        console.log(useChartStore().chartData);
        chartData.value = useChartStore().chartData;
      }
  )
});

onMounted(() => {

})







</script>
