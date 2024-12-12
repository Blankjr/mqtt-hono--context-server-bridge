import { Context } from 'hono'
import { getBaseUrl } from './utils/url'
import { ImageItem, images, TactileLandmark, tactileLandmarks, waypointsByColor } from './data/waypoints'

interface RouteElement {
    aggregation?: {
        distance: number
        _stepCalculated_distance?: number
        _step_distance?: number
    }
    relation?: {
        relationtype: string
        attributes: {
            istWahr: boolean
        }
    }
    fromEntity?: {
        entitytype: string
        id: number
        name: string
        fingerprint: string
        attributes: {
            groesse: number
            etage: number
            position: any  // Simplified for brevity
        }
    }
    toEntity?: {
        entitytype: string
        id: number
        name: string
        fingerprint: string
        attributes: {
            groesse: number
            etage: number
            position: any  // Simplified for brevity
        }
    }
}

interface ContextResponse {
    executionTimeMS: number
    size: number
    optimizationSteps: number
    "timeout reached": boolean
    result: RouteElement[][]
}

interface WaypointQueryResponse {
    query: { name: string }
    response?: {
        executionTimeMS: number
        size: number
        result: Array<Array<{
            relation: { relationtype: string }
            fromEntity: {
                entitytype: string;
                name: string;
                id: number;
                fingerprint: string
            }
            toEntity: {
                entitytype: string;
                id: number;
                name: string;
                fingerprint: string
            }
        }>>
    }
    result?: {
        executionTimeMS: number
        size: number
        result: Array<Array<{
            relation: { relationtype: string }
            fromEntity: {
                entitytype: string;
                name: string;
                id: number;
                fingerprint: string
            }
            toEntity: {
                entitytype: string;
                id: number;
                name: string;
                fingerprint: string
            }
        }>>
    }
}

export interface RouteStep {
    gridSquare: string
    waypointId?: string
}

interface LineRoutes {
    [key: string]: string[]
}

// available colored lines and their grid squares
const coloredRoutes: LineRoutes = {
    "orange": ["H3-P6", "V3-P3", "V3-P2", "V3-P1", "H1-P13", "H1-P12", "H1-P11", "H1-P10", "H1-P9", "H1-P8", "H1-P7", "H1-P6", "H1-P5", "H1-P4"],
    "green-long": ["H1-P4", "H1-P5", "H1-P6", "H1-P7", "H1-P8", "H1-P9", "H1-P10", "H1-P11", "H1-P12", "H1-P13", "V3-P1", "V3-P2", "V3-P3", "H3-P6"],
    "green-short": ["H2-P1", "H2-P2", "H2-P3", "H2-P4"],
    "green-short-reverse": ["H2-P4", "H2-P3", "H2-P2", "H2-P1"],
    "dark-blue": ["H3-P3", "V2-P2", "H2-P4", "V2-P1", "H1-P7"],
    "yellow": ["H1-P7", "V2-P1", "H2-P4", "V2-P2", "H3-P3"],
    "blue": ["H3-P6", "H3-P5", "H3-P4", "H3-P3", "H3-P2", "H3-P1", "V1-P5", "V1-P4", "H1-P1", "V1-P3", "V1-P2", "V1-P1", "H1-P4"],
    "red": ["H1-P4", "V1-P1", "V1-P2", "V1-P3", "H1-P1", "V1-P4", "V1-P5", "H3-P1", "H3-P2", "H3-P3", "H3-P4", "H3-P5", "H3-P6"]
}

interface LineSegment {
    color: string
    startGridSquare: string
    endGridSquare: string
    waypoint: string
}

