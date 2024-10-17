import { defineStore } from 'pinia';
import { useErc20 } from "~/composables/useErc20";
import { useWallet } from "~/composables/useWallet";
import tokens from "@/assets/token_list.json"


/**
 * Defines a store for managing wallet-related state and actions.
 */
export const useWalletStore = defineStore('wallet', {
  /**
   * Initial state of the store.
   * @returns {{balances: Object, hasAgreed: Ref<boolean>}}
   */
  state: () => ({
    balances: {},
    hasAgreed: ref(false),
    chain: ""
  }),
  actions: {
    /**
     * Fetches token balances for a specified address and updates the store state.
     * @param {string} address - The wallet address to fetch balances for.
     * @returns {Promise<void>}
     */
    async fetchTokenBalances(address: string): Promise<void> {
      const { fetchBalance } = useErc20();

      for (const token of tokens) {
        this.balances[token.name] = await fetchBalance(token.address, address);
        console.log(this.balances);
      }
    },

    /**
     * Checks whether the user has agreed to terms and updates the store state.
     * @returns {Promise<void>}
     */
    async checkAgreed(): Promise<void> {
      const { address, isConnected } = useWallet();
      if (!isConnected.value) throw new Error("Wallet not connected");

      const wallet = localStorage.getItem(`wallet-${address.value}`);
      console.log("WALLET_AGG", wallet);
      this.hasAgreed = !!wallet;
      return !!wallet;
    }
  },
  getters: {
    /**
     * Getter for retrieving wallet contributions.
     * @param {Object} state - The current state of the store.
     * @returns {Object} - The contributions for the wallet.
     */
    getWalletContributions: (state) => state.contributions,
    getChainId: (state)  => state.chain
  },
});