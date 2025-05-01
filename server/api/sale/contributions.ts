import type {H3Event} from "h3";
import EthereumClient from "~/web3/EthereumClient";
import { ethereum, sepolia } from "~/web3/chains";
import type { Contribution } from "~/types";
import type { Stablecoin } from "~/types/data";
const formatContribution = (contribution: any): Contribution => {
	return {
		stablecoin: Number(contribution[0]) as Stablecoin,
		amountFinalNoDecimals: Number(contribution[1]),
		amountWithdrawableNoDecimals: Number(contribution[2]),
		timeLastContribution: Number(contribution[3]),
	};
};
export default defineEventHandler(async (event: H3Event) => {
	const config = useRuntimeConfig(event);
	const {address} = getQuery(event);
	const contract = config.public.env === "production" ? config.public.saleContract : config.public.testnetSaleContract;
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
		return formatContribution(await saleClient.contract.contributions(address));
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

