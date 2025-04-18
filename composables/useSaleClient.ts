import EthereumClient from "~/web3/EthereumClient";
import {useEnv} from "~/composables/useEnv";
import abi from "@/assets/abi.json"
import {useWallet} from "~/composables/useWallet";
import {Stablecoin, type  SaleState} from "~/types/data";
import { type BaseContractMethod, Contract, ethers, type JsonRpcSigner } from "ethers";

declare interface SaleContract extends ethers.Contract {
  lockNfts: BaseContractMethod<any[], any, any>
  state: BaseContractMethod<any[], any, any>
  contributions: BaseContractMethod<any[], any, any>
  MAX_CONTRIBUTIONS_NO_DECIMALS: BaseContractMethod<any[], any, any>
  deposit: BaseContractMethod<any[], any, any>
  withdraw: BaseContractMethod<any[], any, any>
}


export const useSaleClient = () => {
  const env = useEnv()
  const config = useRuntimeConfig().public
  const contract = env.saleContract;
  console.log(
    'Contract address:',
    contract,
    'using network:',
    env.chain.id)

  const state = async () => {
    const _state = await $fetch<{totalContributionsNoDecimals: string, timeSaleEnded: string}>("/api/sale/state");
    return {
      totalContributions: Number(_state.totalContributionsNoDecimals),
      timeSaleEnded: Number(_state.timeSaleEnded)
    } as SaleState
  }

  const contributions = async (contributor: string) => {
    return await $fetch("/api/sale/contributions", {
      params: {
        address: contributor,
      }
    })
  }



  /**
   * Deposits and locks NFTs.
   * @param {number} stablecoin - The stablecoin type as an enum.
   * @param {number} amountNoDecimals - The amount with no decimals.
   * @returns {Promise<void>} Transaction response.
   */
  async function deposit(stablecoin: Stablecoin, amountNoDecimals: number): Promise<any> {
    try {
      const toast = useToast()
      const {getSigner} = useWallet()
      const signer = await getSigner() as JsonRpcSigner
      const mutableContract = new Contract(env.saleContract, abi, signer) as SaleContract;
      const tx = await mutableContract.deposit(stablecoin, amountNoDecimals)
      toast.add({
        id: "contribute:erc20",
        timeout: 60000,
        title: "Depositing",
        color: "amber",
      })
      const receipt = await tx.wait()
      console.log('Receipt:', receipt);
      const {$event} = useNuxtApp();
      $event('sale:update');
      const saleStore = useSaleStore();
      await saleStore.fetchWalletContributions(useWallet().address.value as string);
      return receipt.transactionHash;
    } catch (error) {
      console.error('Transaction failed:', error);
    }
  }

  const withdraw = async () => {

    const toast = useToast()

    try {
      const {getSigner} = useWallet()
      const signer = await getSigner() as JsonRpcSigner
      const mutableContract = new Contract(env.saleContract, abi, signer) as SaleContract;
      const tx = await mutableContract.withdraw();
      toast.add({
        id: "withdraw:erc20",
        timeout: 60000,
        title: "Withdrawing",
        color: "amber",
      })
      console.log(
        'Transaction hash:',
        tx.hash,
        'waiting for confirmation...'
      )
      const receipt = await tx.wait();
      toast.update("withdraw:erc20",{
        title: "Withdrawn",
        color: "harlequin",
        timeout: 5000
      })
      console.log(
        'Transaction complete! Block number:',
        receipt.blockNumber,
        'Transaction hash:',
        receipt.transactionHash
      )
       const saleStore = useSaleStore();
       await saleStore.fetchWalletContributions(useWallet().address.value as string);
      const {$event} = useNuxtApp();
      $event('sale:update');
       return receipt.transactionHash
    } catch (directError) {
      console.error('Direct contract call error:', directError);
    }
  }
  const maxContributions = async () => {
    const {getSigner} = useWallet()
    const signer = await getSigner() as JsonRpcSigner
    const mutableContract = new Contract(env.saleContract, abi, signer) as SaleContract;
    return Number($fetch(
      "/api/sale/max-contributions",
      {
        method: "GET",
      }))
  }

  const withdrawNfts = async () => {
    const toast = useToast();
    const {getSigner} = useWallet()
    const signer = await getSigner() as JsonRpcSigner
    const mutableContract = new Contract(env.saleContract, abi, signer) as SaleContract;
    try {
      const tx = await mutableContract.withdrawNfts();
      toast.add({
        id: "withdraw:erc721",
        timeout: 60000,
        title: "Withdrawing NFTs",
        color: "amber",
      })
      console.log(
        'Transaction hash:',
        tx.hash,
        'waiting for confirmation...'
      )
      const receipt = await tx.wait();
      toast.update("withdraw:erc721",{
        title: "Withdrawn",
        color: "harlequin",
        timeout: 5000
      })
      console.log(
        'Transaction complete! Block number:',
        receipt.blockNumber,
        'Transaction hash:',
        receipt.transactionHash
      )
      const saleStore = useSaleStore();
      await saleStore.fetchWalletContributions(useWallet().address.value as string);
      const {$event} = useNuxtApp();
      $event('sale:update');
      return receipt.transactionHash
    } catch (directError) {
      console.error('Direct contract call error:', directError);
    }
  }

  return {
    state,
    contributions,
    maxContributions,
    deposit,
    withdraw,
    withdrawNfts,
  }
}