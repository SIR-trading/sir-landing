<template>
  <div class="w-full flex items-center justify-center">
    <div v-if="loading">Loading...</div>
    <Line v-else type="line" :data="chartData" :options="chartOptions"/>
  </div>
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

const { data, execute, status, error } = useFetch('api/eth-sir-chart')

execute().then(() => {
  if (data.value && status.value === 'success') {
    chartData.value = {
      labels: data.value.dates,
      datasets: [
        {
          label: 'ETH/USDC',
          backgroundColor: '#2FA0A5',
          borderColor: '#2FA0A5',
          borderWidth: 2,
          pointRadius: 0,
          pointHoverRadius: 0,
          data: data.value.eth_line,
        },
        {
          label: 'SIR',
          backgroundColor: '#F69F36',
          borderColor: '#F69F36',
          borderWidth: 2,
          pointRadius: 0,
          pointHoverRadius: 0,
          data: data.value.sir_line,
        },
        {
          label: 'Squeeth',
          backgroundColor: '#EB5E1D',
          borderColor: '#EB5E1D',
          borderWidth: 2,
          pointRadius: 0,
          pointHoverRadius: 0,
          data: data.value.squeeth_aligned,
        },
      ],
    }
    loading.value = false
  } else if (error.value) {
    console.error(error.value)
  }
})
</script>
