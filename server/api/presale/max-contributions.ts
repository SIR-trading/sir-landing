import type { H3Event } from "h3";
import EthereumClient from "~/web3/EthereumClient";
import { ethereum, sepolia } from "~/web3/chains";

export default defineEventHandler(async (event: H3Event) => {
	const config = useRuntimeConfig(event);
	const contract = config.public.env === "production" ? config.public.preSaleContract : config.public.testnetPresaleContract;
	const chain = config.public.env === "production" ? ethereum : sepolia;
	const saleClient = new EthereumClient(contract, config.rpc, chain.id);
	try {
		const maxContributions = await saleClient.contract.MAX_CONTRIBUTIONS_NO_DECIMALS();
		return {maxContributions: maxContributions.toString()}
	} catch (error) {
		return {
			statusCode: 500,
			body: { error: 'Failed to fetch max contributions', message: error },
		}
	}

});
