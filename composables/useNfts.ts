import EthereumClient from "~/web3/EthereumClient";
import {useEnv} from "~/composables/useEnv";
import abi from "@/assets/erc721_abi.json"
import {ethers, JsonRpcSigner} from "ethers";
import { useOnboard } from "@web3-onboard/vue";

declare interface NftContract extends ethers.Contract {
  tokenOfOwnerByIndex: ethers.BaseContractMethod<any[],any,any>
  balanceOf: ethers.BaseContractMethod<any[],any,any>
  isApprovedForAll: ethers.BaseContractMethod<any[],any,any>
}

export const useNfts = () => {

  const env = useEnv()
  const config = useRuntimeConfig()
  const {buterinCards, minedJpeg, rpc} = config.public

  const _fetchNFTs = async (contract: string, address: string): Promise<Array<number> | void>  => {
    const provider = await useWallet().getProvider();
    if(!provider) return;
    console.log(
      'Contract address:',
      contract,
      'using network:',
      env.chain.id,
      'using provider:',
      provider
    )
    const eth = new ethers.Contract(contract, abi, provider as ethers.ContractRunner);
    try {
      const amount = Number(await eth.balanceOf(address));
      let ids = []
      for (let i = 0; i < amount; i++) {
        ids.push(eth.tokenOfOwnerByIndex(address, i));
      }

      return await Promise.all(ids).then((res) => {
        return res.map((id: Awaited<BigInt>) => Number(id));
      });

    } catch (error) {
      console.error("Error fetching items list:", error);
    }
  }
  const fetchWalletButerinCards = async (address: string): Promise<Array<number>|void> => {
    return await _fetchNFTs(buterinCards, address);

  }

  const fetchWalletMinedJpeg = async (address: string): Promise<Array<number>|void> => {
    return await _fetchNFTs(minedJpeg, address);
  }

  const setApprovalForAll = async (nftContract: string) => {
    const toast = useToast()
    const {getSigner} = useWallet()
    const signer = await getSigner() as JsonRpcSigner
    const eth = new ethers.Contract(nftContract, abi, signer) as NftContract
    const tx = await eth.setApprovalForAll(env.preSaleContract, true)
    toast.add({
      id: "approve:erc721",
      title: `Approving ERC721...`,
      color: "amber",
      timeout: 60000
    })
    await tx.wait()
    toast.update("approve:erc721", {
      title: `Approved!`,
      color: "harlequin",
      timeout: 5000
    })
    return tx
  }

  const isApprovedForAll = async (nftContract: string, owner: string) => {
    const provider = await useWallet().getProvider();
    const eth = new ethers.Contract(nftContract, abi, provider as ethers.ContractRunner);
    return await eth.isApprovedForAll(owner, env.preSaleContract)
  }

  return {fetchWalletButerinCards, fetchWalletMinedJpeg, setApprovalForAll, isApprovedForAll}
}