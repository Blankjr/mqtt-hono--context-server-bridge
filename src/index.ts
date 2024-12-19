import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { serveStatic } from '@hono/node-server/serve-static'
import { handleGuideRequest } from './guideService'
import { handleGetPosition, handleUpdatePosition, handlePositionInterface, handleGetGridSquare } from './positionService'
import { handleApiGuide } from './apiGuide'
import { SERVER_CONFIG } from "./utils/config";
import { getLocalIpAddress } from './utils/url'
import { cors } from 'hono/cors'

const app = new Hono()
const port = SERVER_CONFIG.PORT


// CORS middleware
app.use('*', cors({
  origin: (origin) => {
    // Allow any origin in development
    if (SERVER_CONFIG.IS_LOCAL_NETWORK) return origin;

    // In production, allow specific origins
    const allowedOrigins = [
      '*'
    ];

    return allowedOrigins.includes(origin) ? origin : allowedOrigins[0];
  },
  allowMethods: ['GET', 'POST', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Accept'],
  exposeHeaders: ['Content-Length', 'X-Request-Id'],
  maxAge: 600,
  credentials: false,
}))
// Add trailing slash middleware
app.use('*', async (c, next) => {
  const url = new URL(c.req.url)
  if (!url.pathname.endsWith('/') && !url.pathname.includes('.')) {
    url.pathname += '/'
    return c.redirect(url.toString())
  }
  await next()
})

app.get('/health/', async (c) => {
  return c.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: SERVER_CONFIG.IS_LOCAL_NETWORK ? 'development' : 'production'
  })
})

// Root route - API Guide
app.get('/', handleApiGuide)

// Serve static files
app.use('/maps/*', serveStatic({
  root: 'static/',
  onNotFound: (path, c) => {
    console.log(`${path} is not found, you access ${c.req.path}`)
  }
}));

app.use('/waypoints/*', serveStatic({
  root: 'static',
  onNotFound: (path, c) => {
    console.log(`${path} not found when accessing ${c.req.path}. Full path: ${c.req.url}`)
  }
}));

// routes from external files
app.get('/guide/', handleGuideRequest)
app.get('/simulatedPosition/admin/', handlePositionInterface)
app.get('/simulatedPosition/', handleGetPosition)
app.post('/simulatedPosition/', handleUpdatePosition)
app.get('/simulatedPosition/gridSquare/', handleGetGridSquare)

app.onError((err, c) => {
  console.error(`Error handling request to ${c.req.url}:`, err);
  return c.json({
    error: {
      message: 'Internal Server Error',
      status: 500
    }
  }, 500)
})

serve({
  fetch: app.fetch,
  port,
  hostname: '::',  // This enables IPv6 support
})

// Log startup information
if (SERVER_CONFIG.IS_LOCAL_NETWORK) {
  const localIp = getLocalIpAddress()
  console.log('Server is running on:')
  console.log(`- Local: http://localhost:${SERVER_CONFIG.PORT}`)
  console.log(`- Network: http://${localIp}:${SERVER_CONFIG.PORT}`)
  console.log(`- IPv6: http://[::]:${SERVER_CONFIG.PORT}`)
} else {
  console.log(`Server is running on port ${port} with IPv6 support`)
  console.log(`Service should be available at: http://${process.env.RAILWAY_SERVICE_NAME}.railway.internal:${port}`)
}