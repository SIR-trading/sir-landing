import EthereumClient from "~/web3/EthereumClient";
import {useEnv} from "~/composables/useEnv";
import abi from "@/assets/erc721_abi.json"
import {string} from "yup";



export const useNfts = () => {
  const env = useEnv()
  const {chain, contract} = env
  const config = useRuntimeConfig()
  const {buterinCards, minedJpeg, rpc} = config.public
  const _fetchNFTs = async (contract: string, address: string) => {
    const eth = new EthereumClient(contract, rpc, chain.id, abi)
    try {
      const amount = Number(await eth.contract.balanceOf(address));
      console.log("Items:", amount);
      let ids = []
      for (let i = 0; i < amount; i++) {
        ids.push(eth.contract.tokenOfOwnerByIndex(address, i));
      }

      return await Promise.all(ids).then((res) => {
        console.log(res)
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
    const signer = await getSigner()
    const eth = new EthereumClient(nftContract, rpc, chain.id, abi)
    console.log("SET_APPROVAL_FOR_ALL", "_-".repeat(100))

    // @ts-ignore
    const tx = await eth.contract.connect(signer).setApprovalForAll(contract, true)
  }

  const isApprovedForAll = async (nftContract: string, owner: string) => {
    const eth = new EthereumClient(nftContract, rpc, chain.id, abi)
    const {address} = useWallet()
    console.log("isApprovedForALl", contract, address.value)
    return await eth.contract.isApprovedForAll(owner, contract)
  }

  return {fetchWalletButerinCards, fetchWalletMinedJpeg, setApprovalForAll, isApprovedForAll}
}