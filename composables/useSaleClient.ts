import EthereumClient from "~/web3/EthereumClient";
import {useEnv} from "~/composables/useEnv";
import abi from "@/assets/abi.json"
import {useWallet} from "~/composables/useWallet";
import {Stablecoin, type  SaleState} from "~/types/data";
import {type BaseContractMethod, ethers, type JsonRpcSigner} from "ethers";

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
  const ethClient = new EthereumClient(contract, config.rpc, env.chain.id, abi)
  const state = async () => {
    const _state = await ethClient.contract.state()
    return {
      totalContributions: Number(_state[0]),
      timeSaleEnded: Number(_state[1])
    } as SaleState
  }

  const contributions = async (contributor: string) => {
    return await (ethClient.contract as SaleContract).contributions(contributor);
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
      const {contract} = ethClient
      const signer = await getSigner() as JsonRpcSigner
      const mutableContract = contract.connect(signer) as SaleContract;
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
    const {getSigner} = useWallet()
    const toast = useToast()
    const signer = await getSigner() as JsonRpcSigner
    try {
      const mutableContract = ethClient.contract.connect(signer) as SaleContract;
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
    return Number(await (ethClient.contract as SaleContract).MAX_CONTRIBUTIONS_NO_DECIMALS())
  }

  const withdrawNfts = async () => {
    const {getSigner} = useWallet()
    const toast = useToast()
    const signer = await getSigner() as JsonRpcSigner
    try {
      const mutableContract = ethClient.contract.connect(signer) as SaleContract;
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
    ethClient,
    state,
    contributions,
    maxContributions,
    deposit,
    withdraw,
    withdrawNfts,
  }
}