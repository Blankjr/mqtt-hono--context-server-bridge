import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import mqtt from 'mqtt'
import { serveStatic } from '@hono/node-server/serve-static'
import { handleGuideRequest } from './guideService'
import { handleGetPosition, handleUpdatePosition, handlePositionInterface, handleGetGridSquare } from './positionService'
import { handleApiGuide } from './apiGuide'

const app = new Hono()
const port = 3000

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
// This allows me to access the images in /static/maps/floor0.png with /maps/floor0.png
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
app.get('/simulatedPosition/admin/', handlePositionInterface)  // Admin panel UI
app.get('/simulatedPosition/', handleGetPosition)             // For React Native app
app.post('/simulatedPosition/', handleUpdatePosition)         // For position updates
app.get('/simulatedPosition/gridSquare/', handleGetGridSquare) // get calculated closes grid square of position

console.log(`Server is running on port ${port}`)
serve({
  fetch: app.fetch,
  port
})