export const SERVER_CONFIG = {
    PORT: 3000,
//     HOST: process.env.NODE_ENV === 'production' ? undefined : '0.0.0.0',
    IS_LOCAL_NETWORK: process.env.NODE_ENV === 'development',
    PRODUCTION_URL: 'https://mqtt-hono-context-server-bridge-production.up.railway.app'
  } as const;