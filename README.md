# Indoor Navigation Backend

A REST API server that provides indoor navigation services by communicating with a context server and enriching routing data with visual guidance information. The server supports navigation through buildings using a grid-based system, colored line indicators, and step-by-step waypoint guidance.

## Features

- **Position Simulation**: Mock current user positions and retrieve corresponding grid squares
- **Route Guidance**: Generate step-by-step navigation paths between locations
- **Visual Indicators**: Integration with colored line system in the physical building
- **Waypoint System**: Detailed guidance at key navigation points
- **Multi-floor Support**: Handle navigation across different building levels

## Getting Started

### Prerequisites

- Node.js (16.x or higher)
- npm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The server will start on `http://localhost:3000` by default.

## API Endpoints

### Navigation Guide
```
GET /guide/
```
Generate navigation instructions between two points.

Query Parameters:
- `start_gridsquare`: Starting position grid reference (e.g., "04.2.H1-P4")
- `destination_room`: Target room number or alias (e.g., "04.2.022" or "lernraum")
- `mode`: Navigation mode ("visual" or "tactile")

### Position Simulation
```
GET /simulatedPosition/
```
Retrieve current simulated position

```
POST /simulatedPosition/
```
Update simulated position
```json
{
  "x": 100,
  "y": 200,
  "floor": "2"
}
```

```
GET /simulatedPosition/gridSquare/
```
Get closest grid square to current position

```
GET /simulatedPosition/admin/
```
Access position simulation interface

### WiFi Fingerprints
```
GET /fingerprints/
```
Retrieve all WiFi scan fingerprints with their corresponding grid squares

## Data Management

### Generating Fingerprint Data

The system includes a script to process WiFi scan data and generate fingerprint mappings:
```bash
npm run generate-fingerprints
```
This script:

- Processes all WiFi scan files in data/scans/
- Calculates corresponding grid squares
- Generates a combined dataset at data/processed-fingerprints.json

Run this script whenever new WiFi scan data is added to update the fingerprint database.

### Data Structure

WiFi scan data follows this structure:
```json
{
  "scans": [
    {
      "id": "scan-id",
      "timestamp": 1234567890,
      "location": {
        "position_px": {
          "x": 289,
          "y": 118
        },
        "floor": "Etage 1",
        "building": "4",
        "gridSquare": "04.1.H3-P7"
      },
      "samples": [
        {
          "ssid": "network-name",
          "rssi": -47,
          "channel": 11,
          "band": "2.4GHz",
          "bssid": "xx:xx:xx:xx:xx:xx"
        }
      ]
    }
  ]
}
```

## Room Aliases

The system supports user-friendly aliases for common destinations:
- `lernraum` → Room 04.2.022
- `fachschaft` → Room 04.2.029
- `wc` or `toilette` → Room 04.2.031
- `pc-pool` or `pcpool` → Room 04.2.028

## Navigation System

### Grid System
The building is divided into grid squares (e.g., "H1-P4", "V3-P2") for precise position tracking.

### Colored Lines
Navigation uses a system of colored lines in the building:
- Orange Line
- Green Line (Long & Short routes)
- Dark Blue Line
- Yellow Line
- Light Blue Line
- Red Line

Each line has associated waypoints with visual and tactile descriptions for guidance.

## Development

### Environment Variables
- `NODE_ENV`: Set to 'development' for local network access
- `RAILWAY_PUBLIC_DOMAIN`: Production domain (if deployed to Railway)

### Configuration
Server configuration can be modified in `config.ts`:
```typescript
export const SERVER_CONFIG = {
    PORT: 3000,
    IS_LOCAL_NETWORK: process.env.NODE_ENV === 'development',
    PRODUCTION_URL: '[your-production-url]'
}
```

## Production Deployment

The server is configured to run on Railway. When deployed:
1. The server will use `RAILWAY_PUBLIC_DOMAIN` for URL generation
2. HTTPS will be enabled automatically
3. The production URL will be used for all asset paths