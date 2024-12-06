export const SERVER_CONFIG = {
  PORT: process.env.PORT ? parseInt(process.env.PORT) : 3000,
  // Only use local network settings if explicitly enabled
  IS_LOCAL_NETWORK: process.env.LOCAL_NETWORK === 'true',
  PRODUCTION_URL: 'https://mqtt-hono-context-server-bridge-production.up.railway.app'
} as const;