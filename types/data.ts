
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
  lockedButerinCards: LockedNFT;
  lockedMinedJpegs: LockedNFT;
}

declare type SaleState = {
  totalContributions: number;
  timeSaleEnded: number;
}

declare type Token = {
  name: string;
  ticker: string;
  address: string;
  icon: string;
}

export type { TWalletCookie, LockedNFT, Contribution, SaleState, Token}