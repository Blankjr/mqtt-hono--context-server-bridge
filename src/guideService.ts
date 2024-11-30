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

export interface RouteStep {
    gridSquare: string
    waypointId?: string
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
}

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

        // Store 010 route separately
        mockContextResponses["04.2.010"] = route010.default

        // Use 022 route as default for all other rooms
        const validRooms = Object.keys(roomToGridMap)
        for (const room of validRooms) {
            if (room !== "04.2.010") {
                mockContextResponses[room] = route022.default
            }
        }
    } catch (error) {
        console.error('Failed to load mock responses:', error)
    }
}

function getRandomSubset<T>(arr: T[], count: number): T[] {
    const shuffled = [...arr].sort(() => 0.5 - Math.random())
    return shuffled.slice(0, count)
}

function extractRouteFromContextResponse(response: ContextResponse): string[] {
    // Extract grid squares from the relations, maintaining order
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


function generateRoute(
    startGridSquare: string,
    contextResponse: ContextResponse,
    navigationMode: 'visual' | 'tactile'
): { steps: RouteStep[], usedWaypoints: (ImageItem | TactileLandmark)[] } {
    const gridSquares = extractRouteFromContextResponse(contextResponse)

    // Ensure the route starts with the given start grid
    if (gridSquares[0] !== startGridSquare) {
        gridSquares.unshift(startGridSquare)
    }

    const waypointPool = navigationMode === 'visual' ? images : tactileLandmarks
    const selectedWaypoints = getRandomSubset(waypointPool, Math.floor(gridSquares.length / 2))
    const usedWaypoints: (ImageItem | TactileLandmark)[] = []

    const steps: RouteStep[] = gridSquares.map(gridSquare => {
        const step: RouteStep = { gridSquare }

        if (selectedWaypoints.length > 0 && Math.random() < 0.5) {
            const waypoint = selectedWaypoints.pop()!
            step.waypointId = waypoint.id
            usedWaypoints.push(waypoint)
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

    // Get route from context server (currently using mock data)
    const contextResponse = mockContextResponses[destinationRoom]

    if (!contextResponse) {
        return c.json({ error: 'Route not found for destination' }, 404)
    }

    const { steps, usedWaypoints } = generateRoute(startGridSquare, contextResponse, navigationMode)

    // Simulate network delay
    //const delay = Math.floor(Math.random() * 1900) + 100
    //await new Promise(resolve => setTimeout(resolve, delay))

    return c.json({
        start: {
            gridSquare: startGridSquare
        },
        destination: {
            room: destinationRoom,
            gridSquare: roomToGridMap[destinationRoom]
        },
        route: steps,
        waypoints: usedWaypoints,
        navigationMode
    })
}