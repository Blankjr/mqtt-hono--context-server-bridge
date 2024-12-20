import { Context } from 'hono'
import * as fs from 'fs'
import * as path from 'path'
import { getBaseUrl, getLocalIpAddress } from './utils/url'
import { SERVER_CONFIG } from './utils/config'

interface MockPosition {
  x: number
  y: number
  floor: string
  timestamp: number
}

interface Fingerprint {
  id: string
  position: {
    x: number
    y: number
    floor: string
  }
  samples: Array<{
    ssid: string
    rssi: number
    channel: number
    band: string
    bssid: string
  }>
}

interface FingerprintData {
  fingerprints: Fingerprint[]
}

let mockPosition: MockPosition = {
  x: 111,
  y: 130,
  floor: '2',
  timestamp: Date.now()
}

// Calculate Euclidean distance between two points
function calculateDistance(p1: { x: number, y: number }, p2: { x: number, y: number }): number {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
}

function findClosestFingerprint(position: MockPosition): string {
  // Return specific grid squares for floors 0, 1, and 3
  if (position.floor === '0') {
    return '04.0.H3-P7';
  }
  if (position.floor === '1') {
    return '04.1.H3-P7';
  }
  if (position.floor === '3') {
    return '04.3.H3-P7';
  }

  // For floor 2, keep the existing logic
  try {
    // Read fingerprint data
    const fingerprintPath = path.join(process.cwd(), 'data', 'fingerprints-mock.json');
    const rawData = fs.readFileSync(fingerprintPath, 'utf8');
    const data: FingerprintData = JSON.parse(rawData);

    let closestId = '';
    let minDistance = Infinity;

    // Only compare fingerprints on floor 2
    const sameFloorFingerprints = data.fingerprints.filter(fp => fp.position.floor === '2');

    for (const fingerprint of sameFloorFingerprints) {
      const distance = calculateDistance(
        { x: position.x, y: position.y },
        { x: fingerprint.position.x, y: fingerprint.position.y }
      );

      if (distance < minDistance) {
        minDistance = distance;
        closestId = fingerprint.id;
      }
    }

    return closestId || '04.2.H1-P13'; // Default grid square for floor 2
  } catch (error) {
    console.error('Error reading fingerprint data:', error);
    return '04.2.H1-P13'; // Default grid square for floor 2 in case of error
  }
}

export async function handleGetPosition(c: Context) {
  return c.json(mockPosition)
}

export async function handleUpdatePosition(c: Context) {
  try {
    const body = await c.req.json()
    mockPosition = {
      x: body.x || 0,
      y: body.y || 0,
      floor: body.floor || '1',
      timestamp: Date.now()
    }
    return c.json(mockPosition)
  } catch (error) {
    return c.json({ error: 'Invalid request body' }, 400)
  }
}

export async function handleGetGridSquare(c: Context) {
  try {
    const closestId = findClosestFingerprint(mockPosition);
    return c.json({
      position: mockPosition,
      gridSquare: closestId,
      timestamp: Date.now()
    });
  } catch (error) {
    return c.json({ error: 'Error finding grid square' }, 500);
  }
}

