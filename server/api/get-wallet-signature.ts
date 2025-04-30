// server/api/save-wallet.ts
import { createClient, type VercelKV } from '@vercel/kv';
import type { H3Event } from 'h3';
import { useRuntimeConfig } from '#imports';
import type {IErrorResponse} from "~/types/server";

// Extracted function to create KV client
const createKVClient = (config: any): VercelKV => {
  return createClient({
    url: config.kvRestApiUrl,
    token: config.kvRestApiToken,
  });
};



// Extracted function to fetch and verify wallet signature
const fetchWalletRecord = async (wallet: string, client: VercelKV): Promise<IAgreement|IErrorResponse> => {
  try {
    const response: IAgreement = await client.get(`c_sign_${wallet.toLowerCase()}`) as IAgreement;
    if (!response) {
      console.error("no wallet data found");
      new Error('No wallet data found');
    }

    return response ;
  } catch (error) {
    return { statusCode: 500, body: { error: 'Failed to fetch wallet data' } };
  }
};

export default defineEventHandler(async (event: H3Event) => {
  const config = useRuntimeConfig();

  // Extract query parameters and standardize wallet string
  const wallet = (getQuery(event).wallet as string).toLowerCase();

  const users = createKVClient(config);
  return await fetchWalletRecord(wallet, users);
});

interface IAgreement {
  signature: string;
  message: string;
  wallet: string;
}
