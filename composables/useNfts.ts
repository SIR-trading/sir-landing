import EthereumClient from "~/web3/EthereumClient";
import {useEnv} from "~/composables/useEnv";

// Define the ABI
const abi = [
  {
    "constant": true,
    "inputs": [],
    "name": "name",
    "outputs": [
      {
        "name": "",
        "type": "string"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "owner",
        "type": "address"
      }
    ],
    "name": "balanceOf",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "owner",
        "type": "address"
      },
      {
        "name": "index",
        "type": "uint256"
      }
    ],
    "name": "tokenOfOwnerByIndex",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  }
];

const BUTERIN_CARDS_ADDRESS="0x5726C14663A1EaD4A7D320E8A653c9710b2A2E89"
const MINED_JPEG_ADDRESS="0x7cd51FA7E155805C34F333ba493608742A67Da8e"
export const useNfts = () => {
  const env = useEnv()
  const config = useRuntimeConfig()
  const {chain,  contract } = env

  const _fetchNFTs = async (contract: string, address: string) => {
    const eth = new EthereumClient(contract, config.rpc, 1, abi)
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
    return await _fetchNFTs(BUTERIN_CARDS_ADDRESS, address);

  }

  const fetchWalletMinedJpeg = async (address: string) => {
    return await _fetchNFTs(MINED_JPEG_ADDRESS, address);
  }



  return {fetchWalletButerinCards, fetchWalletMinedJpeg}
}