export async function handlePositionInterface(c: Context) {
  // Get the appropriate base URL based on environment
  const getInternalUrl = () => {
    if (process.env.NODE_ENV === 'production') {
      // Use Railway's internal DNS
      return `http://${process.env.RAILWAY_SERVICE_NAME}.railway.internal:${SERVER_CONFIG.PORT}`
    } else {
      // Use localhost for development
      return `http://localhost:${SERVER_CONFIG.PORT}`
    }
  }

  const baseUrl = getInternalUrl()

  return c.html(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Position Mock Interface</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            margin: 0;
            padding: 20px;
            font-family: Arial, sans-serif;
            background: #f5f5f5;
          }
          .map-container {
            width: 100%;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            box-sizing: border-box;
          }
          .map-wrapper {
            width: 100%;
            height: 600px;
            position: relative;
            border: 1px solid #ccc;
            overflow: auto;
            background: #fff;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            border-radius: 4px;
          }
          
          .map {
            position: relative;
            display: inline-block;
          }
          
          .map img {
            display: block;
            max-width: none;
          }

          .marker {
            position: absolute;
            width: 20px;
            height: 20px;
            background-color: rgba(255, 0, 0, 0.7);
            border-radius: 50%;
            border: 2px solid white;
            transform: translate(-50%, -50%);
            pointer-events: none;
            box-shadow: 0 0 4px rgba(0,0,0,0.5);
            z-index: 10;
          }
          .controls {
            margin: 20px 0;
            padding: 15px;
            background: white;
            border-radius: 4px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            display: flex;
            gap: 20px;
            align-items: center;
          }
          .info {
            margin-top: 20px;
            padding: 15px;
            background: white;
            border-radius: 4px;
            font-family: monospace;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          select {
            padding: 8px 12px;
            border-radius: 4px;
            border: 1px solid #ccc;
            font-size: 14px;
            background: white;
          }
          .coordinates {
            display: flex;
            gap: 20px;
            flex-wrap: wrap;
          }
          .coordinate-box {
            flex: 1;
            min-width: 200px;
            background: #f8f8f8;
            padding: 15px;
            border-radius: 4px;
            border: 1px solid #eee;
          }
          .grid-square {
            color: #0066cc;
            font-weight: bold;
          }
        </style>
        <script>
          // Use the internal URL for all API calls
          const baseUrl = "${baseUrl}";
           
          async function updatePosition(x, y, floor) {
            try {
              console.log('Sending position:', { x, y, floor });
              
              // Update position
              const response = await fetch(\`\${baseUrl}/simulatedPosition/\`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ x, y, floor }),
              });
              
              if (!response.ok) {
                throw new Error('Network response was not ok');
              }
              
              const positionData = await response.json();
              
              // Fetch grid square
              const gridSquareResponse = await fetch(\`\${baseUrl}/simulatedPosition/gridSquare\`);
              const gridSquareData = await gridSquareResponse.json();
              
              // Combine the data
              const combinedData = {
                ...positionData,
                gridSquare: gridSquareData.gridSquare
              };
              
              console.log('Received data:', combinedData);
              updateStatusDisplay(combinedData);
            } catch (error) {
              console.error('Error:', error);
              document.getElementById('status').textContent = 'Error: ' + error.message;
            }
          }

          function updateStatusDisplay(data) {
            const img = document.getElementById('map-image');
            const status = document.getElementById('status');
            
            status.innerHTML = \`
              <div class="coordinates">
                <div class="coordinate-box">
                  <strong>Coordinates:</strong><br>
                  X: \${data.x || 0}<br>
                  Y: \${data.y || 0}<br>
                  Floor: \${data.floor || '1'}
                </div>
                <div class="coordinate-box">
                  <strong>Grid Square:</strong><br>
                  <span class="grid-square">\${data.gridSquare || 'Not found'}</span>
                </div>
                <div class="coordinate-box">
                  <strong>Image Size:</strong><br>
                  Width: \${img.naturalWidth}px<br>
                  Height: \${img.naturalHeight}px
                </div>
                <div class="coordinate-box">
                  <strong>Last Updated:</strong><br>
                  \${new Date(data.timestamp).toLocaleTimeString()}
                </div>
              </div>
            \`;
          }

          function handleMapClick(event) {
            const img = document.getElementById('map-image');
            const rect = img.getBoundingClientRect();
            const mapWrapper = document.querySelector('.map-wrapper');
            
            const scrollLeft = mapWrapper.scrollLeft;
            const scrollTop = mapWrapper.scrollTop;
            
            const x = Math.round(event.clientX - rect.left + scrollLeft);
            const y = Math.round(event.clientY - rect.top + scrollTop);
            
            console.log('Click event:', {
              clientX: event.clientX,
              clientY: event.clientY,
              rectLeft: rect.left,
              rectTop: rect.top,
              scrollLeft,
              scrollTop,
              finalX: x,
              finalY: y
            });
            
            const marker = document.getElementById('marker');
            marker.style.left = x + 'px';
            marker.style.top = y + 'px';
            marker.style.display = 'block';
            
            const floor = document.getElementById('floor-select').value;
            updatePosition(x, y, floor);
          }

          function updateFloorPlan() {
            const floor = document.getElementById('floor-select').value;
            const mapImage = document.getElementById('map-image');
            mapImage.src = '/maps/floor' + floor + '.png';
            
            const marker = document.getElementById('marker');
            marker.style.display = 'none';
          }

          async function loadPosition() {
            try {
              // Fetch both position and grid square data
              const [positionResponse, gridSquareResponse] = await Promise.all([
                fetch(\`\${baseUrl}/simulatedPosition\`),
                fetch(\`\${baseUrl}/simulatedPosition/gridSquare\`)
              ]);
              
              const positionData = await positionResponse.json();
              const gridSquareData = await gridSquareResponse.json();
              
              // Combine the data
              const data = {
                ...positionData,
                gridSquare: gridSquareData.gridSquare
              };
              
              document.getElementById('floor-select').value = data.floor;
              updateFloorPlan();
              
              const mapImage = document.getElementById('map-image');
              mapImage.onload = function() {
                let displayX = data.x;
                let displayY = data.y;
                if (data.floor === '2') {
                  displayX = displayX / 2;
                  displayY = displayY / 2;
                }
                
                const marker = document.getElementById('marker');
                marker.style.left = displayX + 'px';
                marker.style.top = displayY + 'px';
                marker.style.display = 'block';
                
                updateStatusDisplay(data);
              };
            } catch (error) {
              document.getElementById('status').textContent = 'Error loading position: ' + error.message;
            }
          }

          window.addEventListener('load', loadPosition);
        </script>
      </head>
      <body>
        <div class="map-container">
          <h2>Position Mock Interface</h2>
          
          <div class="controls">
            <label for="floor-select">Floor:</label>
            <select id="floor-select" onchange="updateFloorPlan()">
              <option value="0">Floor 0</option>
              <option value="1">Floor 1</option>
              <option value="2">Floor 2</option>
              <option value="3">Floor 3</option>
            </select>
          </div>

          <div class="map-wrapper">
            <div class="map">
              <img id="map-image" src="/maps/floor1.png" onclick="handleMapClick(event)" alt="Floor Plan">
              <div id="marker" class="marker" style="display: none;"></div>
            </div>
          </div>

          <div id="status" class="info">Click on the map to set position</div>
        </div>
      </body>
    </html>
  `);
}  