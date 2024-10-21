import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import mqtt from 'mqtt'
import { handleGuideRequest } from './guideService'

const app = new Hono()
const port = 3000

// MQTT client setup
const mqttClient = mqtt.connect('mqtt://test.mosquitto.org')
const topicPrefix = 'hono-bridge/'

// Define a type for our MQTT message
interface MqttMessage {
  message: string
  requestId: string
}

// Define a type for our pending requests
type PendingRequest = {
  resolve: (value: Response | PromiseLike<Response>) => void
  reject: (reason?: any) => void
}

// Store for pending requests
const pendingRequests: { [key: string]: PendingRequest } = {}

mqttClient.on('connect', () => {
  console.log('Connected to MQTT broker')
  mqttClient.subscribe(`${topicPrefix}responses/#`)
})

mqttClient.on('message', (topic, message) => {
  const requestId = topic.split('/').pop()
  if (requestId && pendingRequests[requestId]) {
    const { resolve } = pendingRequests[requestId]
    resolve(new Response(message, { status: 200 }))
    delete pendingRequests[requestId]
  }
})

app.post('/send-message', async (c) => {
  const body = await c.req.json()
  const { topic, message, requestId } = body as MqttMessage & { topic: string }

  if (!topic || !message || !requestId) {
    return c.json({ error: 'Missing required fields' }, 400)
  }

  return new Promise<Response>((resolve, reject) => {
    pendingRequests[requestId] = { resolve, reject }

    mqttClient.publish(`${topicPrefix}${topic}`, JSON.stringify({
      message,
      requestId
    } as MqttMessage))

    // Set a timeout to avoid hanging requests
    setTimeout(() => {
      if (pendingRequests[requestId]) {
        delete pendingRequests[requestId]
        resolve(new Response(JSON.stringify({ error: 'Request timeout' }), { status: 504 }))
      }
    }, 10000) // 10 seconds timeout
  })
})

// Add the guide route
app.get('/guide', handleGuideRequest)

console.log(`Server is running on port ${port}`)
serve({
  fetch: app.fetch,
  port
})