// Map user-friendly names to specific room numbers
function mapUserRequestToRoom(roomType: string): string {
    const roomMapping: { [key: string]: string } = {
        'lernraum': '04.2.022',
        'fachschaft': '04.2.029',
        'wc': '04.2.031',         // Central WC room
        'toilette': '04.2.031',   // Alternative name for WC
        'pc-pool': '04.2.028',    // Central PC Pool room
        'pcpool': '04.2.028',     // Alternative spelling
        'pc_pool': '04.2.028'     // Alternative spelling
    };

    return roomMapping[roomType.toLowerCase()] || '';
}

const mockWaypointData: WaypointQueryResponse[] = [
    {
        "query": { "name": "04.2.H3-P2" },
        "response": {
            "executionTimeMS": 0,
            "size": 2,
            "result": [
                [
                    {
                        "relation": {
                            "relationtype": "SiehtOrientierungshilfsSignal"
                        },
                        "fromEntity": {
                            "entitytype": "Planquadrat",
                            "id": 101098804895286110,
                            "name": "04.2.H3-P2",
                            "fingerprint": "04.2.H3-P2"
                        },
                        "toEntity": {
                            "entitytype": "OrientierungshilfsSignal",
                            "id": 101098804895286060,
                            "name": "OrientierungshilfeSignal-04.2.H3-P1-Wand",
                            "fingerprint": ""
                        }
                    }
                ],
                [
                    {
                        "relation": {
                            "relationtype": "SiehtOrientierungshilfsSignal"
                        },
                        "fromEntity": {
                            "entitytype": "Planquadrat",
                            "id": 101098804895286110,
                            "name": "04.2.H3-P2",
                            "fingerprint": "04.2.H3-P2"
                        },
                        "toEntity": {
                            "entitytype": "OrientierungshilfsSignal",
                            "id": 101098804895286100,
                            "name": "OrientierungshilfeSignal-04.2.H3-P3-Doppelfahrstuhl-Flur",
                            "fingerprint": ""
                        }
                    }
                ]
            ]
        }
    },
    {
        "query": { "name": "04.2.H1-P4" },
        "result": { "executionTimeMS": 0, "size": 3, "result": [[{ "relation": { "relationtype": "SiehtOrientierungshilfsSignal" }, "fromEntity": { "entitytype": "Planquadrat", "id": 101098804895286080, "name": "04.2.H1-P4", "fingerprint": "04.2.H1-P4" }, "toEntity": { "entitytype": "OrientierungshilfsSignal", "id": 101098804895286080, "name": "OrientierungshilfeSignal-04.2.H1-P4-Richtung-S-Bahn", "fingerprint": "" } }], [{ "relation": { "relationtype": "SiehtOrientierungshilfsSignal" }, "fromEntity": { "entitytype": "Planquadrat", "id": 101098804895286080, "name": "04.2.H1-P4", "fingerprint": "04.2.H1-P4" }, "toEntity": { "entitytype": "OrientierungshilfsSignal", "id": 101098804895286080, "name": "OrientierungshilfeSignal-04.2.H1-P4-Richtung-Strasse", "fingerprint": "" } }], [{ "relation": { "relationtype": "SiehtOrientierungshilfsSignal" }, "fromEntity": { "entitytype": "Planquadrat", "id": 101098804895286080, "name": "04.2.H1-P4", "fingerprint": "04.2.H1-P4" }, "toEntity": { "entitytype": "OrientierungshilfsSignal", "id": 101098804895286080, "name": "OrintierungshilfeSignal-04.2.H1-P4-Richtung-Campus-Zentrum", "fingerprint": "" } }]] }
    },
    {
        "query": { "name": "04.2.H1-P13" },
        "result": { "executionTimeMS": 1, "size": 2, "result": [[{ "relation": { "relationtype": "SiehtOrientierungshilfsSignal" }, "fromEntity": { "entitytype": "Planquadrat", "id": 101098804895286038, "name": "04.2.H1-P13", "fingerprint": "04.2.H1-P13" }, "toEntity": { "entitytype": "OrientierungshilfsSignal", "id": 101098804895286042, "name": "OrientierungshilfeSignal-04.2.H1-P13-Flur-Fachschaft", "fingerprint": "" } }], [{ "relation": { "relationtype": "SiehtOrientierungshilfsSignal" }, "fromEntity": { "entitytype": "Planquadrat", "id": 101098804895286038, "name": "04.2.H1-P13", "fingerprint": "04.2.H1-P13" }, "toEntity": { "entitytype": "OrientierungshilfsSignal", "id": 101098804895286040, "name": "OrientierungshilfeSignal-04.2.H1-P13-Flur-PC-Pool", "fingerprint": "" } }]] }
    },
    {
        "query": { "name": "04.2.H1-P12" },
        "result": { "executionTimeMS": 1, "size": 1, "result": [[{ "relation": { "relationtype": "SiehtOrientierungshilfsSignal" }, "fromEntity": { "entitytype": "Planquadrat", "id": 101098804895286003, "name": "04.2.H1-P12", "fingerprint": "04.2.H1-P12" }, "toEntity": { "entitytype": "OrientierungshilfsSignal", "id": 101098804895286041, "name": "OrientierungshilfeSignal-04.2.H1-P13-Sitzbereich", "fingerprint": "" } }]] }
    },
    {
        "query": { "name": "04.2.H1-P11" },
        "result": { "executionTimeMS": 0, "size": 1, "result": [[{ "relation": { "relationtype": "SiehtOrientierungshilfsSignal" }, "fromEntity": { "entitytype": "Planquadrat", "id": 101098804895286095, "name": "04.2.H1-P11", "fingerprint": "04.2.H1-P11" }, "toEntity": { "entitytype": "OrientierungshilfsSignal", "id": 101098804895286041, "name": "OrientierungshilfeSignal-04.2.H1-P13-Sitzbereich", "fingerprint": "" } }]] }
    },
    {
        "query": { "name": "04.2.H1-P10" },
        "result": { "executionTimeMS": 0, "size": 1, "result": [[{ "relation": { "relationtype": "SiehtOrientierungshilfsSignal" }, "fromEntity": { "entitytype": "Planquadrat", "id": 101098804895286008, "name": "04.2.H1-P10", "fingerprint": "04.2.H1-P10" }, "toEntity": { "entitytype": "OrientierungshilfsSignal", "id": 101098804895286041, "name": "OrientierungshilfeSignal-04.2.H1-P13-Sitzbereich", "fingerprint": "" } }]] }
    },
    {
        "query": { "name": "04.2.H1-P9" },
        "result": { "executionTimeMS": 0, "size": 2, "result": [[{ "relation": { "relationtype": "SiehtOrientierungshilfsSignal" }, "fromEntity": { "entitytype": "Planquadrat", "id": 101098804895286033, "name": "04.2.H1-P9", "fingerprint": "04.2.H1-P9" }, "toEntity": { "entitytype": "OrientierungshilfsSignal", "id": 101098804895286019, "name": "OrientierungshilfeSignal-04.2.H1-P7-Richtung-Lastenaufzug", "fingerprint": "" } }], [{ "relation": { "relationtype": "SiehtOrientierungshilfsSignal" }, "fromEntity": { "entitytype": "Planquadrat", "id": 101098804895286033, "name": "04.2.H1-P9", "fingerprint": "04.2.H1-P9" }, "toEntity": { "entitytype": "OrientierungshilfsSignal", "id": 101098804895286041, "name": "OrientierungshilfeSignal-04.2.H1-P13-Sitzbereich", "fingerprint": "" } }]] }
    },
    {
        "query": { "name": "04.2.H1-P8" },
        "result": { "executionTimeMS": 0, "size": 1, "result": [[{ "relation": { "relationtype": "SiehtOrientierungshilfsSignal" }, "fromEntity": { "entitytype": "Planquadrat", "id": 101098804895286054, "name": "04.2.H1-P8", "fingerprint": "04.2.H1-P8" }, "toEntity": { "entitytype": "OrientierungshilfsSignal", "id": 101098804895286019, "name": "OrientierungshilfeSignal-04.2.H1-P7-Richtung-Lastenaufzug", "fingerprint": "" } }]] }
    }
]

