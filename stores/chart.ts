import { defineStore } from 'pinia';

export const useChartStore = defineStore('chart', {
  state: () => ({
    chartData: null,
  }),
  actions: {
    async loadChartData() {
      const rawData  = await import('~/assets/chart_data.json');
      this.chartData = {
        labels: rawData.dates,
        datasets: [
          {
            label: 'ETH/USDC',
            backgroundColor: '#2FA0A5',
            borderColor: '#2FA0A5',
            borderWidth: 2,
            pointRadius: 0,
            pointHoverRadius: 0,
            data: rawData.eth_line,
          },
          {
            label: 'SIR',
            backgroundColor: '#F69F36',
            borderColor: '#F69F36',
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