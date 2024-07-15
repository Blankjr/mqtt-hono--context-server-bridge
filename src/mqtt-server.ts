const mqtt = require('mqtt');

// MQTT broker URL
const brokerUrl = 'mqtt://your-broker-url';

// Connect to the broker
const client = mqtt.connect(brokerUrl);

// Topic to publish to
const topic = 'your/topic';

// Payload to send
const payload = {
    "preparedQuery": {
        "relationQuery": "is_in",
        "fromEntities": { "entityQuery": "Person" },
        "toEntities": { "entityQuery": "Room" },
        "conditions": [
            { "attribute": "isTrue", "value": "true", "condition": "=" }
        ]
    }
};

// Convert the payload to a JSON string
const message = JSON.stringify(payload);

// Handle connection event
client.on('connect', () => {
    console.log('Connected to the broker');

    // Publish the message
    client.publish(topic, message, (err: any) => {
        if (err) {
            console.error('Failed to publish message', err);
        } else {
            console.log('Message published successfully');
        }

        // Close the connection
        client.end();
    });
});

// Handle error event
client.on('error', (err: any) => {
    console.error('Connection error:', err);
});