function isValidContextResponse(data: any): data is ContextResponse {
    return (
        typeof data === 'object' &&
        data !== null &&
        Array.isArray(data.result) &&
        data.result.length === 1 &&
        Array.isArray(data.result[0]) &&
        data.result[0].length > 0 &&
        'aggregation' in data.result[0][0]
    )
}

const mockContextResponses: Record<string, ContextResponse> = {}

async function initializeMockResponses() {
    try {
        const route022 = await import('./data/mock-route-022.json', { assert: { type: 'json' } })
        const route010 = await import('./data/mock-route-010.json', { assert: { type: 'json' } })

        if (!isValidContextResponse(route022.default)) {
            throw new Error('Invalid data format in mock-route-022.json')
        }
        if (!isValidContextResponse(route010.default)) {
            throw new Error('Invalid data format in mock-route-010.json')
        }

        // Use route022 as default template for most responses
        mockContextResponses["04.2.022"] = route022.default

        // Use specific route for room 010
        mockContextResponses["04.2.010"] = route010.default
    } catch (error) {
        console.error('Failed to load mock responses:', error)
    }
}

async function fetchRouteFromContextServer(startGridSquare: string, destinationRoom: string): Promise<ContextResponse> {
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'User-Agent': 'insomnia/10.2.0'
        },
        body: new URLSearchParams({
            application: 'visitor',
            situation: 'KurzesterWeg',
            query: 'KurzesterWeg',
            part_StartPlanquadrat: JSON.stringify({ name:"04.2.H1-P13" }),
            part_ZielRaum: JSON.stringify({ name: "04.2.022" }),
            param_breakAfterMS: '1000',
            param_resultSize: '1',
            param_maxOptSteps: '300'
        })
    };

    try {
        const response = await fetch('http://localhost:8080/contextserver/ContextServerAPI/predefined', options);
        
        if (!response.ok) {
            throw new Error(`Context server responded with status: ${response.status}`);
        }

        const data = await response.json();
        
        if (!isValidContextResponse(data)) {
            throw new Error('Invalid response format from context server');
        }

        return data;
    } catch (error) {
        console.error('Failed to fetch route from context server:', error);
        // Fallback to mock data if available
        return mockContextResponses[destinationRoom] || null;
    }
}

