export const SERVER_CONFIG = {
    PORT: process.env.PORT ? parseInt(process.env.PORT) : 3000,
    PRODUCTION_URL: 'https://mqtt-hono-context-server-bridge-production.up.railway.app'
  } as const;