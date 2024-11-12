import { Context } from 'hono'

export function getBaseUrl(): string {
    // Check if we're in development mode
    if (process.env.NODE_ENV === 'development') {
        return 'http://localhost:3000'
    }

    // For production, use RAILWAY_PUBLIC_DOMAIN
    if (process.env.RAILWAY_PUBLIC_DOMAIN) {
        return `https://${process.env.RAILWAY_PUBLIC_DOMAIN}`
    }
    // Fallback if it can't read the env variable
    return 'https://mqtt-hono-context-server-bridge-production.up.railway.app/'
}