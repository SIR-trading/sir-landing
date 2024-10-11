import EthereumClient from "~/web3/EthereumClient";
import {useEnv} from "~/composables/useEnv";
import abi from "@/assets/abi.json"
import {useWallet} from "~/composables/useWallet";



export const useEthClient = () => {
  const env = useEnv()
  const config = useRuntimeConfig()
  const {contract } = env
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
      const tx = await mutableContract.depositAndLockNfts(0, 1000, [], [], {gasLimit: 300000})
      console.log('Transaction successful:', tx);
    } catch (error) {
      console.error('Transaction failed:', error);
    }
  }


  const maxContributions = async () => {
    return Number(await ethClient.contract.MAX_CONTRIBUTIONS_NO_DECIMALS())
  }

  return {ethClient, state, contributions, maxContributions, lockNfts, depositAndLockNfts}
}