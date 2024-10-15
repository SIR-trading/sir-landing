import {defineStore} from 'pinia';
import {useEthClient} from '@/composables/useEthClient';
import {type LockedNFT, Stablecoin, Contribution} from "~/types/data";



// Define the state interface
interface FundraiseState {
  contributions: Contribution;
  selectedItems: Array<{collection: string, id: string}>;
}

export const useSaleStore = defineStore<'sale', FundraiseState>({
  id: 'sale',
  state: () => ({
    contributions: {} as Contribution,
    selectedItems: []
  }),
  actions: {
    async fetchWalletContributions(address: string): Promise<void> {
      try {
        const eth = useEthClient();
        const c = await eth.contributions(address)
        console.log('from eth', c)
        this.contributions = formatContribution(c);
        console.log("__c:::::", this.contributions);
      } catch (error) {
        console.error("Failed to fetch wallet contributions:", error);
      }
    },
  },
  getters: {
    getWalletContributions: (state) => {
      return state.contributions
    },
    timer: (state) => {
      return new Date(state.contributions.timeLastContribution)
    },
    buterinCardsSelected: (state) => {
      return state.selectedItems.map((item) => item.collection === "BT" ? item.id : null).filter(id => id !== null);
    },
    minedJpegsSelected: (state) => {
      return state.selectedItems.map((item) => item.collection === "MJ" ? item.id : null).filter(id => id !== null);
    }
  },
});



const formatLockedNfts = (l: any) => {
  return {
    amount: Number(l[0]),
    ids: l[1].map( id => Number(id))
  } as LockedNFT
}

const formatContribution = (c: any) => {
  return {
    stablecoin: Number(c[0]) as Stablecoin,
    amountFinalNoDecimals: Number(c[1]),
    amountWithdrawableNoDecimals: Number(c[2]),
    timeLastContribution: Number(c[3]),
    lockedButerinCards: formatLockedNfts(c[4]) as LockedNFT,
    lockedMinedJpegs: formatLockedNfts(c[5]) as LockedNFT
  } as Contribution
}