function getWaypointsForGridSquare(gridSquare: string): string[] {
    const queryData = mockWaypointData.find(item => item.query.name === gridSquare)
    if (!queryData) return []

    // Handle both response structures (response or result)
    const result = queryData.response?.result || queryData.result?.result || []

    // Extract waypoint names from the results
    return result.flat().map(item => item.toEntity.name)
}

function extractRouteFromContextResponse(response: ContextResponse): string[] {
    const gridSquares: string[] = []

    // Skip the first element as it's just the aggregation
    const routeElements = response.result[0].slice(1)

    for (const element of routeElements) {
        if (element.fromEntity?.entitytype === 'Planquadrat') {
            gridSquares.push(element.fromEntity.name)
        }
    }

    // Remove duplicates while maintaining order
    return [...new Set(gridSquares)]
}

function getDestinationGridSquare(response: ContextResponse): string {
    const relations = response.result[0].slice(1) as RouteElement[]
    const lastRelation = relations[relations.length - 1]

    // If it's a relation to a room, get the last grid square before the room
    if (lastRelation.toEntity?.entitytype === 'Raum') {
        return lastRelation.fromEntity?.name || ''
    }

    return lastRelation.toEntity?.name || ''
}

function generateRoute(
    startGridSquare: string,
    contextResponse: ContextResponse,
    navigationMode: 'visual' | 'tactile'
): { steps: RouteStep[], usedWaypoints: (ImageItem | TactileLandmark)[], lineDirections: Record<string, string[]> } {
    const gridSquares = extractRouteFromContextResponse(contextResponse)
    if (gridSquares[0] !== startGridSquare) {
        gridSquares.unshift(startGridSquare)
    }

    const usedWaypoints: (ImageItem | TactileLandmark)[] = []
    const waypointPool = navigationMode === 'visual' ? images : tactileLandmarks
    const lineDirections: Record<string, string[]> = {}

    const steps: RouteStep[] = gridSquares.map(gridSquare => {
        const step: RouteStep = { gridSquare }
        const gridWaypoints = getWaypointsForGridSquare(gridSquare)

        // If this grid square has waypoints, use the first one
        if (gridWaypoints.length > 0) {
            const signalName = gridWaypoints[0]
            const waypoint = waypointPool.find(w => w.id === signalName)
            if (waypoint) {
                step.waypointId = waypoint.id
                usedWaypoints.push(waypoint)
            }
        }

        return step
    })

    // Check consecutive pairs for colored routes
    for (let i = 0; i < steps.length - 1; i++) {
        const currentGridSquare = steps[i].gridSquare.replace('04.2.', '')
        const nextGridSquare = steps[i + 1].gridSquare.replace('04.2.', '')

        // Check each colored route
        for (const [color, route] of Object.entries(coloredRoutes)) {
            // Find if these consecutive squares are part of this route
            for (let j = 0; j < route.length - 1; j++) {
                if (route[j] === currentGridSquare && route[j + 1] === nextGridSquare) {
                    if (!lineDirections[color]) {
                        lineDirections[color] = []
                    }
                    lineDirections[color].push(`04.2.${nextGridSquare}`)
                    break
                }
            }
        }
    }

    return { steps, usedWaypoints, lineDirections }
}

