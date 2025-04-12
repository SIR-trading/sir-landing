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

export const usePresaleStore = defineStore('sale', {
  state: (): FundraiseState => ({
    contributions: initContributions() as PresaleContribution,
    selectedItems: [] as SelectedItem[],
    saleState: {} as SaleState
  }),
  actions: {
    async fetchWalletContributions(address: string): Promise<void> {
      try {
        const eth = usePreSaleClient();
        const contributions = await eth.contributions(address);
        this.contributions = formatContribution(contributions);
        console.log("contributions", this.contributions);
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
    getWalletContributions: (state): Contribution => state.contributions,
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

// Format functions
const formatLockedNfts = (locked: any): LockedNFT => {
  return {
    amount: Number(locked[0]),
    ids: locked[1].map((id: string) => Number(id))
  };
};

const formatContribution = (contribution: any): Contribution => {
  return {
    stablecoin: Number(contribution[0]) as Stablecoin,
    amountFinalNoDecimals: Number(contribution[1]),
    amountWithdrawableNoDecimals: Number(contribution[2]),
    timeLastContribution: Number(contribution[3]),
    lockedButerinCards: formatLockedNfts(contribution[4]),
    lockedMinedJpegs: formatLockedNfts(contribution[5])
  };
};