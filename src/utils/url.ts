import { Context } from 'hono'
import { SERVER_CONFIG } from './config'
import { networkInterfaces } from 'os';

export const getLocalIpAddress = () => {
  const nets = networkInterfaces();
  const results = Object.keys(nets).reduce<string[]>((result, ifaceName) => {
    const iface = nets[ifaceName];
    if (!iface) return result;
    
    const validAddresses = iface.filter(net => 
      !net.internal && net.family === 'IPv4'
    ).map(net => net.address);
    
    return [...result, ...validAddresses];
  }, []);

  return results[0] || 'localhost';
};

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
    return SERVER_CONFIG.PRODUCTION_URL
}