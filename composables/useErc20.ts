import EthereumClient from "~/web3/EthereumClient";
import { useEnv } from "~/composables/useEnv";
import abi from "assets/erc20_abi.json";
import {ethers, JsonRpcSigner, Contract, type BaseContractMethod} from "ethers";
import type { Token } from "~/types";

// Opting for PascalCase for interface names following TypeScript conventions
declare interface ERC20Contract extends Contract {
  approve: BaseContractMethod<any[], any, any>;
  allowance: BaseContractMethod<any[], any, any>;
  balanceOf: BaseContractMethod<any[], any, any>;
}

declare interface ERC20Client extends EthereumClient {
  contract: ERC20Contract;
}

export const useErc20 = () => {
  const env = useEnv();
  const { rpc } = useRuntimeConfig().public;
  const { chain } = env;
  const { getSigner } = useWallet();

  const fetchBalance = async (token: Token, address: string): Promise<bigint | undefined> => {
    const eth = new EthereumClient(token.address, rpc, chain.id, abi) as ERC20Client;
    try {
      return await eth.contract.balanceOf(address);
    } catch (error) {
      console.error("Error fetching erc20 token balance:", error);
    }
  };

  const getAllowance = async (token: Token): Promise<bigint> => {
    const eth = new EthereumClient(token.address, rpc, chain.id, abi) as ERC20Client;
    const signer = await getSigner() as JsonRpcSigner;
    return await eth.contract.allowance(await signer.getAddress(), env.contract);
  };

  const isERC20Approved = async (token: Token, amount: number): Promise<boolean> => {
    const allowance = await getAllowance(token);
    const formattedAllowance = ethers.formatUnits(allowance.toString(), token.decimals);
    console.log(Number(formattedAllowance), Number(amount));
    return Number(formattedAllowance) >= Number(amount) && Number(formattedAllowance) > 0;
  };

  const approveERC20 = async (token: Token, amount: number) => {
    const toast  = useToast();
    const eth = new EthereumClient(token.address, rpc, chain.id, abi) as ERC20Client;
    try {
      const spender = env.contract;
      const signer = await getSigner() as JsonRpcSigner;
      const allowance = await getAllowance(token);

      const contract = (eth.contract).connect(signer) as ERC20Contract;

      // USDT specific case
      if (token.ticker === 'USDT' && allowance !== BigInt(0)) {
        await contract.approve(spender, BigInt(0), {
          nonce: await signer.provider?.getTransactionCount(await signer.getAddress())
        });
      }

      const tx = await contract.approve(spender, ethers.parseUnits("500000", token.decimals))
        toast.add({
          id: "approve:erc20",
          timeout: 30000,
          title: "Approving ERC20 token transfer...",
          color: "amber",
        })
      await tx.wait()
      toast.update("approve:erc20", {
        title: "ERC20 token transfer approved",
        color: "harlequin",
      })


      console.log('Approved ERC20 token transfer successfully');
    } catch (error) {
      console.error('Error approving ERC20 token transfer:', error);
    }
  };

  const getTokenInfo = (ticker: string): Token | undefined => {
    return env.tokenList.find(token => token.ticker === ticker);
  };

  return { fetchBalance, approveERC20, isERC20Approved, getAllowance, getTokenInfo };
};