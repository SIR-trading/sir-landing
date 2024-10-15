import EthereumClient from "~/web3/EthereumClient";
import {useEnv} from "~/composables/useEnv";
import abi from "@/assets/erc721_abi.json"


export const useNfts = () => {
  const env = useEnv()
  const {chain,  contract } = env
  const config = useRuntimeConfig()
  const {buterinCards, minedJpeg, rpc} = config.public
  const _fetchNFTs = async (contract: string, address: string) => {
    const eth = new EthereumClient(contract, rpc, chain.id, abi)
    try {
      const amount = Number(await eth.contract.balanceOf(address));
      console.log("Items:", amount);
      let ids = []
      for(let i = 0; i < amount; i++) {
        ids.push(eth.contract.tokenOfOwnerByIndex(address,i));
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

  const setApprovalforAll = async (contract: string) => {
    const {getSigner} = useWallet()
    const operator = useEnv().contract
    const signer = await getSigner()
    const eth = new EthereumClient(contract, rpc, 1, abi)
    const tx = await eth.contract.connect(signer).setApprovalForAll(operator, true)
  }

  return {fetchWalletButerinCards, fetchWalletMinedJpeg, setApprovalforAll}
}