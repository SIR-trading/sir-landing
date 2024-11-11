// server/api/save-wallet.ts
import { createClient, type VercelKV } from '@vercel/kv';
import type { H3Event } from 'h3';
import { useRuntimeConfig } from '#imports';
import { ethers } from "ethers";
import type {IStatusResponse, IErrorResponse} from "~/types/server";

// Extracted function to create KV client
const createKVClient = (config: any): VercelKV => {
  return createClient({
    url: config.kvRestApiUrl,
    token: config.kvRestApiToken,
  });
};



// Extracted function to fetch and verify wallet signature
const fetchAndVerifyWallet = async (wallet: string, client: VercelKV): Promise<IStatusResponse|IErrorResponse> => {
  try {
    const response: IAgreement = await client.get(wallet.toLowerCase()) as IAgreement;
    console.log(response);
    if (!response) {
      console.log("no wallet data found");
      return { hasAgreed: false };
    }
    const hasAgreed = verifyWalletSignature(response.wallet, response.signature, response.message);
    return { hasAgreed };
  } catch (error) {
    return { statusCode: 500, body: { error: 'Failed to fetch wallet data' } };
  }
};

export default defineEventHandler(async (event: H3Event) => {
  const config = useRuntimeConfig();

  // Extract query parameters and standardize wallet string
  const wallet = (getQuery(event).wallet as string).toLowerCase();
  console.log("fetching wallet signature... ", wallet);

  const users = createKVClient(config);
  return await fetchAndVerifyWallet(wallet, users);
});

interface IAgreement {
  signature: string;
  message: string;
  wallet: string;
}

const verifyWalletSignature = (wallet: string, signature: string, message: string): boolean => {
  const messageBytes = ethers.toUtf8Bytes(message);
  const recoveredAddress = ethers.verifyMessage(messageBytes, signature);
  console.log("recovered: ", recoveredAddress.toLowerCase(), wallet);
  return recoveredAddress.toLowerCase() === wallet.toLowerCase();
};