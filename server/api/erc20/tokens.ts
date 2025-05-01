import type { H3Event } from "h3";
import tokenList from "@/assets/token_list.json"
import sepoliaTokenList from "@/assets/sepolia_token_list.json"

export default defineEventHandler(async (event: H3Event) => {
	const config = useRuntimeConfig(event);
	return {
		tokenList: config.public.env === "production" ? tokenList : sepoliaTokenList
	}
});