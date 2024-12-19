import { Context } from 'hono'
import { getBaseUrl } from './utils/url'
import { waypointsByColor } from './data/waypoints'

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
  "light-blue": ["H3-P6", "H3-P5", "H3-P4", "H3-P3", "H3-P2", "H3-P1", "V1-P5", "V1-P4", "H1-P1", "V1-P3", "V1-P2", "V1-P1", "H1-P4"],
  "red": ["H1-P4", "V1-P1", "V1-P2", "V1-P3", "H1-P1", "V1-P4", "V1-P5", "H3-P1", "H3-P2", "H3-P3", "H3-P4", "H3-P5", "H3-P6"]
}

// Map user-friendly names to specific room numbers
function mapUserRequestToRoom(roomType: string): string {
  const roomMapping: { [key: string]: string } = {
    'labor-interaktive-systeme': '04.2.001',
    'labor-mixed-reality': '04.2.003',
    'labor-computergrafik': '04.2.012',
    'labor-it-sicherheit': '04.2.014',
    'labor-multimedia-kommunikation': '04.2.015',
    'labor-webtechnologie': '04.2.016',
    'seminar-raum': '04.2.017',
    'labor-digitaltechnik': '04.2.019',
    'labor-datenbanken': '04.2.021',
    'lernraum': '04.2.022',
    'labor-av-produktion': '04.2.023',
    'sitzungs-raum': '04.2.025',
    'labor-mediengestaltung': '04.2.026',
    'pc-pool': '04.2.028',
    'fachschaft': '04.2.029',
    'wc': '04.2.031',
    'toilette': '04.2.031',
    'lehrbeauftragte': '04.2.040',
    'server-raum': '04.2.043'
  };

  return roomMapping[roomType.toLowerCase()] || '';
}

function constructWaypointUrl(type: string, gridSquare: string): string {
  const baseUrl = getBaseUrl();
  if (gridSquare.startsWith('04.0.') || gridSquare.startsWith('04.1.') || gridSquare.startsWith('04.3.')) {
    return `${baseUrl}/waypoints/floors/${gridSquare}.jpg`;
  }
  return `${baseUrl}/waypoints/${type}/${gridSquare}.jpg`;
}

function findWaypointsForRouteFromColors(
  lineDirections: Record<string, string[]>,
  route: RouteStep[],
  startGridSquare: string
): { id: string; description: string; url: string }[] {
  const usedWaypoints: { id: string; description: string; url: string }[] = [];
  const seenWaypoints = new Set<string>();

  // Add elevator waypoint if starting from another floor
  if (startGridSquare.match(/^04\.[013]\.H3-P7$/)) {
    usedWaypoints.push({
      id: startGridSquare,
      description: waypointsByColor.floors[startGridSquare].visualDescription,
      url: constructWaypointUrl('floors', startGridSquare)
    });
    seenWaypoints.add(startGridSquare);
  }

  // Go through route steps in order
  route.forEach(step => {
    Object.entries(lineDirections).forEach(([color, gridSquares]) => {
      if (!gridSquares.includes(step.gridSquare)) return;

      const lookupColor = color === 'green-short-reverse' ? 'green-short' : color;
      const colorWaypoints = waypointsByColor[lookupColor];

      if (!colorWaypoints || seenWaypoints.has(step.gridSquare)) return;

      if (colorWaypoints[step.gridSquare]) {
        usedWaypoints.push({
          id: step.gridSquare,
          description: colorWaypoints[step.gridSquare].visualDescription,
          url: constructWaypointUrl(lookupColor, step.gridSquare)
        });
        seenWaypoints.add(step.gridSquare);
      }
    });
  });

  return usedWaypoints;
}

function findColoredLines(route: any[]): Record<string, string[]> {
  const lineDirections: Record<string, string[]> = {};
  const lineOrder: string[] = [];
  const gridSquares = route.map(r => r.name.replace('04.2.', ''));

  for (let i = 0; i < gridSquares.length - 1; i++) {
    const current = gridSquares[i];
    const next = gridSquares[i + 1];

    for (const [color, lineRoute] of Object.entries(coloredRoutes)) {
      for (let j = 0; j < lineRoute.length - 1; j++) {
        if (lineRoute[j] === current && lineRoute[j + 1] === next) {
          if (!lineDirections[color]) {
            lineDirections[color] = [];
            lineOrder.push(color);
          }
          lineDirections[color].push(`04.2.${current}`);
          lineDirections[color].push(`04.2.${next}`);
          break;
        }
      }
    }
  }

  // Remove duplicates while maintaining order
  Object.keys(lineDirections).forEach(color => {
    lineDirections[color] = [...new Set(lineDirections[color])];
  });

  const orderedLineDirections: Record<string, string[]> = {};
  // Use a Set to track seen colors to avoid duplicates
  const seenColors = new Set<string>();

  // First add colors in the order they were found
  lineOrder.forEach(color => {
    if (!seenColors.has(color)) {
      orderedLineDirections[color] = lineDirections[color];
      seenColors.add(color);
    }
  });

  return orderedLineDirections;
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
    // Determine if we're starting from another floor
    const isStartingFromOtherFloor = startGridSquare.match(/^04\.[013]\.H3-P7$/);
    const actualStartGridSquare = isStartingFromOtherFloor ? '04.2.H3-P7' : startGridSquare;

    // Get route from floor 2 start point to destination
    const params = new URLSearchParams();
    params.append('application', 'visitor');
    params.append('situation', 'KurzesterWeg');
    params.append('query', 'KurzesterWeg');
    params.append('part_StartPlanquadrat', JSON.stringify({ name: actualStartGridSquare }));
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

    // Create complete route steps including elevator if needed
    let routeSteps = route.map((gridSquare: { name: string }) => ({
      gridSquare: gridSquare.name,
      waypointId: undefined
    }));

    if (isStartingFromOtherFloor) {
      // Add elevator step at the beginning
      routeSteps = [
        {
          gridSquare: startGridSquare,
          waypointId: startGridSquare
        },
        ...routeSteps
      ];
    }

    const lineDirections = findColoredLines(route);
    const waypointInfo = findWaypointsForRouteFromColors(lineDirections, routeSteps, startGridSquare);

    // Update route steps with waypoint information
    routeSteps.forEach(step => {
      const matchingWaypoint = waypointInfo.find(w => w.id === step.gridSquare);
      if (matchingWaypoint) {
        step.waypointId = matchingWaypoint.id;
      }
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