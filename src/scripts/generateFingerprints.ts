import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import glob from 'glob';

interface Position {
  x: number;
  y: number;
}

interface Location {
  position_px: Position;
  floor: string;
  building: string;
}

interface Sample {
  ssid: string;
  rssi: number;
  channel: number;
  band: string;
  bssid: string;
  security: string;
  hidden: boolean;
  frequency: number;
}

interface Scan {
  id: string;
  timestamp: number;
  location: Location & { gridSquare: string };
  samples: Sample[];
}

interface ReferenceFingerprint {
  id: string;
  position: {
    x: number;
    y: number;
    floor: string;
  };
  samples: any[];
}

interface FingerprintData {
  fingerprints: ReferenceFingerprint[];
}

// Helper function to calculate Euclidean distance
function calculateDistance(p1: Position, p2: Position): number {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
}

// Function to find the closest fingerprint
function findClosestFingerprint(position: Position, floor: string, referenceData: FingerprintData): string {
  // Convert floor format
  const normalizedFloor = floor.replace('Etage ', '');
  
  // Return specific grid squares for floors 0, 1, and 3
  if (normalizedFloor === '0') return '04.0.H3-P7';
  if (normalizedFloor === '1') return '04.1.H3-P7';
  if (normalizedFloor === '3') return '04.3.H3-P7';

  // For floor 2, find closest fingerprint
  const sameFloorFingerprints = referenceData.fingerprints.filter(fp => 
    fp.position.floor === normalizedFloor
  );

  let closestId = '';
  let minDistance = Infinity;

  for (const fingerprint of sameFloorFingerprints) {
    const distance = calculateDistance(
      position,
      { x: fingerprint.position.x, y: fingerprint.position.y }
    );

    if (distance < minDistance) {
      minDistance = distance;
      closestId = fingerprint.id;
    }
  }

  return closestId || '04.2.H1-P13'; // Default grid square for floor 2
}

async function generateFingerprints() {
  try {
    // Read reference fingerprint data
    const referenceDataPath = path.join(process.cwd(), 'data', 'fingerprints-mock.json');
    const referenceData: FingerprintData = JSON.parse(
      await promisify(fs.readFile)(referenceDataPath, 'utf8')
    );

    // Find all scan files
    const scanFiles = await new Promise<string[]>((resolve, reject) => {
      glob('data/scans/wifi_scans_*.json', (err, matches) => {
        if (err) reject(err);
        else resolve(matches);
      });
    });
    
    // Process each scan file
    const allScans: Scan[] = [];
    
    for (const file of scanFiles) {
      const fileContent = await promisify(fs.readFile)(file, 'utf8');
      const scanData = JSON.parse(fileContent);
      
      // Process each scan in the file
      for (const scan of scanData.scans) {
        const gridSquare = findClosestFingerprint(
          scan.location.position_px,
          scan.location.floor,
          referenceData
        );

        allScans.push({
          id: scan.id,
          timestamp: scan.timestamp,
          location: {
            ...scan.location,
            gridSquare
          },
          samples: scan.samples
        });
      }
    }

    // Save processed data
    const outputPath = path.join(process.cwd(), 'data', 'processed-fingerprints.json');
    await promisify(fs.writeFile)(
      outputPath,
      JSON.stringify({ scans: allScans }, null, 2)
    );

    console.log(`Successfully generated fingerprints file at ${outputPath}`);
  } catch (error) {
    console.error('Error generating fingerprints:', error);
    process.exit(1);
  }
}

// Execute if run directly
generateFingerprints();

export { generateFingerprints };