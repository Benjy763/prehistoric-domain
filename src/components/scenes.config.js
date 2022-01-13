export const MainScene = 'tour';

export const TourScenes = {
  // Starting scene
  selection: 'gate',
  assetsId: 'tour-assets',
  carMarkerForDebug: 0.32,
  loading: {
    scene: 'loading-scene',
    camera: 'loading-scene-camera',
  },
  gate: {
    scene: 'gate-scene',
    camera: 'gate-scene-camera',
    car: 'gate-car',
    carReference: null,
  },
  dilo: {
    scene: 'dilo-scene',
    camera: 'dilo-scene-camera',
    car: 'dilo-car',
    carReference: null,
  },
  trex: {
    scene: 'trex-scene',
    camera: 'trex-scene-camera',
    car: 'trex-car',
    carReference: null,
  },
  raptor: {
    scene: 'raptor-scene',
    camera: 'raptor-scene-camera',
    car: 'raptor-car',
    carReference: null,
  },
  trice: {
    scene: 'trice-scene',
    camera: 'trice-scene-camera',
    car: 'trice-car',
    carReference: null,
  },
  ending: {
    scene: 'ending-scene',
    camera: 'ending-scene-camera',
    car: 'ending-car',
    carReference: null,
  },
};

export const AviaryScenes = {
  // Starting scene
  selection: 'aviary',
  assetsId: 'aviary-assets',
  carMarkerForDebug: 0.32,
  loading: {
    scene: 'loading-scene',
    camera: 'loading-scene-camera',
  },
  aviary: {
    scene: 'aviary-scene',
    camera: 'aviary-scene-camera',
    car: 'aviary-car',
    carReference: null,
  },
  ending: {
    scene: 'ending-scene',
    camera: 'ending-scene-camera',
    car: 'ending-car',
    carReference: null,
  },
};

export const LagoonScenes = {
  // Starting scene
  selection: 'lagoon',
  assetsId: 'lagoon-assets',
  carMarkerForDebug: 0.32,
  loading: {
    scene: 'loading-scene',
    camera: 'loading-scene-camera',
  },
  lagoon: {
    scene: 'lagoon-scene',
    camera: 'lagoon-scene-camera',
    car: 'lagoon-car',
    carReference: null,
  },
  ending: {
    scene: 'ending-scene',
    camera: 'ending-scene-camera',
    car: 'ending-car',
    carReference: null,
  },
};

// Main Scenes
let selectedScenes;
switch (MainScene) {
  case 'tour':
    selectedScenes = TourScenes;
    break;
  case 'aviary':
    selectedScenes = AviaryScenes;
    break;
  case 'lagoon':
    selectedScenes = LagoonScenes;
    break;
}
export const Scenes = selectedScenes;
