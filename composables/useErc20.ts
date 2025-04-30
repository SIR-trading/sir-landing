import EthereumClient from "~/web3/EthereumClient";
import { useEnv } from "~/composables/useEnv";
import abi from "assets/erc20_abi.json";
import {ethers, JsonRpcSigner, Contract, type BaseContractMethod} from "ethers";
import type { SaleType, Token } from "~/types";

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

    try {
      const res = await $fetch<{balance: string}>("/api/erc20/wallet-balance", {
        params: {
          tokenAddress: token.address,
          address: address,
        }
      })
      console.log("BALANCE______________________", res)
      return BigInt(res.balance);
    } catch (error) {
      console.error("Error fetching erc20 token balance:", error);
    }
  };

  const getAllowance = async (token: Token): Promise<bigint> => {
    const { address } = useWallet();
    // Unwrap the ref to get the raw value
    const walletAddress = toValue(address);

    console.log("useERC20 getAllowance walletAddress: ", walletAddress, " token: ", token);

    try {
      const res = await $fetch<{allowance: string}>(
          `/api/erc20/allowance`,
          {
            params: {
              tokenAddress: token.address,
              address: walletAddress,
            },
            method: "GET",
          });

      return BigInt(res.allowance);
    } catch (error) {
      console.error("Error fetching allowance:", error);
      return BigInt(0);
    }
  };

  const isERC20Approved = async (token: Token, amount: number): Promise<boolean> => {
    const allowance = await getAllowance(token);
    const formattedAllowance = ethers.formatUnits(allowance.toString(), token.decimals);
    console.log(Number(formattedAllowance), Number(amount));
    return Number(formattedAllowance) >= Number(amount) && Number(formattedAllowance) > 0;
  };

  const approveERC20 = async (token: Token, amount: number) => {
    const toast  = useToast();

    try {
      const signer = await getSigner() as JsonRpcSigner;
      const saleContract = env.saleContract;
      const allowance = await getAllowance(token);
      const contract = new Contract(token.address, abi, signer) as ERC20Contract;

      // USDT specific case
      if (token.ticker === 'USDT' && allowance !== BigInt(0)) {
        await contract.approve(saleContract, BigInt(0), {
          nonce: await signer.provider?.getTransactionCount(await signer.getAddress())
        });
      }
      const tx = await contract.approve(saleContract, ethers.parseUnits(amount.toString(), token.decimals))
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

  const getTokenInfo = async (ticker: string): Promise<Token | undefined> => {
    const {tokenList} = await $fetch<{tokenList: Token[]}>(
      "/api/erc20/tokens",
      {
        method: "GET",
      });
    return tokenList.find(token => token.ticker === ticker);
  };

  return { fetchBalance, approveERC20, isERC20Approved, getAllowance, getTokenInfo };
};