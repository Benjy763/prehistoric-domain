export const MainScene = 'swamp';

export const TourScenes = {
  // Starting scene
  mobileCompatible: false,
  selection: 'gate',
  assetsId: 'tour-assets',
  carMarkerForDebug: 0.7,
  color: '#000',
  density: 0.025,
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
  mobileCompatible: true,
  selection: 'aviary',
  assetsId: 'aviary-assets',
  carMarkerForDebug: 0.32,
  color: '#5e5e5e',
  density: 0.048,
  canWalk: true,
  walkBounds: {
    x: [-1.54, 2.024],
    z: [-0.82, 2.35],
  },
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
  mobileCompatible: true,
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
  mobileCompatible: true,
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

export const SwampScenes = {
  // Starting scene
  mobileCompatible: true,
  selection: 'sarco',
  assetsId: 'swamp-assets',
  carMarkerForDebug: 0.32,
  color: '#5e5e5e',
  density: 0.05,
  canWalk: true,
  walkBounds: {
    x: [-2.6, 2.2],
    z: [-5, 4],
  },
  loading: {
    scene: 'loading-scene',
    camera: 'loading-scene-camera',
  },
  spino: {
    scene: 'spino-scene',
    camera: 'spino-scene-camera',
    car: 'spino-car',
    carReference: null,
    rigPos: {
      // First in value in VR and second without
      x: [-2, 1],
      y: [-0.7, -0.3],
      z: [1, 0],
    },
  },
  sarco: {
    scene: 'sarco-scene',
    camera: 'sarco-scene-camera',
    car: 'sarco-car',
    carReference: null,
    rigPos: {
      // First in value in VR and second without
      x: [-2, 1],
      y: [-0.7, -0.3],
      z: [1, 0],
    },
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
  case 'swamp':
    selectedScenes = SwampScenes;
    break;
}
export const Scenes = selectedScenes;
