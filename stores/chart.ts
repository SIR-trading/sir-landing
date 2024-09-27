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
            backgroundColor: '#d7589d',
            borderColor: '#d7589d',
            borderWidth: 2,
            pointRadius: 0,
            pointHoverRadius: 0,
            data: rawData.eth_line,
          },
          {
            label: 'SIR',
            backgroundColor: '#dea55b',
            borderColor: '#dea55b',
            borderWidth: 2,
            pointRadius: 0,
            pointHoverRadius: 0,
            data: rawData.sir_line,
          },
          {
            label: 'Squeeth',
            backgroundColor: '#659ba0',
            borderColor: '#659ba0',
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