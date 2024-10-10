import EthereumClient from "~/web3/EthereumClient";
import {useEnv} from "~/composables/useEnv";

import abi from "assets/erc20_abi.json"
export const useErc20 = () => {
  const env = useEnv()
  const config = useRuntimeConfig()
  const {chain,  contract } = env

  const fetchBalance = async (contract: string, address: string) => {
    const eth = new EthereumClient(contract, config.rpc, 1, abi)
    try {
      const balance  =Number(await eth.contract.balanceOf(address));
      console.log({token: contract, balance: balance})
      return balance
    } catch (error) {
      console.error("Error fetching erc20 token balance:", error);
    }
  }


  return {fetchBalance}
}