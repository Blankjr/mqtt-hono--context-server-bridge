// positionService.ts
import { Context } from 'hono'

interface MockPosition {
    x: number
    y: number
    floor: string
    timestamp: number
}

let mockPosition: MockPosition = {
    x: 0,
    y: 0,
    floor: '1',
    timestamp: Date.now()
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

export async function handlePositionInterface(c: Context) {
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

          /* Special handling for floor2.png */
          .map img[src="/maps/floor2.png"] {
            width: 690px; /* Half of original 1380px */
            height: auto;
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
        </style>
        <script>
          async function updatePosition(x, y, floor) {
            try {
              // Scale up coordinates for floor2 since we're displaying it at half size
              if (floor === '2') {
                x = x * 2;
                y = y * 2;
              }
              
              const response = await fetch('/simulatedPosition', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ x, y, floor }),
              });
              const data = await response.json();
              updateStatusDisplay(data);
            } catch (error) {
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
                  X: \${data.x}<br>
                  Y: \${data.y}<br>
                  Floor: \${data.floor}
                </div>
                <div class="coordinate-box">
                  <strong>Image Size:</strong><br>
                  Width: \${img.naturalWidth}px<br>
                  Height: \${img.naturalHeight}px
                </div>
              </div>
            \`;
          }

          function handleMapClick(event) {
            const map = document.querySelector('.map');
            const rect = map.getBoundingClientRect();
            const scrollLeft = map.parentElement.scrollLeft;
            const scrollTop = map.parentElement.scrollTop;
            
            // Calculate click position relative to image, accounting for scroll
            const x = Math.round(event.clientX - rect.left + scrollLeft);
            const y = Math.round(event.clientY - rect.top + scrollTop);
            
            // Update marker position
            const marker = document.getElementById('marker');
            marker.style.left = x + 'px';
            marker.style.top = y + 'px';
            marker.style.display = 'block';
            
            // Get selected floor
            const floor = document.getElementById('floor-select').value;
            
            // Update position
            updatePosition(x, y, floor);
          }

          function updateFloorPlan() {
            const floor = document.getElementById('floor-select').value;
            const mapImage = document.getElementById('map-image');
            mapImage.src = '/maps/floor' + floor + '.png';
            
            // Reset marker when floor changes
            const marker = document.getElementById('marker');
            marker.style.display = 'none';
          }

          async function loadPosition() {
            try {
              const response = await fetch('/simulatedPosition');
              const data = await response.json();
              
              // Set floor select
              document.getElementById('floor-select').value = data.floor;
              updateFloorPlan();
              
              // Wait for image to load before positioning marker
              const mapImage = document.getElementById('map-image');
              mapImage.onload = function() {
                // Scale down coordinates for floor2 display
                let displayX = data.x;
                let displayY = data.y;
                if (data.floor === '2') {
                  displayX = displayX / 2;
                  displayY = displayY / 2;
                }
                
                // Update marker
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

          // Initialize on load
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