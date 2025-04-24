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
  minedJpeg: string;
  buterinCards: string;
  tokenList: Token[];
}

export const useEnv = () : IEnv => {
  const config = useRuntimeConfig().public

  const chain = config.env === 'production' ? ethereum : (config.env === 'develop' ? sepolia : local);
  const preSaleContract = config.env === 'production' ? config.preSaleContract : config.testnetPresaleContract;
  const saleContract = config.env === 'production' ? config.saleContract : config.testnetSaleContract;
  const tokenList = config.env === 'production' ? tokens : sepoliaTokens;
  const buterinCards = config.env === 'production' ? config.buterinCards : config.testnetButerinCards;
  const minedJpeg = config.env === 'production' ? config.minedJpeg : config.testnetMinedJpeg;

  if (!ethers.isAddress(preSaleContract)) throw new Error('Invalid presale contract address, check the .env file');
  if (!ethers.isAddress(saleContract)) throw new Error('Invalid sale contract address, check the .env file');
  if (!ethers.isAddress(minedJpeg)) throw new Error('Invalid minedJpeg contract address, check the .env file');
  if (!ethers.isAddress(buterinCards)) throw new Error('Invalid buterinCards contract address, check the .env file');
  if (!isChain(chain)) throw new Error('Invalid chain object, check the web3/chains.ts file');

  return {
    chain,
    preSaleContract,
    saleContract,
    minedJpeg,
    buterinCards,
    tokenList
  }
}
