import type {H3Event} from "h3";
import EthereumClient from "~/web3/EthereumClient";
import { ethereum, sepolia } from "~/web3/chains";

export default defineEventHandler(async (event: H3Event) => {
	const config = useRuntimeConfig(event);
	const {address} = getQuery(event);
	const contract = "0xb96dB31d8a0637D347A5Cc4d708741c26D672FD4" // config.public.env === "production" ? config.public.saleContract : config.public.testnetSaleContract;
	const chain = config.public.env === "production" ? ethereum : sepolia;

	// ABI for the contributions function
	const contributionsAbi = [
		"function contributions(address contributor) view returns (tuple(address stablecoin, uint256 amountFinalNoDecimals, uint256 amountWithdrawableNoDecimals, uint256 timeLastContribution, address[] lockedNfts))"
	];

	const saleClient = new EthereumClient(contract, config.rpc, chain.id, contributionsAbi);

	try {
		const contributions = await saleClient.contract.contributions(address);
		console.log(contributions);
		return contributions;
	} catch (error) {
		return {
			statusCode: 500,
			body: { error: 'Failed to fetch contributions', message: error },

		}
	}
});