import EthereumClient from "~/web3/EthereumClient";
import {useEnv} from "~/composables/useEnv";
import abi from "@/assets/abi.json"
import {useWallet} from "~/composables/useWallet";
import {Stablecoin, SaleState} from "~/types/data";


export const useEthClient = () => {
  const env = useEnv()
  const config = useRuntimeConfig().public
  const {contract} = env
  const ethClient = new EthereumClient(contract, config.rpc, env.chain.id, abi)
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

  /**
   * Lock NFTs
   * @param {Array<number>} buterinCardsIds
   * @param {Array<number>} minedJpegsIds
   */
  const lockNfts = async (buterinCardsIds: Array<number>, minedJpegsIds: Array<number>) => {
    const {getSigner} = useWallet()
    const signer = await getSigner()
    try {

      const mutableContract = await ethClient.contract.connect(signer)
      const result = await mutableContract.lockNfts(buterinCardsIds, minedJpegsIds);
      console.log('Direct result:', result);
    } catch (directError) {
      console.error('Direct contract call error:', directError);
    }
  }

  /**
   * Deposits and locks NFTs.
   * @param {number} stablecoin - The stablecoin type as an enum.
   * @param {number} amountNoDecimals - The amount with no decimals.
   * @param {Array<number>} buterinCardIds - The IDs of the Buterin cards.
   * @param {Array<number>} minedJpegIds - The IDs of the mined JPEGs.
   * @returns {Promise<void>} Transaction response.
   */
  async function depositAndLockNfts(stablecoin: Stablecoin, amountNoDecimals: number, buterinCardIds: Array<number>, minedJpegIds: Array<number>) {
    try {
      const {getSigner} = useWallet()
      const {contract} = ethClient
      const signer = await getSigner()
      const mutableContract = contract.connect(signer)
      const tx = await mutableContract.depositAndLockNfts(stablecoin, amountNoDecimals, buterinCardIds, minedJpegIds)

      return tx.hash
    } catch (error) {
      console.error('Transaction failed:', error);
    }
  }


  const maxContributions = async () => {
    return Number(await ethClient.contract.MAX_CONTRIBUTIONS_NO_DECIMALS())
  }

  return {ethClient, state, contributions, maxContributions, lockNfts, depositAndLockNfts}
}