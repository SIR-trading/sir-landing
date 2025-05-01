
declare type TWalletCookie = {
  walletAddress: string;
}

export enum Stablecoin {
  USDT,
  USDC,
  DAI
}

declare type LockedNFT = {
  amount:  number;
  ids: Array<number>;
}



interface Contribution {
  stablecoin: Stablecoin;
  amountFinalNoDecimals: number;
  amountWithdrawableNoDecimals: number;
  timeLastContribution: number;
  lockedButerinCards?: LockedNFT;
  lockedMinedJpegs?: LockedNFT;
}
interface PresaleContribution {
  lockedButerinCards: LockedNFT;
  lockedMinedJpegs: LockedNFT;
  stablecoin: Stablecoin;
  amountFinalNoDecimals: number;
  amountWithdrawableNoDecimals: number;
  timeLastContribution: number;
}

declare type SaleState = {
  totalContributions: number;
  timeSaleEnded: number;
}

export type SelectedItem = {
  collection: string;
  id: string;
}

declare type Token = {
  name: string;
  ticker: string;
  address: string;
  icon: string;
  decimals: number;
}

export type { TWalletCookie, LockedNFT, Contribution, SaleState, Token, PresaleContribution }