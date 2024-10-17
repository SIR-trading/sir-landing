import {defineStore} from 'pinia';
import {useEthClient} from "@/composables/useEthClient";
import tokens from "@/assets/token_list.json"
import {useErc20} from "~/composables/useErc20";

export const useWalletStore = defineStore('wallet', {
  state: () => ({
    balances: {}
  }),
  actions: {
    async fetchTokenBalances(address: string): Promise<void> {
      const {fetchBalance} = useErc20()
      for (const token of tokens) {
        this.balances[token.name] = await fetchBalance(token.address, address)
        console.log(this.balances)
      }
    },

  },
  getters: {
    getWalletContributions: (state) => state.contributions,
  },
});