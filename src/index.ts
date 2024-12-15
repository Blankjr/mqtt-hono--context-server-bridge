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


// Simplified HTTPS redirect middleware
app.use('*', async (c, next) => {
  if (!SERVER_CONFIG.IS_LOCAL_NETWORK && !c.req.url.includes('https://')) {
    const url = new URL(c.req.url)
    if (url.protocol === 'http:') {
      const httpsUrl = url.toString().replace('http:', 'https:')
      return c.redirect(httpsUrl, 301) // 301 for permanent redirect
    }
  }
  await next()
})

// Add CORS middleware
app.use('*', cors({
  origin: SERVER_CONFIG.IS_LOCAL_NETWORK
    ? '*'
    : 'https://mqtt-hono-context-server-bridge-production.up.railway.app',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  exposeHeaders: ['Content-Length', 'X-Requested-With'],
  maxAge: 86400,
  credentials: true,
}))

// Security headers for production only
app.use('*', async (c, next) => {
  if (!SERVER_CONFIG.IS_LOCAL_NETWORK) {
    c.header('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
  }
  await next()
})

// Add trailing slash middleware
app.use('*', async (c, next) => {
  const url = new URL(c.req.url)
  if (!url.pathname.endsWith('/') && !url.pathname.includes('.')) {
    url.pathname += '/'
    return c.redirect(url.toString())
  }
  await next()
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



if (SERVER_CONFIG.IS_LOCAL_NETWORK) {
  const localIp = getLocalIpAddress()
  console.log(`Server is running on:`)
  console.log(`- Local:   http://localhost:${SERVER_CONFIG.PORT}`)
  console.log(`- Network: http://${localIp}:${SERVER_CONFIG.PORT}`)
} else {
  console.log(`Server is running on port ${SERVER_CONFIG.PORT}`)
}

console.log(`Server is running on port ${port}`)
serve({
  fetch: app.fetch,
  port
})