import { defineStore } from 'pinia';
import {useEthClient} from "@/composables/useEthClient";

export const useFundraiseStore = defineStore('fundraise', {
  state: () => ({
    contributions: {}
  }),
  actions: {
    async fetchWalletContributions(address: string): Promise<void> {
      const eth = useEthClient()
      this.contributions = await eth.contributions(address)
    },
  },
  getters: {
    getWalletContributions: (state) => state.contributions,
  },
});