// Initialize on startup
initializeMockResponses().catch(console.error)

function findWaypointsForRoute(route: any[], navigationMode: 'visual' | 'tactile'): (ImageItem | TactileLandmark)[] {
    const waypointPool = navigationMode === 'visual' ? images : tactileLandmarks;
    const usedWaypoints: (ImageItem | TactileLandmark)[] = [];

    route.forEach(gridSquare => {
        const matchingWaypoints = waypointPool.filter(waypoint => {
            const waypointGridSquare = waypoint.id.includes(gridSquare.name) ? gridSquare.name : null;
            return waypointGridSquare === gridSquare.name;
        });

        if (matchingWaypoints.length > 0) {
            usedWaypoints.push(matchingWaypoints[0]);
        }
    });

    return usedWaypoints;
}

function findWaypointsForRouteFromColors(
    lineDirections: Record<string, string[]>
  ): { id: string; description: string }[] {
    const usedWaypoints: { id: string; description: string }[] = [];
    
    // Go through each color line
    Object.entries(lineDirections).forEach(([color, gridSquares]) => {
      // Look up waypoints for this color
      const colorWaypoints = waypointsByColor[color];
      if (!colorWaypoints) return;
  
      // For each grid square in this line
      gridSquares.forEach(gridSquare => {
        // If we have a waypoint for this grid square
        if (colorWaypoints[gridSquare]) {
          usedWaypoints.push({
            id: gridSquare,
            description: colorWaypoints[gridSquare].visualDescription
          });
        }
      });
    });
  
    // Remove duplicates based on grid square id
    return usedWaypoints.filter((waypoint, index, self) =>
      index === self.findIndex((w) => w.id === waypoint.id)
    );
}  
function findColoredLines(route: any[]): Record<string, string[]> {
    const lineDirections: Record<string, string[]> = {};
    const gridSquares = route.map(r => r.name.replace('04.2.', ''));

    for (const [color, lineRoute] of Object.entries(coloredRoutes)) {
        for (let i = 0; i < gridSquares.length - 1; i++) {
            const current = gridSquares[i];
            const next = gridSquares[i + 1];

            for (let j = 0; j < lineRoute.length - 1; j++) {
                if (lineRoute[j] === current && lineRoute[j + 1] === next) {
                    if (!lineDirections[color]) {
                        lineDirections[color] = [];
                    }
                    lineDirections[color].push(`04.2.${current}`);
                    lineDirections[color].push(`04.2.${next}`);
                    break;
                }
            }
        }
    }
    // Remove duplicates while maintaining order ( ["Grid1", "Grid2", "Grid2", "Grid3"])
    Object.keys(lineDirections).forEach(color => {
        lineDirections[color] = [...new Set(lineDirections[color])];
    });

    return lineDirections;
}

