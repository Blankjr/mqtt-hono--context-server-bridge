import { getBaseUrl } from '../utils/url';

export interface ImageItem {
    id: string;
    url: string;
    description: string;
}

export interface TactileLandmark {
    id: string;
    description: string;
}


const baseUrl = getBaseUrl() + '/sample-waypoints/'
export const images: ImageItem[] = [
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
export const tactileLandmarks: TactileLandmark[] = [
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