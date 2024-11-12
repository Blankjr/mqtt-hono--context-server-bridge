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
    x: number;
    y: number;
    waypointId?: string;
}

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

function generateRandomSteps(
    start: { x: number, y: number },
    end: { x: number, y: number },
    stepCount: number,
    navigationMode: 'visual' | 'tactile'
): { steps: RouteStep[], usedWaypoints: (ImageItem | TactileLandmark)[] } {
    const steps: RouteStep[] = [{ x: start.x, y: start.y }];
    const waypointPool = navigationMode === 'visual' ? images : tactileLandmarks;
    const selectedWaypoints = getRandomSubset(waypointPool, Math.floor(stepCount / 2));
    const usedWaypoints: (ImageItem | TactileLandmark)[] = [];

    for (let i = 1; i < stepCount - 1; i++) {
        const step: RouteStep = {
            x: Math.floor(Math.random() * (end.x - start.x) + start.x),
            y: Math.floor(Math.random() * (end.y - start.y) + start.y),
        };

        if (selectedWaypoints.length > 0 && Math.random() < 0.5) {
            const waypoint = selectedWaypoints.pop()!;
            step.waypointId = waypoint.id;
            usedWaypoints.push(waypoint);
        }

        steps.push(step);
    }

    steps.push({ x: end.x, y: end.y });
    return { steps, usedWaypoints };
}

export async function handleGuideRequest(c: Context) {
    const startFloor = parseInt(c.req.query('start_floor') || '0');
    const startRoom = parseInt(c.req.query('start_room') || '0');
    const destinationFloor = parseInt(c.req.query('destination_floor') || '0');
    const destinationRoom = parseInt(c.req.query('destination_room') || '0');
    const navigationMode = c.req.query('mode') === 'tactile' ? 'tactile' : 'visual';

    // Mock position mapping (you would replace this with actual logic)
    const start = { x: 12, y: 24 };
    const end = { x: 70, y: 50 };

    const stepCount = Math.floor(Math.random() * 9) + 2; // Random number between 2 and 10
    const { steps, usedWaypoints } = generateRandomSteps(start, end, stepCount, navigationMode);

    // Simulate network delay (between 100ms and 2000ms)
    const delay = Math.floor(Math.random() * 1900) + 100;
    await new Promise(resolve => setTimeout(resolve, delay));

    return c.json({
        start: { floor: startFloor, room: startRoom },
        destination: { floor: destinationFloor, room: destinationRoom },
        route: steps,
        waypoints: usedWaypoints,
        navigationMode
    });
}