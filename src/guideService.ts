import { Context } from 'hono'
import { getBaseUrl } from './utils/url';
import { ImageItem, images, TactileLandmark, tactileLandmarks, } from './data/waypoints'

export interface RouteStep {
    gridSquare: string;
    waypointId?: string;
}
const roomToGridMap: Record<string, string> = {
    // Regular rooms in building 04.2
    '04.2.005': '04.2.H3-P3',  // Prof. Huldtgren & Prof. Schwab-Trapp
    '04.2.006': '04.2.H3-P3',  // Prof. Bonse & Prof. Mostafawy
    '04.2.009': '04.2.H3-P6',  // Prof. Herder & Prof. Huber
    '04.2.010': '04.2.H3-P6',  // Prof. Dahm & Prof. Wojciechowski
    '04.2.039': '04.2.H2-P4',  // Prof. Rakow

    // Special rooms/facilities
    'lernraum': '04.2.H1-P4',
    'fachschaft': '04.2.H1-P7',
    'toilette': '04.2.H2-P1',
    'audimax': '04.2.H1-P13',
    'pc_pool': '04.2.H2-P4',
};




function getRandomSubset<T>(arr: T[], count: number): T[] {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

function findPathBetweenGridSquares(startGrid: string, targetGrid: string, stepCount: number): string[] {
    const availableGrids = [
        '04.2.H1-P4', '04.2.H1-P7', '04.2.H1-P13',
        '04.2.H2-P1', '04.2.H2-P4',
        '04.2.H3-P1', '04.2.H3-P3', '04.2.H3-P6'
    ];

    const result = [startGrid];
    const remainingGrids = availableGrids.filter(g => g !== startGrid && g !== targetGrid);

    // Get random intermediate points
    const intermediatePoints = getRandomSubset(remainingGrids, stepCount - 2);
    result.push(...intermediatePoints);

    result.push(targetGrid);
    return result;
}

function generateRoute(
    startGrid: string,
    endGrid: string,
    stepCount: number,
    navigationMode: 'visual' | 'tactile'
): { steps: RouteStep[], usedWaypoints: (ImageItem | TactileLandmark)[] } {
    const gridSquares = findPathBetweenGridSquares(startGrid, endGrid, stepCount);
    const waypointPool = navigationMode === 'visual' ? images : tactileLandmarks;
    const selectedWaypoints = getRandomSubset(waypointPool, Math.floor(stepCount / 2));
    const usedWaypoints: (ImageItem | TactileLandmark)[] = [];

    const steps: RouteStep[] = gridSquares.map(gridSquare => {
        const step: RouteStep = { gridSquare };

        if (selectedWaypoints.length > 0 && Math.random() < 0.5) {
            const waypoint = selectedWaypoints.pop()!;
            step.waypointId = waypoint.id;
            usedWaypoints.push(waypoint);
        }

        return step;
    });

    return { steps, usedWaypoints };
}

export async function handleGuideRequest(c: Context) {
    const startGridSquare = c.req.query('start_gridsquare') || '';
    const destinationRoom = c.req.query('destination_room') || '';
    const navigationMode = c.req.query('mode') === 'tactile' ? 'tactile' : 'visual';

    // Convert destination room to grid square
    const endGridSquare = roomToGridMap[destinationRoom];

    if (!endGridSquare) {
        return c.json({ error: 'Invalid destination room' }, 400);
    }

    if (!startGridSquare) {
        return c.json({ error: 'Invalid start grid square' }, 400);
    }

    const stepCount = Math.floor(Math.random() * 5) + 3; // Random number between 3 and 7
    const { steps, usedWaypoints } = generateRoute(startGridSquare, endGridSquare, stepCount, navigationMode);

    // Simulate network delay
    const delay = Math.floor(Math.random() * 1900) + 100;
    await new Promise(resolve => setTimeout(resolve, delay));

    return c.json({
        start: {
            gridSquare: startGridSquare
        },
        destination: {
            room: destinationRoom,
            gridSquare: endGridSquare
        },
        route: steps,
        waypoints: usedWaypoints,
        navigationMode
    });
}