export async function handleGuideRequest(c: Context) {
    console.log('Handling guide request...');

    const startGridSquare = c.req.query('start_gridsquare') || '';
    const rawDestination = c.req.query('destination_room') || '';
    const navigationMode = c.req.query('mode') === 'tactile' ? 'tactile' : 'visual';

    if (!startGridSquare || !rawDestination) {
        return c.json({ error: 'Invalid parameters' }, 400);
    }

    const destinationRoom = mapUserRequestToRoom(rawDestination) || rawDestination;

    if (!destinationRoom.match(/^04\.2\.\d{3}$/)) {
        return c.json({ 
            error: 'Invalid destination room format', 
            details: 'Room must be in format 04.2.XXX or a valid room alias' 
        }, 400);
    }

    try {
        const params = new URLSearchParams();
        params.append('application', 'visitor');
        params.append('situation', 'KurzesterWeg');
        params.append('query', 'KurzesterWeg');
        params.append('part_StartPlanquadrat', JSON.stringify({ name: startGridSquare }));
        params.append('part_ZielRaum', JSON.stringify({ name: destinationRoom }));
        params.append('param_breakAfterMS', '1000');
        params.append('param_resultSize', '1');
        params.append('param_maxOptSteps', '300');

        const response = await fetch('http://localhost:8080/contextserver/ContextServerAPI/predefined', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'User-Agent': 'insomnia/10.2.0'
            },
            body: params
        });

        if (!response.ok) {
            throw new Error(`Server responded with status ${response.status}`);
        }

        const data = await response.json();
        
        const route = data.result[0]
            .filter((element: { fromEntity: any }) => element.fromEntity)
            .map((element: { fromEntity: { entitytype: any; name: any; attributes: { etage: any } } }) => ({
                type: element.fromEntity.entitytype,
                name: element.fromEntity.name,
                floor: element.fromEntity.attributes.etage
            }));

        const lineDirections = findColoredLines(route);
        const waypointInfo = findWaypointsForRouteFromColors(lineDirections);

        // Create route steps with waypoint information
        const routeSteps = route.map((gridSquare: { name: string }) => {
            const matchingWaypoint = waypointInfo.find(w => w.id === gridSquare.name);
            return {
                gridSquare: gridSquare.name,
                waypointId: matchingWaypoint ? matchingWaypoint.id : undefined
            };
        });

        return c.json({
            success: true,
            start: {
                gridSquare: startGridSquare
            },
            destination: {
                room: destinationRoom,
                info: {
                    type: data.result[0][data.result[0].length - 1].toEntity.entitytype,
                    name: data.result[0][data.result[0].length - 1].toEntity.name,
                    floor: data.result[0][data.result[0].length - 1].toEntity.attributes.etage
                },
                gridSquare: route[route.length - 1]?.name || ''
            },
            route: routeSteps,
            waypoints: waypointInfo,
            lineDirections,
            navigationMode
        });

    } catch (error: unknown) {
        console.error('Error in handleGuideRequest:', error);
        return c.json({ 
            error: 'Failed to process routing request',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, 500);
    }
}