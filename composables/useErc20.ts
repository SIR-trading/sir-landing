import EthereumClient from "~/web3/EthereumClient";
import {useEnv} from "~/composables/useEnv";

import abi from "assets/erc20_abi.json"
import {ethers} from "ethers";
import type {Token} from "~/types";
import tokens from "assets/token_list.json"
export const useErc20 = () => {
  const env = useEnv()
  const config = useRuntimeConfig()
  const {chain, contract} = env
  const {getSigner} = useWallet()
  const fetchBalance = async (token: Token, address: string) => {
    const eth = new EthereumClient(token.address, config.rpc, chain.id, abi)
    console.log("CCCC", token.address)
    try {
      const balance = await eth.contract.balanceOf(address);
      console.log({token: contract, balance: balance})
      return balance
    } catch (error) {
      console.error("Error fetching erc20 token balance:", error);
    }
  }
  const getAllowance = async (token: Token) => {
    const eth = new EthereumClient(token.address, config.rpc, chain.id, abi)
    const signer = await getSigner()
    console.log("get allowance")
    return await eth.contract.allowance(await signer.getAddress(), useEnv().contract)
  }

  const isErc20Approved = async (token: Token, amount: number) => {
    const allowance = await getAllowance(token)
    const formattedAllowance = ethers.formatUnits(allowance.toString(), token.decimals )
    console.log(Number(formattedAllowance), Number(amount))
    return Number(formattedAllowance) >= Number(amount)
  }



  const incrementUSDTAllowance = async (token: Token, amount: number) => {
    try {
      // if (token.ticker !== 'USDT') new Error('USDT specific function')
      const eth = new EthereumClient(token.address, config.rpc, chain.id, abi)
      const mutableContract = await eth.contract.connect(signer)
      const signer = await getSigner()
      const saleContract = useEnv().contract;
      // await  eth.contract.connect(signer).approve(saleContract, 0)
      const tx = await eth.contract.connect(signer).approve(spender, ethers.utils.parseUnits(amount.toString(), token.decimals));

    } catch (error) {

    }
  }
  const approveErc20 = async (token: Token, amount: number) => {
    console.log("TOKEN", token)
    const eth = new EthereumClient(token.address, config.rpc, chain.id, abi)
    try {
      const spender = useEnv().contract
      const signer = await getSigner()
      const approvalTxReq : ethers.TransactionRequest = {
        to: token.address,
        from: await signer.getAddress(),
        data: eth.contract.interface.encodeFunctionData("approve",[spender, amount])
      }
      const estimateGas =  await eth.provider.estimateGas(approvalTxReq)
      console.log("GAS: ", estimateGas)
      const allowance = await getAllowance(token)
      if(amount > ethers.parseUnits(allowance.toString(), token.decimals) && token.ticker === 'USDT' && allowance !== 0n)
        await eth.contract.connect(signer)
          .approve(
            spender,
            0n,
            {
              gasLimit: estimateGas
            },
          )
      const tx = await eth.contract.connect(signer)
        .approve(
          spender,
          ethers.parseUnits(amount.toString(), token.decimals),
          {
            gasLimit: estimateGas
          },
        )
      console.log('Approved ERC20 token transfer successfully')
      return tx.hash
    } catch (error) {
      console.error('Error approving ERC20 token transfer:', error)
    }
  }

  const getTokenInfo = ( ticker: string): Token => {
    return tokens.find(token => token.ticker === ticker)
  }

  return {fetchBalance, approveErc20, isErc20Approved, incrementUSDTAllowance, getAllowance, getTokenInfo}
}