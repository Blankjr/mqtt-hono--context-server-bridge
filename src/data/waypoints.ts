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