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
        description: 'Der Orientierungspunkt befindet geradeaus am Ende des Flures'
    },
    {
        id: 'e2_w2-2',
        url: `${baseUrl}e2/w2/w2-2.png`,
        description: 'Der Orientierungspunkt befindet an der Wand, direkt vor dir.'
    },
    {
        id: 'e2_w2-3',
        url: `${baseUrl}e2/w2/w2-3.png`,
        description: 'Der Orientierungspunkt links an der Wand des Zwischenflures.'
    },
    {
        id: 'e2_w3-1',
        url: `${baseUrl}e2/w3/w3-1.png`,
        description: 'Der Orientierungspunkt befindet geradeaus am Ende des Flures'
    },
    {
        id: 'e2_w3-2',
        url: `${baseUrl}e2/w3/w3-2.png`,
        description: 'Der Orientierungspunkt befindet an der Wand, direkt vor dir.'
    },
    {
        id: 'e2_w3-3',
        url: `${baseUrl}e2/w3/w3-3.png`,
        description: 'Der Orientierungspunkt links an der Wand des Zwischenflures.'
    },
    {
        id: 'e2_w4-1',
        url: `${baseUrl}e2/w4/w4-1.png`,
        description: 'Der Orientierungspunkt befindet geradeaus, am Ende des Flures'
    },
    {
        id: 'e2_w4-2',
        url: `${baseUrl}e2/w4/w4-2.png`,
        description: 'Der Orientierungspunkt befindet an der Wand direkt vor dir.'
    },
    {
        id: 'e2_w5-1',
        url: `${baseUrl}e2/w5/w5-1.png`,
        description: 'Der Orientierungspunkt links an der Wand des Zwischenflures.'
    },
    {
        id: 'e2_w5-2',
        url: `${baseUrl}e2/w5/w5-2.png`,
        description: 'Der Orientierungspunkt befindet geradeaus, am Ende des Flures'
    },
    // {
    //     id: 'mountain_lake',
    //     url: 'https://picsum.photos/seed/696/3000/2000',
    //     description: 'Eine malerische Aussicht auf eine Berglandschaft mit einem See im Vordergrund'
    // },
    // {
    //     id: 'city_street',
    //     url: 'https://picsum.photos/seed/697/3000/2000',
    //     description: 'Eine belebte Stadtstraße mit hohen Gebäuden und gehenden Menschen'
    // },
    // {
    //     id: 'flower_closeup',
    //     url: 'https://picsum.photos/seed/698/3000/2000',
    //     description: 'Eine Nahaufnahme einer farbenfrohen Blume mit Tautropfen auf ihren Blütenblättern'
    // },
    // {
    //     id: 'beach_scene',
    //     url: 'https://picsum.photos/seed/699/3000/2000',
    //     description: 'Eine friedliche Strandszene mit weißem Sand und klarem blauen Wasser'
    // },
    // {
    //     id: 'forest_aerial',
    //     url: 'https://picsum.photos/seed/700/3000/2000',
    //     description: 'Eine Luftaufnahme eines dichten Waldes mit verschiedenen Grüntönen'
    // },
    // {
    //     id: 'vintage_cafe',
    //     url: 'https://picsum.photos/seed/701/3000/2000',
    //     description: 'Ein gemütliches Cafe-Interieur mit Vintage-Möbeln und warmer Beleuchtung'
    // },
    // {
    //     id: 'waterfall',
    //     url: 'https://picsum.photos/seed/702/3000/2000',
    //     description: 'Ein majestätischer Wasserfall, der in einen türkisfarbenen Pool stürzt'
    // },
    // {
    //     id: 'winter_landscape',
    //     url: 'https://picsum.photos/seed/703/3000/2000',
    //     description: 'Eine verschneite Winterlandschaft mit schneebedeckten Bäumen und einem gefrorenen See'
    // },
    // {
    //     id: 'sunset_ocean',
    //     url: 'https://picsum.photos/seed/704/3000/2000',
    //     description: 'Ein bunter Sonnenuntergang über einem ruhigen Ozean mit Segelbooten am Horizont'
    // },
    // {
    //     id: 'ivy_wall',
    //     url: 'https://picsum.photos/seed/705/3000/2000',
    //     description: 'Eine alte, mit Efeu bewachsene Steinmauer in einem üppigen Garten'
    // }
];
const tactileLandmarks: TactileLandmark[] = [
    {
        id: 'handrail_main',
        description: 'Ein durchgehender Handlauf an der rechten Wand, aus glattem Metall, leicht gewärmt durch die Heizung darunter'
    },
    {
        id: 'floor_transition',
        description: 'Übergang von Teppich zu strukturiertem Vinylboden, deutlich spürbare Kante mit Metallschiene'
    },
    {
        id: 'corner_guard',
        description: 'Abgerundete Eckenschutz aus Kunststoff, vertikal verlaufend, etwa in Schulterhöhe tastbar'
    },
    {
        id: 'braille_sign',
        description: 'Braille-Schild rechts neben der Tür, auf Griffhöhe montiert, enthält Raumnummer und Funktionsbeschreibung'
    },
    {
        id: 'textured_strip',
        description: 'Taktiler Bodenstreifen mit Rippenstruktur, führt direkt zum Haupteingang des Gebäudeflügels'
    },
    {
        id: 'column_marker',
        description: 'Runde Säule mit strukturierter Oberfläche, markiert wichtige Kreuzungspunkte im Gang'
    },
    {
        id: 'door_handle',
        description: 'Schwerer Metallgriff mit charakteristischer L-Form, federt beim Herunterdrücken leicht nach oben'
    },
    {
        id: 'elevator_panel',
        description: 'Aufzugsbedienfeld mit erhöhten Tasten und Braille-Beschriftung, Summer ertönt bei Tastendruck'
    },
    {
        id: 'bench_alcove',
        description: 'Holzbank in einer Wandnische, glatt lackierte Oberfläche, etwa kniehoch, mit Armlehnen an beiden Seiten'
    },
    {
        id: 'water_fountain',
        description: 'Trinkbrunnen aus gebürstetem Edelstahl, Bedienknopf an der Vorderseite deutlich hervorstehend'
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