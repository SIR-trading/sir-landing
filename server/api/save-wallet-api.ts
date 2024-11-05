// server/api/save-wallet.ts

import { createClient } from '@vercel/kv';
import type { H3Event } from 'h3';
import { readBody } from 'h3';
import { useRuntimeConfig } from '#imports';

export default defineEventHandler(async (event: H3Event) => {
  const config = useRuntimeConfig();
  const body = await readBody(event);

  // If no wallet data is provided, initialize it with an empty object
  const wallet = body.wallet || {};
  const { signature, message} = body;
  const blob = JSON.stringify({ signature, message });
  const users = createClient({
    url: config.USERS_REST_API_URL,
    token: config.USERS_REST_API_TOKEN,
  });

  try {
    await users.hset(wallet, {message: message, signature: signature});
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