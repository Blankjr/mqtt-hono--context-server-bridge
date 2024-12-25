import { Context } from 'hono'
import * as fs from 'fs'
import * as path from 'path'

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