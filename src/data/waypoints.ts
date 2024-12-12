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

export interface WaypointDetails {
    visualDescription: string;
    tactileDescription?: string;
  }
  
  export interface ColorGroupedWaypoints {
    [color: string]: {
      [gridSquare: string]: WaypointDetails;
    };
  }
  
  export const waypointsByColor: ColorGroupedWaypoints = {
    "dark-blue": {
      "04.2.H2-P4": {
        visualDescription: "dunkel blauen Wegweiser nach links folgen",
        tactileDescription: "Bodenmarkierung mit erhöhten Streifen, Links abbiegen Richtung Campus"
      },
      "04.2.H3-P2": {
        visualDescription: "dunkel blauen Wegweiser in den Zwischenflur folgen",
      },
      "04.2.H3-P3": {
        visualDescription: "dunkel blauen Wegweiser in den Zwischenflur folgen",
      }
    },
    "green": {
      "04.2.H1-P4": {
        visualDescription: "grünen Wegweiser nach rechts folgen",
      },
      "04.2.H1-P7": {
        visualDescription: "grünen Wegweiser nach rechts folgen",
      },
      "04.2.H1-P13": {
        visualDescription: "grünen Wegweiser nach rechts folgen",
      },
    },
    "light-blue": {
      "04.2.H2-P1": {
        visualDescription: "hell blauen Wegweiser nach rechts folgen",
      },
      "04.2.H3-P1": {
        visualDescription: "hell blauen Wegweiser folgen",
      },
      "04.2.H3-P3": {
        visualDescription: "hell blauen Wegweiser nach rechts folgen",
      },
      "04.2.H3-P6": {
        visualDescription: "hell blauen Wegweiser folgen",
      },
    },
    "orange": {
      "04.2.H1-P7": {
        visualDescription: "orangen Wegweiser nach links folgen",
      },
      "04.2.H1-P13": {
        visualDescription: "orangen Wegweiser nach links folgen",
      },
      "04.2.H3-P6": {
        visualDescription: "orangen Wegweiser nach rechts folgen",
      }
    },
    "red": {
      "04.2.H1-P4": {
        visualDescription: "roten Wegweiser folgen",
      },
      "04.2.H2-P1": {
        visualDescription: "roten Wegweiser nach links folgen",
      },
      "04.2.H3-P1": {
        visualDescription: "roten Wegweiser folgen",
      },
      "04.2.H3-P3": {
        visualDescription: "roten Wegweiser nach links folgen",
      }
    },
    "short-green": {
      "04.2.V1-P3": {
        visualDescription: "grünen Wegweiser nach links folgen",
      },
      "04.2.V1-P4": {
        visualDescription: "grünen Wegweiser nach rechts folgen",
      },
      "04.2.H2-P4": {
        visualDescription: "grünen Wegweiser in den Zwischenflur folgen",
      }
    },
    "yellow": {
      "04.2.H1-P7": {
        visualDescription: "gelben Wegweiser in den Zwischenflur folgen",
      },
      "04.2.H2-P4": {
        visualDescription: "gelben Wegweiser nach rechts folgen",
      }
    }
  };

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