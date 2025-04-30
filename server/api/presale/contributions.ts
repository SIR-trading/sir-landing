import type {H3Event} from "h3";
import EthereumClient from "~/web3/EthereumClient";
import { ethereum, sepolia } from "~/web3/chains";
import type { PresaleContribution, LockedNFT } from "~/types";
import type { Stablecoin } from "~/types/data";

// Format functions
const formatLockedNfts = (locked: any): LockedNFT => {
	return {
		amount: Number(locked[0]),
		ids: locked[1].map((id: string) => Number(id))
	};
};

const formatContribution = (contribution: any): PresaleContribution => {
	return {
		stablecoin: Number(contribution[0]) as Stablecoin,
		amountFinalNoDecimals: Number(contribution[1]),
		amountWithdrawableNoDecimals: Number(contribution[2]),
		timeLastContribution: Number(contribution[3]),
		lockedButerinCards: formatLockedNfts(contribution[4]) ?? { amount: 0, ids: []},
		lockedMinedJpegs: formatLockedNfts(contribution[5] ?? { amount: 0, ids: []})
	};
};


export default defineEventHandler(async (event: H3Event) => {
	const config = useRuntimeConfig(event);
	const {address} = getQuery(event);
	const contract = config.public.env === "production" ? config.public.preSaleContract : config.public.testnetPresaleContract;
	const chain = config.public.env === "production" ? ethereum : sepolia;

	// ABI with the exact matching struct definition
	const contributionsAbi = [
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "contributor",
					"type": "address"
				}
			],
			"name": "contributions",
			"outputs": [
				{
					"components": [
						{
							"internalType": "enum Stablecoin",
							"name": "stablecoin",
							"type": "uint8"  // Enums are represented as uint8 in ABI
						},
						{
							"internalType": "uint24",
							"name": "amountFinalNoDecimals",
							"type": "uint24"
						},
						{
							"internalType": "uint24",
							"name": "amountWithdrawableNoDecimals",
							"type": "uint24"
						},
						{
							"internalType": "uint40",
							"name": "timeLastContribution",
							"type": "uint40"
						},
						{
							"name": "lockedButerinCards",
							"type": "tuple",
							"internalType": "struct SaleStructs.LockedButerinCards",
							"components": [
								{
									"name": "number",
									"type": "uint8",
									"internalType": "uint8"
								},
								{
									"name": "ids",
									"type": "uint16[5]",
									"internalType": "uint16[5]"
								}
							]
						},
						{
							"name": "lockedMinedJpegs",
							"type": "tuple",
							"internalType": "struct SaleStructs.LockedMinedJpegs",
							"components": [
								{
									"name": "number",
									"type": "uint8",
									"internalType": "uint8"
								},
								{
									"name": "ids",
									"type": "uint8[5]",
									"internalType": "uint8[5]"
								}
							]
						}
					],
					"internalType": "struct Contribution",
					"name": "",
					"type": "tuple"
				}
			],
			"stateMutability": "view",
			"type": "function"
		}
	];

	try {
		const saleClient = new EthereumClient(contract, config.rpc, chain.id, contributionsAbi);
		const contribution = formatContribution(await saleClient.contract.contributions(address));
		return contribution;
	} catch (error) {
		console.error("Error details:", error);
		throw createError({
			statusCode: 500,
			statusMessage: 'Failed to fetch contributions',
			data: {
				error: "Failed to fetch contributions",
				message: error
			}
		});
	}
});

