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
    floors: {
        "04.0.H3-P7": {
            visualDescription: "Fahrstuhl zu Etage 2 nehmen",
            tactileDescription: "Fahrstuhl zu Etage 2 nehmen. Vom Eingang aus gesehn rechts 15 Meter entfernt befinden sich 2 Aufzüge nebeneinander."
        },
        "04.1.H3-P7": {
            visualDescription: "Fahrstuhl zu Etage 2 nehmen",
            tactileDescription: "Fahrstuhl zu Etage 2 nehmen. In diesem Bereich befinden  sich außen auf der einen Seite viele Stühle und Tische nutze die Innenseite um bis zum Fahrstuhl hinter dem letzten Flur zu navigieren."
        },
        "04.3.H3-P7": {
            visualDescription: "Fahrstuhl zu Etage 2 nehmen",
            tactileDescription: "Fahrstuhl zu Etage 2 nehmen. Vorsicht auf der gegenüberliegenden Seite befinden sich Sitzgelegenheiten als Hindernis."
        }
    },
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
    "green-long": {
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
      "04.2.V3-P4": {
        visualDescription: "orangen Wegweiser nach rechts folgen",
        tactileDescription: "Finde die innere Wand wenige Meter vor dir und folge dann den Flur nach rechts. Jetzt gerade aus gehen. Vorsichtig in 2 Meter befindet sich eine Tür. Im Anschluss den Weg gerade aus folgen.",
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
    "green-short": {
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