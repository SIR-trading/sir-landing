declare type TWalletCookie = {
  walletAddress: string;
}

enum Stablecoin {
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

export type { TWalletCookie, Stablecoin, LockedNFT, Contribution, SaleState}