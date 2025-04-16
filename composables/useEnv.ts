import {type Chain, ethereum, local, sepolia} from "~/web3/chains";
import type {Token} from "@/types"
import {ethers} from "ethers";
import {isChain} from "~/web3/chains";
import tokens from "@/assets/token_list.json";
import sepoliaTokens from "@/assets/sepolia_token_list.json";

declare interface IEnv {
  chain: Chain;
  preSaleContract: string;
  saleContract: string;
  tokenList: Token[];
}

export const useEnv = () : IEnv => {
  const config = useRuntimeConfig().public

  const chain = config.env === 'production' ? ethereum : (config.env === 'staging' ? sepolia : local);
  const preSaleContract = config.env === 'production' ? config.preSaleContract : config.testnetPresaleContract;
  const saleContract = config.env === 'production' ? config.saleContract : config.testnetSaleContract;
  const tokenList = config.env === 'staging' ? sepoliaTokens : tokens;
  if (!ethers.isAddress(preSaleContract)) throw new Error('Invalid presale contract address, check the .env file');
  if (!ethers.isAddress(saleContract)) throw new Error('Invalid contract address, check the .env file');
  if (!isChain(chain)) throw new Error('Invalid chain object, check the web3/chains.ts file');
  console.log({chain, preSaleContract, saleContract, tokenList})
  return {
    chain,
    preSaleContract,
    saleContract,
    tokenList
  }
}
