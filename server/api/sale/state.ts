import type {H3Event} from "h3";
import EthereumClient from "~/web3/EthereumClient";
import { ethereum, sepolia } from "~/web3/chains";

export default defineEventHandler(async (event: H3Event) => {
	const config = useRuntimeConfig(event);
	const {address} = getQuery(event);
	const contract = config.public.env === "production" ? config.public.saleContract : config.public.testnetSaleContract;
	const chain = config.public.env === "production" ? ethereum : sepolia;
	const saleClient = new EthereumClient(contract, config.rpc, chain.id);
	const saleState = await saleClient.contract.state();
	return {
		totalContributionsNoDecimals: saleState[0].toString(),
		timeSaleEnded: saleState[1].toString(),
	};
});
