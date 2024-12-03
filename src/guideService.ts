import { Context } from 'hono'
import { getBaseUrl } from './utils/url'
import { ImageItem, images, TactileLandmark, tactileLandmarks } from './data/waypoints'

interface Position {
    xStart: number
    xEnd: number
    yStart: number
    yEnd: number
    zStart: number
    zEnd: number
    xCentral: number
    yCentral: number
    zCentral: number
    xCircleCenter: number
    yCircleCenter: number
    radius: number
    CoverIndex: number
    PolygonPoints: any[]
    PolygonType: string
}

interface Entity {
    entitytype: string
    id: number
    name: string
    fingerprint: string
    attributes: {
        groesse: number
        etage: number
        position: Position
        art?: string
        temperature?: number
    }
}

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
    fromEntity?: Entity
    toEntity?: Entity
    prioritySelectorResult?: number
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

// Map user-friendly names to specific room numbers
function mapUserRequestToRoom(roomType: string): string {
    const roomMapping: { [key: string]: string } = {
        'lernraum': '04.2.022',
        'fachschaft': '04.2.017',
        'wc': '04.2.032',         // Central WC room
        'toilette': '04.2.032',   // Alternative name for WC
        'pc-pool': '04.2.010',    // Central PC Pool room
        'pcpool': '04.2.010',     // Alternative spelling
        'pc_pool': '04.2.010'     // Alternative spelling
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
): { steps: RouteStep[], usedWaypoints: (ImageItem | TactileLandmark)[] } {
    const gridSquares = extractRouteFromContextResponse(contextResponse)
    if (gridSquares[0] !== startGridSquare) {
        gridSquares.unshift(startGridSquare)
    }

    const usedWaypoints: (ImageItem | TactileLandmark)[] = []
    const waypointPool = navigationMode === 'visual' ? images : tactileLandmarks

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

    return { steps, usedWaypoints }
}

// Initialize on startup
initializeMockResponses().catch(console.error)

export async function handleGuideRequest(c: Context) {
    const startGridSquare = c.req.query('start_gridsquare') || ''
    const destinationRoom = c.req.query('destination_room') || ''
    const navigationMode = c.req.query('mode') === 'tactile' ? 'tactile' : 'visual'

    if (!startGridSquare) {
        return c.json({ error: 'Invalid start grid square' }, 400)
    }

    if (!destinationRoom) {
        return c.json({ error: 'Invalid destination room' }, 400)
    }

    // Wait for mock responses to be initialized if they haven't been yet
    if (Object.keys(mockContextResponses).length === 0) {
        await initializeMockResponses()
    }
    // Map user-friendly room names to actual room numbers
    const mappedRoom = mapUserRequestToRoom(destinationRoom)
    if (!mappedRoom) {
        return c.json({ error: 'Invalid destination room type' }, 400)
    }

    // Get route from context server (currently using mock data)
    const contextResponse = mockContextResponses[mappedRoom]

    if (!contextResponse) {
        return c.json({ error: 'Route not found for destination' }, 404)
    }

    const { steps, usedWaypoints } = generateRoute(startGridSquare, contextResponse, navigationMode)
    const destinationGridSquare = getDestinationGridSquare(contextResponse)

    return c.json({
        start: {
            gridSquare: startGridSquare
        },
        destination: {
            room: destinationRoom,
            gridSquare: destinationGridSquare
        },
        route: steps,
        waypoints: usedWaypoints,
        navigationMode
    })
}