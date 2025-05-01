// server/api/save-wallet.ts

import { createClient } from '@vercel/kv';
import type { H3Event } from 'h3';
import { readBody } from 'h3';
import { useRuntimeConfig } from '#imports';

export default defineEventHandler(async (event: H3Event) => {
  const config = useRuntimeConfig();
  const body = await readBody(event);

  // If no wallet data is provided, initialize it with an empty object
  const wallet: string = body.wallet;
  if(!wallet) return new Response(JSON.stringify({success: false}), {
    status: 400,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const { signature, message} = body;
  const blob: string = JSON.stringify({ signature, message, wallet });
  const users = createClient({
    url: config.kvRestApiUrl,
    token: config.kvRestApiToken,
  });
  try {
    await users.set(`c_sign_${wallet.toLowerCase()}`, blob);
    return {
      statusCode: 200,
      body: { success: true },
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: { error: 'Failed to save wallet data' },
    };
  }
});