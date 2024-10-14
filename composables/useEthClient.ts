import EthereumClient from "~/web3/EthereumClient";
import {useEnv} from "~/composables/useEnv";
import abi from "@/assets/abi.json"
import {useWallet} from "~/composables/useWallet";
import {ethers} from "ethers";
import {log} from "node:util";
import type {Contribution, LockedNFT} from "~/types";
import {Stablecoin, SaleState} from "~/types/data";
import {l} from "vite/dist/node/types.d-aGj9QkWt";



export const useEthClient = () => {
  const env = useEnv()
  const config = useRuntimeConfig()
  const {contract } = env
  let rpc = 'http://127.0.0.1:8545';
  // if (import.meta.server) {
  //   console.log('RPC', config.rpc)
  //   rpc = config.rcp
  // }
  const ethClient = new EthereumClient(contract, rpc, env.chain.id, abi)
  const iFace: ethers.Interface = ethClient.contract.interface
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
    console.log("DEPOSIT....")

    try {
      const {getSigner} = useWallet()
      const {contract} = ethClient
      const signer = await getSigner()
      const mutableContract = contract.connect(signer)
      const tx = await mutableContract.depositAndLockNfts(stablecoin, amountNoDecimals, buterinCardIds, minedJpegIds, { gasLimit: 700000})
      // const data = contract.interface.encodeFunctionData("depositAndLockNfts", [
      //   stablecoin, amountNoDecimals, buterinCardIds, minedJpegIds
      // ])

      // const rawTx: ethers.TransactionRequest = {
      //   data: data,
      //   to: await contract.getAddress(),
      //   gasLimit: 100000000,
      //   nonce: await signer?.getNonce(),
      // }
      //
      // const tx = await signer.sendTransaction(rawTx).then(tx => {
      //   console.log('Transaction successful:', tx);
      //   return tx
      // })

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