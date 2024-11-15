import {type Chain, ethereum, local, sepolia} from "~/web3/chains";
import type {Token} from "@/types"
import {ethers} from "ethers";
import {isChain} from "~/web3/chains";
import tokens from "@/assets/token_list.json";
import sepoliaTokens from "@/assets/sepolia_token_list.json";

declare interface IEnv {
  chain: Chain;
  contract: string;
  tokenList: Token[];
}

export const useEnv = () : IEnv => {
  const config = useRuntimeConfig().public

  const chain = config.env === 'production' ? ethereum : (config.env === 'staging' ? sepolia : local);
  const contract = config.env === 'production' ? config.contract : config.testnetContract;
  const tokenList = config.env === 'staging' ? sepoliaTokens : tokens;
  // if (!ethers.isAddress(contract)) throw new Error('Invalid contract address, check the .env file');
  if (!isChain(chain)) throw new Error('Invalid chain object, check the web3/chains.ts file');

  return {
    chain,
    contract,
    tokenList
  }
}
