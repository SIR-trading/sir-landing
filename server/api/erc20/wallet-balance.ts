import type { H3Event } from "h3";
import { ethers } from "ethers";
import { ethereum, sepolia } from "~/web3/chains";

export default defineEventHandler(async (event: H3Event) => {
	const config = useRuntimeConfig(event);
	const { tokenAddress, address } = getQuery<{tokenAddress: string, address: string}>(event);

	const chain = config.public.env === "production" ? ethereum : sepolia;

	if(!tokenAddress || !ethers.isAddress(tokenAddress)) {
		throw createError({
			statusCode: 400,
			statusMessage: 'Missing or invalid token address'
		});
	}

	if(!address || !ethers.isAddress(address)) {
		throw createError({
			statusCode: 400,
			statusMessage: 'Missing or invalid address'
		});
	}


	try {
		// Create a direct provider
		const provider = new ethers.JsonRpcProvider(config.rpc);

		// Create a minimal ERC20 interface with just the allowance function
		const minimalAbi = [
			"function balanceOf(address owner) view returns (uint256)"
		];

		// Create the contract instance
		const tokenContract = new ethers.Contract(tokenAddress, minimalAbi, provider);

		// Call allowance directly
		const balance = await tokenContract.balanceOf(address);

		console.log("balance result:", balance.toString());

		return {
			balance: balance.toString()
		};
	} catch (error) {
		console.error("Allowance error details:", {
			tokenAddress,
			ownerAddress: address,
			error: error,
		});

		throw createError({
			statusCode: 500,
			statusMessage: 'Failed to get allowance',
			data: {
				error: 'Failed to get allowance',
				details: {
					message: error,

				}
			}
		});
	}
});