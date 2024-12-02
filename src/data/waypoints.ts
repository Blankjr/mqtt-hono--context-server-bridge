import { getBaseUrl } from '../utils/url'

export interface ImageItem {
    id: string
    url: string
    description: string
}

export interface TactileLandmark {
    id: string
    description: string
}

const baseUrl = getBaseUrl() + '/sample-waypoints/'

// Using the actual orientation signal names from the mock data
export const images: ImageItem[] = [
    {
        id: 'OrientierungshilfeSignal-04.2.H1-P4-Richtung-S-Bahn',
        url: `${baseUrl}e2/w1/w1-1.png`, // We'll keep using the existing images for now
        description: 'Orientierungshilfssignal zeigt Richtung S-Bahn'
    },
    {
        id: 'OrientierungshilfeSignal-04.2.H1-P4-Richtung-Strasse',
        url: `${baseUrl}e2/w1/w1-2.png`,
        description: 'Orientierungshilfssignal zeigt Richtung Straße'
    },
    {
        id: 'OrintierungshilfeSignal-04.2.H1-P4-Richtung-Campus-Zentrum',
        url: `${baseUrl}e2/w2/w2-1.png`,
        description: 'Orientierungshilfssignal zeigt Richtung Campus-Zentrum'
    },
    {
        id: 'OrientierungshilfeSignal-04.2.H1-P13-Flur-Fachschaft',
        url: `${baseUrl}e2/w2/w2-2.png`,
        description: 'Orientierungshilfssignal im Flur zur Fachschaft'
    },
    {
        id: 'OrientierungshilfeSignal-04.2.H1-P13-Flur-PC-Pool',
        url: `${baseUrl}e2/w2/w2-3.png`,
        description: 'Orientierungshilfssignal im Flur zum PC-Pool'
    },
    {
        id: 'OrientierungshilfeSignal-04.2.H1-P13-Sitzbereich',
        url: `${baseUrl}e2/w3/w3-1.png`,
        description: 'Orientierungshilfssignal am Sitzbereich'
    },
    {
        id: 'OrientierungshilfeSignal-04.2.H1-P7-Richtung-Lastenaufzug',
        url: `${baseUrl}e2/w3/w3-2.png`,
        description: 'Orientierungshilfssignal Richtung Lastenaufzug'
    },
]

// Tactile landmarks with real signal IDs
export const tactileLandmarks: TactileLandmark[] = [
    {
        id: 'OrientierungshilfeSignal-04.2.H1-P4-Richtung-S-Bahn',
        description: 'Taktiles Leitsystem zur S-Bahn mit Rillenstruktur im Boden'
    },
    {
        id: 'OrientierungshilfeSignal-04.2.H1-P4-Richtung-Strasse',
        description: 'Bodenmarkierung mit erhöhten Streifen Richtung Straße'
    },
    {
        id: 'OrintierungshilfeSignal-04.2.H1-P4-Richtung-Campus-Zentrum',
        description: 'Taktiler Pfeil in Richtung Campus-Zentrum'
    },
    {
        id: 'OrientierungshilfeSignal-04.2.H1-P13-Flur-Fachschaft',
        description: 'Handlauf mit Braille-Beschriftung zur Fachschaft'
    },
    {
        id: 'OrientierungshilfeSignal-04.2.H1-P13-Flur-PC-Pool',
        description: 'Taktile Bodenmarkierung zum PC-Pool'
    },
    {
        id: 'OrientierungshilfeSignal-04.2.H1-P13-Sitzbereich',
        description: 'Unterschiedliche Bodenbeschaffenheit markiert Sitzbereich'
    },
    {
        id: 'OrientierungshilfeSignal-04.2.H1-P7-Richtung-Lastenaufzug',
        description: 'Rillenstruktur führt zum Lastenaufzug'
    },
]