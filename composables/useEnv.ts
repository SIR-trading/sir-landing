import {ethereum, local} from "~/web3/chains";
import {ethers} from "ethers";
import {isChain} from "~/web3/chains";

export const useEnv = () => {
  const config = useRuntimeConfig().public
  const chain = config.env === 'production' ? ethereum : local
  const contract = config.env === 'production' ? config.contract : config.testnetContract
  if (!ethers.isAddress(contract)) throw new Error('Invalid contract address, check the .env file')
  if (!isChain(chain)) throw new Error('Invalid chain object, check the web3/chains.ts file')

  return {
    chain,
    contract
  }
}
