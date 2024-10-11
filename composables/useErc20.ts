import EthereumClient from "~/web3/EthereumClient";
import {useEnv} from "~/composables/useEnv";

import abi from "assets/erc20_abi.json"
import {ethers} from "ethers";
export const useErc20 = () => {
  const env = useEnv()
  const config = useRuntimeConfig()
  const {chain,  contract } = env
  const {getSigner} = useWallet()
  const fetchBalance = async (contract: string, address: string) => {
    const eth = new EthereumClient(contract, config.rpc, chain.id, abi)
    try {
      const balance  =Number(await eth.contract.balanceOf(address));
      console.log({token: contract, balance: balance})
      return balance
    } catch (error) {
      console.error("Error fetching erc20 token balance:", error);
    }
  }

  const isErc20Approved = async (contract: string, amount: number) => {
    if (!ethers.isAddress(contract)) throw new Error('Invalid contract address, check the .env file')
    const eth = new EthereumClient(contract, config.rpc, chain.id, abi)
    const signer = await getSigner()
    const allowance = await eth.contract.allowance(await signer.getAddress(), contract)
    console.log(Number(allowance), Number(amount))
    return Number(allowance) >= Number(amount)
  }

  const approveErc20 = async (contract: string, amount: number) => {
    const eth = new EthereumClient(contract, config.rpc, 1, abi)
    try {
      const spender = env.contract
      const tx = await eth.contract.connect(await getSigner()).approve(spender, ethers.parseUnits(amount.toString(), 18), {gasLimit: 100000000})
      await tx.wait()
      console.log('Approved ERC20 token transfer successfully')
    } catch (error) {
      console.error('Error approving ERC20 token transfer:', error)
    }

  }

  return {fetchBalance, approveErc20, isErc20Approved}
}