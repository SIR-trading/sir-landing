import EthereumClient from "~/web3/EthereumClient";
import {useEnv} from "~/composables/useEnv";
import abi from "@/assets/abi.json"



export const useEthClient = () => {
  const env = useEnv()
  const config = useRuntimeConfig()
  const {chain,  contract } = env
  const ethClient = new EthereumClient(contract, config.rpc, 1, abi)

  const state = async () => {
    const _state = await ethClient.contract.state()
    return {
      totalContributions: Number(_state[0]),
      timeSaleEnded: Number(_state[1])
    } as SaleState
  }

  const contributions = async (contributor) => {
    return await ethClient.contract.contributions(contributor)
  }

  const lockNfts = ( buterinCardsIds: Array<number>, minedJpegsIds: Array<number>) => {
    ethClient.contract.lockNfts(buterinCardsIds, minedJpegsIds)
  }

  const maxContributions = async () => {
    return Number(await ethClient.contract.MAX_CONTRIBUTIONS_NO_DECIMALS())
  }

  return {ethClient, state, contributions, maxContributions}
}