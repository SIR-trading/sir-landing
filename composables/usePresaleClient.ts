import EthereumClient from "~/web3/EthereumClient";
import { useEnv } from "~/composables/useEnv";
import abi from "@/assets/abi.json"
import { useWallet } from "~/composables/useWallet";
import { Stablecoin, type  SaleState } from "~/types/data";
import { type BaseContractMethod, ethers, type JsonRpcSigner } from "ethers";

declare interface PreSaleContract extends ethers.Contract {
	lockNfts: BaseContractMethod<any[], any, any>
	state: BaseContractMethod<any[], any, any>
	contributions: BaseContractMethod<any[], any, any>
	MAX_CONTRIBUTIONS_NO_DECIMALS: BaseContractMethod<any[], any, any>
	depositAndLockNfts: BaseContractMethod<any[], any, any>
	withdraw: BaseContractMethod<any[], any, any>
}

``

export const usePreSaleClient = () => {
	const env = useEnv()
	const contract = env.preSaleContract;
	console.log(
		'Contract address:',
		contract,
		'using network:',
		env.chain.id);

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

	/**
	 * Lock NFTs
	 * @param {Array<number>} buterinCardsIds
	 * @param {Array<number>} minedJpegsIds
	 */
	const lockNfts = async (buterinCardsIds: Array<number>, minedJpegsIds: Array<number>) => {
		const {getSigner} = useWallet()
		const toast = useToast()
		const signer = await getSigner() as JsonRpcSigner
		try {

			const mutableContract = new ethers.Contract(contract, abi, signer) as PreSaleContract;
			const tx = await mutableContract.lockNfts(buterinCardsIds, minedJpegsIds);
			toast.add({
				id: "lock:erc721",
				timeout: 60000,
				title: "Depositing",
				color: "amber",
			})
			console.log(
				'Transaction hash:',
				tx.hash,
				'waiting for confirmation...'
			)
			const receipt = await tx.wait();
			toast.update("lock:erc721", {
				title: "Deposited",
				color: "harlequin",
				timeout: 5000
			})
			console.log(
				'Transaction complete! Block number:',
				receipt.blockNumber,
				'Transaction hash:',
				receipt.transactionHash
			)
			console.log('Direct result:', receipt);
		} catch (directError) {
			console.error('Direct contract call error:', directError);
		}
	}

	/**
	 * Deposits and locks NFTs.
	 * @param {number} stablecoin - The stablecoin type as an enum.
	 * @param {number} amountNoDecimals - The amount with no decimals.
	 * @param {Array<number>} buterinCardIds - The IDs of the Buterin cards.
	 * @param {Array<number>} minedJpegIds - The IDs of the mined JPEGs.
	 * @returns {Promise<void>} Transaction response.
	 */
	async function depositAndLockNfts(stablecoin: Stablecoin, amountNoDecimals: number, buterinCardIds: Array<number>, minedJpegIds: Array<number>) {
		try {
			const toast = useToast()

			const {getSigner} = useWallet()
			const signer = await getSigner() as JsonRpcSigner
			const mutableContract = new ethers.Contract(contract, abi, signer) as PreSaleContract;
			const tx = await mutableContract.depositAndLockNfts(stablecoin, amountNoDecimals, buterinCardIds, minedJpegIds)
			toast.add({
				id: "contribute:erc20",
				timeout: 60000,
				title: "Depositing",
				color: "amber",
			})
			const receipt = await tx.wait()
			console.log('Receipt:', receipt);
			const {$event} = useNuxtApp();
			$event('sale:update');
			const saleStore = usePresaleStore();
			await saleStore.fetchWalletContributions(useWallet().address.value as string);
			return receipt.transactionHash;
		} catch (error) {
			console.error('Transaction failed:', error);
		}
	}

	const withdraw = async () => {
		const {getSigner} = useWallet()
		const toast = useToast()
		const signer = await getSigner() as JsonRpcSigner
		try {
			const mutableContract = new ethers.Contract(contract, abi, signer) as PreSaleContract;
			const tx = await mutableContract.withdraw();
			toast.add({
				id: "withdraw:erc20",
				timeout: 60000,
				title: "Withdrawing",
				color: "amber",
			})
			console.log(
				'Transaction hash:',
				tx.hash,
				'waiting for confirmation...'
			)
			const receipt = await tx.wait();
			toast.update("withdraw:erc20", {
				title: "Withdrawn",
				color: "harlequin",
				timeout: 5000
			})
			console.log(
				'Transaction complete! Block number:',
				receipt.blockNumber,
				'Transaction hash:',
				receipt.transactionHash
			)
			const saleStore = useSaleStore();
			await saleStore.fetchWalletContributions(useWallet().address.value as string);
			const {$event} = useNuxtApp();
			$event('sale:update');
			return receipt.transactionHash
		} catch (directError) {
			console.error('Direct contract call error:', directError);
		}
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
			console.log(
				'Transaction hash:',
				tx.hash,
				'waiting for confirmation...'
			)
			const receipt = await tx.wait();
			toast.update("withdraw:erc721", {
				title: "Withdrawn",
				color: "harlequin",
				timeout: 5000
			})
			console.log(
				'Transaction complete! Block number:',
				receipt.blockNumber,
				'Transaction hash:',
				receipt.transactionHash
			)
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
		lockNfts,
		depositAndLockNfts,
		withdraw,
		withdrawNfts,
	}
}