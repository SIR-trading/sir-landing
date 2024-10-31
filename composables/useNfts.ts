import EthereumClient from "~/web3/EthereumClient";
import {useEnv} from "~/composables/useEnv";
import abi from "@/assets/erc721_abi.json"
import {ethers, JsonRpcSigner} from "ethers";

declare interface NftContract extends ethers.Contract {
  tokenOfOwnerByIndex: ethers.BaseContractMethod<any[],any,any>
  balanceOf: ethers.BaseContractMethod<any[],any,any>
  isApprovedForAll: ethers.BaseContractMethod<any[],any,any>
}

export const useNfts = () => {

  const env = useEnv()
  const {chain, contract} = env
  const config = useRuntimeConfig()
  const {buterinCards, minedJpeg, rpc} = config.public

  const _fetchNFTs = async (contract: string, address: string) => {
    const eth = new EthereumClient(contract, rpc, chain.id, abi)
    try {
      const amount = Number(await eth.contract.balanceOf(address));
      let ids = []
      for (let i = 0; i < amount; i++) {
        ids.push(eth.contract.tokenOfOwnerByIndex(address, i));
      }

      return await Promise.all(ids).then((res) => {
        return res.map((id: Awaited<BigInt>) => Number(id));
      });

    } catch (error) {
      console.error("Error fetching token name:", error);
    }
  }
  const fetchWalletButerinCards = async (address: string) => {
    return await _fetchNFTs(buterinCards, address);

  }

  const fetchWalletMinedJpeg = async (address: string) => {
    return await _fetchNFTs(minedJpeg, address);
  }

  const setApprovalForAll = async (nftContract: string) => {
    const {getSigner} = useWallet()
    const signer = await getSigner() as JsonRpcSigner
    const eth = new EthereumClient(nftContract, rpc, chain.id, abi)
    const contract = eth.contract.connect(signer) as NftContract
    await contract.setApprovalForAll(contract, true)
  }

  const isApprovedForAll = async (nftContract: string, owner: string) => {
    const eth = new EthereumClient(nftContract, rpc, chain.id, abi)
    return await eth.contract.isApprovedForAll(owner, contract)
  }

  return {fetchWalletButerinCards, fetchWalletMinedJpeg, setApprovalForAll, isApprovedForAll}
}