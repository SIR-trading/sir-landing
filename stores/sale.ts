import {defineStore} from 'pinia';
import {useSaleClient} from '~/composables/useSaleClient';
import type {LockedNFT, Stablecoin, Contribution, SaleState, SelectedItem} from "~/types/data";

// Define the state interface
interface FundraiseState {
  contributions: Contribution;
  saleState: SaleState;
}




const initContributions = (): Contribution => {
  return {
    lockedButerinCards: {
      amount: 0,
      ids: []
    },
    lockedMinedJpegs: {
      amount: 0,
      ids: []
    },
    stablecoin: 0,
    amountFinalNoDecimals: 0,
    amountWithdrawableNoDecimals: 0,
    timeLastContribution: 0
  }
}

export const useSaleStore = defineStore('sale', {
  state: (): FundraiseState => ({
    contributions: initContributions(),
    saleState: {} as SaleState
  }),
  actions: {
    async fetchWalletContributions(address: string): Promise<void> {
        this.contributions = await $fetch<Contribution>(`/api/sale/contributions?address=${address}`);
    },
    async fetchSaleState(): Promise<void> {
      const eth = useSaleClient();
      this.saleState = await eth.state();
    }
  },
  getters: {
    getWalletContributions: (state): Contribution => state.contributions,
    hasSaleEnded: (state): boolean => state.saleState.timeSaleEnded > 0,
    getTotalContributions: (state): number => state.saleState.totalContributions,
  },
});



