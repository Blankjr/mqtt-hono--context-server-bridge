import { Context } from 'hono'
import fs from 'fs'
import path from 'path'
import { promisify } from 'util'

const readFile = promisify(fs.readFile);

export async function handleGetFingerprints(c: Context) {
  try {
    const fingerprintsPath = path.join(process.cwd(), 'data', 'processed-fingerprints.json');
    const data = await readFile(fingerprintsPath, 'utf8');
    return c.json(JSON.parse(data));
  } catch (error) {
    console.error('Error reading fingerprints file:', error);
    return c.json({ error: 'Internal Server Error' }, 500);
  }
}