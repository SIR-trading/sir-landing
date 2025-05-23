import {defineStore} from 'pinia';
import type {LockedNFT, Stablecoin, Contribution, SaleState, SelectedItem, PresaleContribution} from "~/types/data";

// Define the state interface
interface FundraiseState {
  contributions: Contribution;
  selectedItems: SelectedItem[];
  saleState: SaleState;
}




const initContributions = (): PresaleContribution => {
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

export const usePresaleStore = defineStore('presale', {
  state: (): FundraiseState => ({
    contributions: initContributions() as PresaleContribution,
    selectedItems: [] as SelectedItem[],
    saleState: {} as SaleState
  }),
  actions: {
    async fetchWalletContributions(address: string): Promise<void> {
      try {
        this.contributions = await $fetch<PresaleContribution>(`/api/presale/contributions?address=${address}`);

      } catch (error) {
        console.error("Failed to fetch wallet contributions:", error);
      }
    },
    async fetchSaleState(): Promise<void> {
      const eth = usePreSaleClient();
      this.saleState = await eth.state();
    }
  },
  getters: {
    getWalletContributions: (state): PresaleContribution => state.contributions as PresaleContribution,
    buterinCardsSelected: (state): string[] => {
      return mapSelectedItems(state.selectedItems, "BT");
    },
    minedJpegsSelected: (state): string[] => {
      return mapSelectedItems(state.selectedItems, "MJ");
    },
    getTotalContributions: (state): number => state.saleState.totalContributions,
    itemsLocked: (state): number => {
      const bc = !!state.contributions.lockedButerinCards ? state.contributions.lockedButerinCards.amount : 0;
      const mj = !!state.contributions.lockedMinedJpegs ? state.contributions.lockedMinedJpegs.amount : 0;
      return bc + mj;
    }
  },
});

// Helper function to map selected items
const mapSelectedItems = (items: SelectedItem[], collectionType: string): string[] => {
  return items
    .filter(item => item.collection === collectionType)
    .map(item => item.id);
};
