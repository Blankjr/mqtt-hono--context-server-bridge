import { Context } from 'hono'

export interface ImageItem {
    id: string;
    url: string;
    description: string;
}

export interface RouteStep {
    x: number;
    y: number;
    waypointId?: string;
}

const images: ImageItem[] = [
    {
        id: 'mountain_lake',
        url: 'https://picsum.photos/seed/696/3000/2000',
        description: 'Eine malerische Aussicht auf eine Berglandschaft mit einem See im Vordergrund'
    },
    {
        id: 'city_street',
        url: 'https://picsum.photos/seed/697/3000/2000',
        description: 'Eine belebte Stadtstraße mit hohen Gebäuden und gehenden Menschen'
    },
    {
        id: 'flower_closeup',
        url: 'https://picsum.photos/seed/698/3000/2000',
        description: 'Eine Nahaufnahme einer farbenfrohen Blume mit Tautropfen auf ihren Blütenblättern'
    },
    {
        id: 'beach_scene',
        url: 'https://picsum.photos/seed/699/3000/2000',
        description: 'Eine friedliche Strandszene mit weißem Sand und klarem blauen Wasser'
    },
    {
        id: 'forest_aerial',
        url: 'https://picsum.photos/seed/700/3000/2000',
        description: 'Eine Luftaufnahme eines dichten Waldes mit verschiedenen Grüntönen'
    },
    {
        id: 'vintage_cafe',
        url: 'https://picsum.photos/seed/701/3000/2000',
        description: 'Ein gemütliches Cafe-Interieur mit Vintage-Möbeln und warmer Beleuchtung'
    },
    {
        id: 'waterfall',
        url: 'https://picsum.photos/seed/702/3000/2000',
        description: 'Ein majestätischer Wasserfall, der in einen türkisfarbenen Pool stürzt'
    },
    {
        id: 'winter_landscape',
        url: 'https://picsum.photos/seed/703/3000/2000',
        description: 'Eine verschneite Winterlandschaft mit schneebedeckten Bäumen und einem gefrorenen See'
    },
    {
        id: 'sunset_ocean',
        url: 'https://picsum.photos/seed/704/3000/2000',
        description: 'Ein bunter Sonnenuntergang über einem ruhigen Ozean mit Segelbooten am Horizont'
    },
    {
        id: 'ivy_wall',
        url: 'https://picsum.photos/seed/705/3000/2000',
        description: 'Eine alte, mit Efeu bewachsene Steinmauer in einem üppigen Garten'
    }
];

function getRandomSubset<T>(arr: T[], count: number): T[] {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

function generateRandomSteps(start: { x: number, y: number }, end: { x: number, y: number }, stepCount: number): RouteStep[] {
    const steps: RouteStep[] = [{ x: start.x, y: start.y }];
    const waypoints = getRandomSubset(images, Math.floor(stepCount / 2));

    for (let i = 1; i < stepCount - 1; i++) {
        const step: RouteStep = {
            x: Math.floor(Math.random() * (end.x - start.x) + start.x),
            y: Math.floor(Math.random() * (end.y - start.y) + start.y),
        };

        if (waypoints.length > 0 && Math.random() < 0.5) {
            step.waypointId = waypoints.pop()?.id;
        }

        steps.push(step);
    }

    steps.push({ x: end.x, y: end.y });
    return steps;
}

export async function handleGuideRequest(c: Context) {
    const startFloor = parseInt(c.req.query('start_floor') || '0');
    const startRoom = parseInt(c.req.query('start_room') || '0');
    const destinationFloor = parseInt(c.req.query('destination_floor') || '0');
    const destinationRoom = parseInt(c.req.query('destination_room') || '0');

    // Mock position mapping (you would replace this with actual logic)
    const start = { x: 12, y: 24 };
    const end = { x: 70, y: 50 };

    const stepCount = Math.floor(Math.random() * 9) + 2; // Random number between 2 and 10
    const route = generateRandomSteps(start, end, stepCount);

    // Simulate network delay (between 100ms and 2000ms)
    const delay = Math.floor(Math.random() * 1900) + 100;
    await new Promise(resolve => setTimeout(resolve, delay));

    return c.json({
        start: { floor: startFloor, room: startRoom },
        destination: { floor: destinationFloor, room: destinationRoom },
        route: route,
        waypoints: images
    });
}