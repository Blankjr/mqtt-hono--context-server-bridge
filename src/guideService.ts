import { Context } from 'hono'

export interface ImageItem {
    url: string;
    description: string;
}

const images: ImageItem[] = [
    {
        url: 'https://picsum.photos/seed/696/3000/2000',
        description: 'Eine malerische Aussicht auf eine Berglandschaft mit einem See im Vordergrund'
    },
    {
        url: 'https://picsum.photos/seed/697/3000/2000',
        description: 'Eine belebte Stadtstraße mit hohen Gebäuden und gehenden Menschen'
    },
    {
        url: 'https://picsum.photos/seed/698/3000/2000',
        description: 'Eine Nahaufnahme einer farbenfrohen Blume mit Tautropfen auf ihren Blütenblättern'
    },
    {
        url: 'https://picsum.photos/seed/699/3000/2000',
        description: 'Eine friedliche Strandszene mit weißem Sand und klarem blauen Wasser'
    },
    {
        url: 'https://picsum.photos/seed/700/3000/2000',
        description: 'Eine Luftaufnahme eines dichten Waldes mit verschiedenen Grüntönen'
    },
    {
        url: 'https://picsum.photos/seed/701/3000/2000',
        description: 'Ein gemütliches Cafe-Interieur mit Vintage-Möbeln und warmer Beleuchtung'
    },
    {
        url: 'https://picsum.photos/seed/702/3000/2000',
        description: 'Ein majestätischer Wasserfall, der in einen türkisfarbenen Pool stürzt'
    },
    {
        url: 'https://picsum.photos/seed/703/3000/2000',
        description: 'Eine verschneite Winterlandschaft mit schneebedeckten Bäumen und einem gefrorenen See'
    },
    {
        url: 'https://picsum.photos/seed/704/3000/2000',
        description: 'Ein bunter Sonnenuntergang über einem ruhigen Ozean mit Segelbooten am Horizont'
    },
    {
        url: 'https://picsum.photos/seed/705/3000/2000',
        description: 'Eine alte, mit Efeu bewachsene Steinmauer in einem üppigen Garten'
    }
];

function getRandomSubset<T>(arr: T[], min: number, max: number): T[] {
    const count = Math.floor(Math.random() * (max - min + 1)) + min;
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

export async function handleGuideRequest(c: Context) {
    const guideItems = getRandomSubset(images, 1, 5);

    // Simulate occasional server errors (10% chance)
    // if (Math.random() < 0.1) {
    //     return c.json({ error: 'Internal Server Error' }, 500);
    // }

    // Simulate network delay (between 100ms and 2000ms)
    const delay = Math.floor(Math.random() * 1900) + 100;
    await new Promise(resolve => setTimeout(resolve, delay));

    return c.json(guideItems);;
}