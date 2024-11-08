// server/api/save-wallet.ts

import { createClient } from '@vercel/kv';
import type { H3Event } from 'h3';
import { useRuntimeConfig } from '#imports';
import {ethers} from "ethers";

export default defineEventHandler(async (event: H3Event) => {
  const config = useRuntimeConfig();
  const params = getQuery(event)

  const wallet = params.wallet as string;
  console.log("fetching wallet signature... ", wallet)
  // If no wallet data is provided, initialize it with an empty object
  const users = createClient({
    url: config.kvRestApiUrl,
    token: config.kvRestApiToken,
  });
  try {
    const response: IAgreement = await users.get(wallet.toLowerCase()) as IAgreement;
    console.log(response)
    const hasAgreed = verifyWalletSignature(response.wallet, response.signature, response.message)
    return {
      statusCode: 200,
      body: { hasAgreed: hasAgreed },
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: { error: 'Failed to save wallet data' },
    };
  }
});

interface IAgreement {
  signature: string;
  message: string;
  wallet: string;
}

const verifyWalletSignature = (wallet: string, signature: string, message: string): boolean => {
  const messageBytes = ethers.toUtf8Bytes(message)

  const recoveredAddress = ethers.verifyMessage(messageBytes, signature)
  console.log("recovered: ",recoveredAddress.toLowerCase(), wallet)
  return recoveredAddress.toLowerCase() === wallet.toLowerCase()
}