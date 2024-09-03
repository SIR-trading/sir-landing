  import { defineStore } from 'pinia';

export const useChartStore = defineStore('chart', {
  state: () => ({
    chartData: {},
  }),
  actions: {
    async loadChartData() {
      const rawData  = await import('~/assets/chart_data.json');
      this.chartData = {
        labels: rawData.dates,
        datasets: [
          {
            label: 'ETH',
            backgroundColor: '#2FA0A5',
            borderColor: '#2FA0A5',
            borderWidth: 2,
            pointRadius: 0,
            pointHoverRadius: 0,
            data: rawData.eth_line,
          },
          {
            label: 'SIR',
            backgroundColor: '#00d903',
            borderColor: '#00d903',
            borderWidth: 2,
            pointRadius: 0,
            pointHoverRadius: 0,
            data: rawData.sir_line,
          },
          {
            label: 'Squeeth',
            backgroundColor: '#EB5E1D',
            borderColor: '#EB5E1D',
            borderWidth: 2,
            pointRadius: 0,
            pointHoverRadius: 0,
            data: rawData.squeeth_aligned,
          },
        ],
      }
    },
  },
  getters: {
    getChartData: (state) => state.chartData,
  },
});