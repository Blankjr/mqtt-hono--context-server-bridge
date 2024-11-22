import { Context } from 'hono'
import { getBaseUrl } from './utils/url';

export interface ImageItem {
    id: string;
    url: string;
    description: string;
}

export interface TactileLandmark {
    id: string;
    description: string;
}

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

const baseUrl = getBaseUrl() + '/sample-waypoints/'
const images: ImageItem[] = [
    {
        id: 'e2_w1-1',
        url: `${baseUrl}e2/w1/w1-1.png`,
        description: 'Der Orientierungspunkt befindet sich auf der linken Seite'
    },
    {
        id: 'e2_w1-1',
        url: `${baseUrl}e2/w1/w1-2.png`,
        description: 'der Orientierungspunkt befindet sich auf der rechten Seite'
    },
    {
        id: 'e2_w2-1',
        url: `${baseUrl}e2/w2/w2-1.png`,
        description: 'Der Orientierungspunkt befindet sich geradeaus am Ende des Flures'
    },
    {
        id: 'e2_w2-2',
        url: `${baseUrl}e2/w2/w2-2.png`,
        description: 'Der Orientierungspunkt befindet sich an der Wand, direkt vor dir.'
    },
    {
        id: 'e2_w2-3',
        url: `${baseUrl}e2/w2/w2-3.png`,
        description: 'Der Orientierungspunkt befindet sich links an der Wand des Zwischenflures.'
    },
    {
        id: 'e2_w3-1',
        url: `${baseUrl}e2/w3/w3-1.png`,
        description: 'Der Orientierungspunkt befindet sich geradeaus am Ende des Flures'
    },
    {
        id: 'e2_w3-2',
        url: `${baseUrl}e2/w3/w3-2.png`,
        description: 'Der Orientierungspunkt befindet sich an der Wand, direkt vor dir.'
    },
    {
        id: 'e2_w3-3',
        url: `${baseUrl}e2/w3/w3-3.png`,
        description: 'Der Orientierungspunkt befindet sich links an der Wand des Zwischenflures.'
    },
    {
        id: 'e2_w4-1',
        url: `${baseUrl}e2/w4/w4-1.png`,
        description: 'Der Orientierungspunkt befindet sich geradeaus, am Ende des Flures'
    },
    {
        id: 'e2_w4-2',
        url: `${baseUrl}e2/w4/w4-2.png`,
        description: 'Der Orientierungspunkt befindet sich an der Wand direkt vor dir.'
    },
    {
        id: 'e2_w5-1',
        url: `${baseUrl}e2/w5/w5-1.png`,
        description: 'Der Orientierungspunkt befindet sich links an der Wand des Zwischenflures.'
    },
    {
        id: 'e2_w5-2',
        url: `${baseUrl}e2/w5/w5-2.png`,
        description: 'Der Orientierungspunkt befindet sich geradeaus, am Ende des Flures'
    },
];
const tactileLandmarks: TactileLandmark[] = [
    {
        id: 'treppengelaender',
        description: 'Durchgehendes Treppengeländer aus geriffeltem Edelstahl, leicht gekühlt, mit taktilen Stockwerkmarkierungen alle 15 Stufen'
    },
    {
        id: 'eingangsbereich_matte',
        description: 'Großflächige Gummimatte mit erhöhten Noppen, deutlich vom glatten Steinboden unterscheidbar, signalisiert den Haupteingang'
    },
    {
        id: 'richtungsanzeiger',
        description: 'Metallener Pfeil, 3cm erhaben, weist nach rechts zum Seminarraum, Oberfläche durch häufige Berührung leicht geglättet'
    },
    {
        id: 'raumtrenner',
        description: 'Hüfthohe Glastrennwand mit durchgehendem Holzrahmen, warme Holzoberfläche dient als Orientierungshilfe im Foyer'
    },
    {
        id: 'notausgang_markierung',
        description: 'Breiter Streifen mit grober Riffelung im Boden, führt diagonal zum Notausgang, deutlich spürbar durch Schuhsohlen'
    },
    {
        id: 'serviceschalter',
        description: 'Niedriger Holztresen mit abgerundeten Ecken, Oberfläche leicht strukturiert, Klingel mit großem gummiertem Taster rechts'
    },
    {
        id: 'garderobe_element',
        description: 'Wandmontierte Kleiderhaken aus Metall, gleichmäßig angeordnet, jeweils 20cm voneinander entfernt, auf Schulterhöhe'
    },
    {
        id: 'bibliothek_eingang',
        description: 'Schwere Holztür mit charakteristischer Schnitzerei, griffgünstige Mulde statt konventionellem Türgriff'
    },
    {
        id: 'sanitaer_wegweiser',
        description: 'Taktiles Leitsystem mit gerillter Oberfläche, führt zu den Sanitäranlagen, Rillen verlaufen parallel zur Laufrichtung'
    },
    {
        id: 'aufenthaltsraum_sofa',
        description: 'Großes Sofa mit samtiger Stoffbezug, markiert durch einen weichen Teppich davor, erste Sitzgelegenheit im Aufenthaltsraum'
    },
    {
        id: 'akustik_orientierung',
        description: 'Wasserspiel an der Wand erzeugt konstantes Plätschern, dient als akustischer Orientierungspunkt in der Eingangshalle'
    },
    {
        id: 'handlauf_kurve',
        description: 'Ergonomisch geformter Handlauf macht eine sanfte 90-Grad-Kurve, Richtungswechsel durch taktile Markierung angekündigt'
    },
    {
        id: 'rezeption_pult',
        description: 'Rezeptionstresen mit warmer Holzoberfläche, vordere Kante abgerundet und mit Leder gepolstert, höhenverstellbar'
    },
    {
        id: 'seminarraum_tuer',
        description: 'Doppelflügelige Tür mit strukturierter Holzmaserung, beidseitig montierte Stoßgriffe mit rutschfester Gummieinlage'
    },
    {
        id: 'boden_markierung',
        description: 'Kreisförmige Metallplatte im Boden, 30cm Durchmesser, leicht erhaben, markiert wichtige Abzweigung zu den Hörsälen'
    }
];

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