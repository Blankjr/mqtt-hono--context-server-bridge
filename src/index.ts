import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import mqtt from 'mqtt'
import { serveStatic } from '@hono/node-server/serve-static'
import { handleGuideRequest } from './guideService'
import { handleGetPosition, handleUpdatePosition, handlePositionInterface } from './positionService'

const app = new Hono()
const port = 3000

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
//This allows me to access the images in /static/maps/floor0.png with /maps/floor0.png
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

// // MQTT client setup
// const mqttClient = mqtt.connect('mqtt://test.mosquitto.org')
// const topicPrefix = 'hono-bridge/'

// // Define a type for our MQTT message
// interface MqttMessage {
//   message: string
//   requestId: string
// }

// // Define a type for our pending requests
// type PendingRequest = {
//   resolve: (value: Response | PromiseLike<Response>) => void
//   reject: (reason?: any) => void
// }

// // Store for pending requests
// const pendingRequests: { [key: string]: PendingRequest } = {}

// mqttClient.on('connect', () => {
//   console.log('Connected to MQTT broker')
//   mqttClient.subscribe(`${topicPrefix}responses/#`)
// })

// mqttClient.on('message', (topic, message) => {
//   const requestId = topic.split('/').pop()
//   if (requestId && pendingRequests[requestId]) {
//     const { resolve } = pendingRequests[requestId]
//     resolve(new Response(message, { status: 200 }))
//     delete pendingRequests[requestId]
//   }
// })

// app.post('/send-message', async (c) => {
//   const body = await c.req.json()
//   const { topic, message, requestId } = body as MqttMessage & { topic: string }

//   if (!topic || !message || !requestId) {
//     return c.json({ error: 'Missing required fields' }, 400)
//   }

//   return new Promise<Response>((resolve, reject) => {
//     pendingRequests[requestId] = { resolve, reject }

//     mqttClient.publish(`${topicPrefix}${topic}`, JSON.stringify({
//       message,
//       requestId
//     } as MqttMessage))

//     // Set a timeout to avoid hanging requests
//     setTimeout(() => {
//       if (pendingRequests[requestId]) {
//         delete pendingRequests[requestId]
//         resolve(new Response(JSON.stringify({ error: 'Request timeout' }), { status: 504 }))
//       }
//     }, 10000) // 10 seconds timeout
//   })
// })

// // routes from external files
app.get('/guide', handleGuideRequest)
app.get('/simulatedPosition/admin', handlePositionInterface)  // Admin panel UI
app.get('/simulatedPosition/', handleGetPosition)             // For React Native app
app.post('/simulatedPosition/', handleUpdatePosition)         // For position updates

console.log(`Server is running on port ${port}`)
serve({
  fetch: app.fetch,
  port
})