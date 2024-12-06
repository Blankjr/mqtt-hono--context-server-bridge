import { networkInterfaces } from 'os';
import { SERVER_CONFIG } from './config';


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
      if (process.env.NODE_ENV === 'development') {
          return `http://${getLocalIpAddress()}:${SERVER_CONFIG.PORT}`;
      }
  
      if (process.env.RAILWAY_PUBLIC_DOMAIN) {
          return `https://${process.env.RAILWAY_PUBLIC_DOMAIN}`;
      }
      
      return SERVER_CONFIG.PRODUCTION_URL;
  }