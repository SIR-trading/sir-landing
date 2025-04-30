import { useEnv } from "~/composables/useEnv";
import abi from "@/assets/abi.json"
import { useWallet } from "~/composables/useWallet";
import { type SaleState } from "~/types/data";
import { type BaseContractMethod, ethers, type JsonRpcSigner } from "ethers";

declare interface PreSaleContract extends ethers.Contract {
	lockNfts: BaseContractMethod<any[], any, any>
	state: BaseContractMethod<any[], any, any>
	contributions: BaseContractMethod<any[], any, any>
	MAX_CONTRIBUTIONS_NO_DECIMALS: BaseContractMethod<any[], any, any>
}

export const usePreSaleClient = () => {
	const env = useEnv()
	const contract = env.preSaleContract;

	const state = async () => {
		const _state = await $fetch<
			{
				totalContributionsNoDecimals: string, timeSaleEnded: string
			}
		>("/api/presale/state");
		return {
			totalContributions: Number(_state.totalContributionsNoDecimals),
			timeSaleEnded: Number(_state.timeSaleEnded)
		} as SaleState
	}

	const contributions = async (contributor: string) => {
		return await $fetch("/api/presale/contributions", {
			params: {
				address: contributor,
			}
		})
	}


	const maxContributions = async () => {
		return Number($fetch(
			"/api/presale/max-contributions",
			{
				method: "GET",
			}))
	}

	const withdrawNfts = async () => {
		const {getSigner} = useWallet()
		const toast = useToast()
		const signer = await getSigner() as JsonRpcSigner
		try {
			const mutableContract = new ethers.Contract(contract, abi, signer) as PreSaleContract;
			const tx = await mutableContract.withdrawNfts();
			toast.add({
				id: "withdraw:erc721",
				timeout: 60000,
				title: "Withdrawing NFTs",
				color: "amber",
			})

			const receipt = await tx.wait();
			toast.update("withdraw:erc721", {
				title: "Withdrawn",
				color: "harlequin",
				timeout: 5000
			})

			const saleStore = useSaleStore();
			await saleStore.fetchWalletContributions(useWallet().address.value as string);
			const {$event} = useNuxtApp();
			$event('sale:update');
			return receipt.transactionHash
		} catch (directError) {
			console.error('Direct contract call error:', directError);
		}
	}

	return {
		state,
		contributions,
		maxContributions,
		withdrawNfts,
	}
}