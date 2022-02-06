export const MainScene = 'lagoon';

export const TourScenes = {
  // Starting scene
  selection: 'gate',
  assetsId: 'tour-assets',
  carMarkerForDebug: 0.32,
  color: '#000',
  density: 0.03,
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
  color: '#5e5e5e',
  density: 0.065,
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
  color: '#26537a',
  density: 0.1,
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

export const CinemaScenes = {
  // Starting scene
  selection: 'cinema',
  assetsId: 'cinema-assets',
  carMarkerForDebug: 0.32,
  color: '#000',
  density: 0.03,
  loading: {
    scene: 'loading-scene',
    camera: 'loading-scene-camera',
  },
  cinema: {
    scene: 'cinema-scene',
    camera: 'cinema-scene-camera',
    car: 'cinema-car',
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
  case 'cinema':
    selectedScenes = CinemaScenes;
    break;
}
export const Scenes = selectedScenes;
