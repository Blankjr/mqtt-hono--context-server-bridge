import { Context } from 'hono'

export function handleApiGuide(c: Context) {
    return c.html(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>API Guide - Indoor Navigation Backend</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: system-ui, -apple-system, sans-serif;
            line-height: 1.6;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background: #f5f5f5;
          }
          .container {
            background: white;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          h1 {
            color: #2563eb;
            margin-top: 0;
          }
          .endpoint {
            margin: 20px 0;
            padding: 20px;
            background: #f8fafc;
            border-radius: 6px;
            border: 1px solid #e2e8f0;
          }
          .endpoint h3 {
            margin: 0 0 10px 0;
            color: #1e40af;
          }
          .method {
            display: inline-block;
            padding: 3px 8px;
            border-radius: 4px;
            font-size: 14px;
            font-weight: bold;
            margin-right: 8px;
          }
          .get {
            background: #dcfce7;
            color: #166534;
          }
          .post {
            background: #dbeafe;
            color: #1e40af;
          }
          .url {
            font-family: monospace;
            background: #f1f5f9;
            padding: 2px 6px;
            border-radius: 4px;
          }
          .description {
            margin-top: 8px;
            color: #4b5563;
          }
          .try-it {
            margin-top: 10px;
          }
          .try-it a {
            color: #2563eb;
            text-decoration: none;
          }
          .try-it a:hover {
            text-decoration: underline;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Indoor Navigation API Guide</h1>
          <p>Welcome to the Indoor Navigation Backend API. This service provides endpoints for position simulation and navigation guidance.</p>
          
          <div class="endpoint">
            <h3>
              <span class="method get">GET</span>
              <span class="url">/guide</span>
            </h3>
            <div class="description">
              Request navigation guidance between two points. Provides step-by-step navigation with visual or tactile waypoints.
            </div>
            <div class="try-it">
              <a href="/guide?start_floor=2&start_room=101&destination_floor=2&destination_room=201&mode=visual">Try it →</a>
            </div>
          </div>

          <div class="endpoint">
            <h3>
              <span class="method get">GET</span>
              <span class="url">/simulatedPosition/admin</span>
            </h3>
            <div class="description">
              Admin interface for simulating user positions on the floor plans. Allows clicking on maps to set positions.
            </div>
            <div class="try-it">
              <a href="/simulatedPosition/admin">Open Admin Interface →</a>
            </div>
          </div>

          <div class="endpoint">
            <h3>
              <span class="method get">GET</span>
              <span class="url">/simulatedPosition</span>
            </h3>
            <div class="description">
              Get the current simulated position. Returns x, y coordinates and floor number.
            </div>
            <div class="try-it">
              <a href="/simulatedPosition">View Current Position →</a>
            </div>
          </div>

          <div class="endpoint">
            <h3>
              <span class="method post">POST</span>
              <span class="url">/simulatedPosition</span>
            </h3>
            <div class="description">
              Update the simulated position. Requires JSON body with x, y coordinates and floor number.
            </div>
            <div class="try-it">
              Example body: <code>{"x": 100, "y": 200, "floor": "2"}</code>
            </div>
          </div>

          <div class="endpoint">
            <h3>
              <span class="method get">GET</span>
              <span class="url">/simulatedPosition/gridSquare</span>
            </h3>
            <div class="description">
              Get the closest grid square to the current position based on stored fingerprint data.
            </div>
            <div class="try-it">
              <a href="/simulatedPosition/gridSquare">View Current Grid Square →</a>
            </div>
          </div>
        </div>
      </body>
    </html>
  `);
}