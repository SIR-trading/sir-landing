import { defineStore } from 'pinia';
import { useErc20 } from "~/composables/useErc20";
import { useWallet } from "~/composables/useWallet";
import {useEnv} from "~/composables/useEnv";
import type {Token} from "@/types";
import type {IStatusResponse} from "~/types/server";


declare interface IBalances {
  [key: string]: number | string;
}

declare interface IWalletState {
  balances: IBalances;
  hasAgreed: Ref<boolean>,
  chain: string
}

const initWalletState = (): any => ({
  balances:(useEnv().tokenList.map( (token: Token) => token.name) as Array<string> )
  .reduce((acc, token) => {
    acc[token] = 0;
    return acc;
  }, {} as IBalances),
  hasAgreed: ref(false),
  chain: "",
})


/**
 * Defines a store for managing wallet-related state and actions.
 */
export const useWalletStore = defineStore('wallet', {
  /**
   * Initial state of the store.
   * @returns {{balances: Object, hasAgreed: Ref<boolean>}}
   */
  state: initWalletState,
  actions: {
    /**
     * Fetches token balances for a specified address and updates the store state.
     * @param {string} address - The wallet address to fetch balances for.
     * @returns {Promise<void>}
     */
    async fetchTokenBalances(address: string): Promise<void> {
      const { fetchBalance } = useErc20();
      const {tokenList} = useEnv()
      for (const token of tokenList) {
        const bal = await fetchBalance(token, address);
        this.balances[token.name] = Number(bal?.toString());
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
      const response: IStatusResponse = await $fetch('/api/get-wallet', {params: {wallet: address.value}})
      this.hasAgreed = response.hasAgreed
    }
  },
  getters: {
    /**
     * Getter for retrieving wallet contributions.
     * @param {Object} state - The current state of the store.
     * @returns {Object} - The contributions for the wallet.
     */
    getChainId: (state: IWalletState): string => state.chain,
  },
});