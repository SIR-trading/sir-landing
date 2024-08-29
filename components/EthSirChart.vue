<template>
  <ClientOnly>
    <div class="w-full lg:w-[700px] lg:h-[450px] flex items-center justify-center bg-gray-900 lg:p-3 lg:rounded-md">
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
  TimeScale,
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
    LinearScale,
    TimeScale,
);

const chartData = ref(null); // Initialize chartData as null
const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  animation: {
    duration: 1000,
    easing: 'easeInOutQuart'
  },
  scales: {
    x: {
      ticks: {
        // For a category axis, the val is the index so the lookup via getLabelForValue is needed
        callback: function(val, index) {
          // Hide every 2nd tick label
          return index % 4 === 0 ? this.getLabelForValue(val) : '';
        },
      }
    },
    y: {
      ticks: {
        // For a category axis, the val is the index so the lookup via getLabelForValue is needed
        callback: function(val) {
          // Hide every 2nd tick label
          return "$" + this.getLabelForValue(val);
        },
      }
    }
  }
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
