import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { serveStatic } from '@hono/node-server/serve-static'
import { handleGuideRequest } from './guideService'
import { handleGetPosition, handleUpdatePosition, handlePositionInterface, handleGetGridSquare } from './positionService'
import { handleApiGuide } from './apiGuide'
import { SERVER_CONFIG } from './utils/config'
import { getLocalIpAddress } from './utils/url'

const app = new Hono()

// Root route - API Guide
app.get('/', handleApiGuide)

// Add trailing slash middleware
app.use('*', async (c, next) => {
  const url = new URL(c.req.url)
  if (!url.pathname.endsWith('/') && !url.pathname.includes('.')) {
    url.pathname += '/'
    return c.redirect(url.toString())
  }
  await next()
})

// Serve static files
app.use('/maps/*', serveStatic({
  root: 'static/',
  onNotFound: (path, c) => {
    console.log(`${path} is not found, you access ${c.req.path}`)
  }
}));

app.use('/sample-waypoints/*', serveStatic({
  root: 'static',
  onNotFound: (path, c) => {
    console.log(`${path} not found when accessing ${c.req.path}`)
  }
}));

// routes from external files
app.get('/guide/', handleGuideRequest)
app.get('/simulatedPosition/admin/', handlePositionInterface)
app.get('/simulatedPosition/', handleGetPosition)
app.post('/simulatedPosition/', handleUpdatePosition)
app.get('/simulatedPosition/gridSquare/', handleGetGridSquare)

const localIp = getLocalIpAddress()
console.log(`Server is running on:`)
console.log(`- Local:   http://localhost:${SERVER_CONFIG.PORT}`)
console.log(`- Network: http://${localIp}:${SERVER_CONFIG.PORT}`)

serve({
  fetch: app.fetch,
  port: SERVER_CONFIG.PORT,
})