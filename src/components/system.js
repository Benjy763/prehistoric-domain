AFRAME.registerSystem('game', {
  schema: {},
  init: function () {
    this.scenes = {
      loading: {
        scene: 'loading-scene',
        camera: 'loading-scene-camera',
      },
      trex: {
        scene: 'trex-scene',
        camera: 'trex-scene-camera',
        car: 'trex-car',
      },
      gate: {
        scene: 'gate-scene',
        camera: 'gate-scene-camera',
        car: 'gate-car',
      },
    };
    this.firstScene = 'trex';
    this.actuelScene = 'trex';
    this.loadingAssets();
  },
  log: function (text) {
    document
      .querySelector('#log')
      .setAttribute('text', { value: text, color: 'white', width: 0.5 });
  },
  displayScene: function () {
    // Hide vr button and laoding static screen
    document.querySelector('.a-enter-vr').style.display = 'none';
    document.getElementById('static-loading').style.display = 'none';

    // Display camera
    this.disableAllCameras();
    document
      .getElementById(this.scenes[this.firstScene].camera)
      .setAttribute('camera', { far: 200, active: true });

    // Display scene
    document.getElementById('loading-scene').setAttribute('visible', 'false');
    document
      .getElementById(this.scenes[this.firstScene].scene)
      .setAttribute('visible', 'true');
  },
  changeScene: function (sceneId) {
    // change scene
    document
      .getElementById(this.scenes[this.actuelScene].scene)
      .setAttribute('visible', 'false');
    document
      .getElementById(this.scenes[sceneId].scene)
      .setAttribute('visible', 'true');

    // change camera
    this.disableAllCameras();
    document
      .getElementById(this.scenes[sceneId].camera)
      .setAttribute('camera', { far: 200, active: true });

    // Register new scene
    this.actuelScene = sceneId;

    // Rendering scene
    this.renderingScene(sceneId);
  },
  loadingAssets: function () {
    // Load asset
    document.querySelector('a-assets').addEventListener('loaded', () => {
      // Preloading
      setTimeout(() => {
        // Press start
        document.querySelector('.a-enter-vr').style.display = 'flex';
        document.getElementById('put-headset').style.color = 'white';

        //Init Game
        this.startListener();
      }, 2000);
    });
  },
  disableAllCameras: function () {
    Object.keys(this.scenes).forEach((sceneId) => {
      document
        .getElementById(this.scenes[sceneId].camera)
        .setAttribute('camera', 'active', false);
    });
  },
  renderingScene: function (sceneId) {
    // Select car to launch event
    const car = document.getElementById(this.scenes[sceneId].car);

    // Lauch the scene after the rendering time
    document.getElementById('rendering').setAttribute('visible', 'true');
    setTimeout(() => {
      document.getElementById('rendering').setAttribute('visible', 'false');
      const event = new Event('start');
      if (car) {
        car.dispatchEvent(event);
      }
    }, 30000);
    // document.querySelector('a-scene').addEventListener('loaded', () => {
    //   document.getElementById('rendering').setAttribute('visible', 'false');
    //   const event = new Event('start');
    //   if (car) {
    //     car.dispatchEvent(event);
    //   }
    // });
  },
  startListener: function () {
    document.addEventListener('keyup', (e) => {
      // Start tour
      if (e.keyCode == 32) {
        // Display scene
        this.displayScene();
        // Rendering scene
        this.renderingScene(this.firstScene);
      }

      const car = document.querySelector('#trex-car');
      // Commands for testing
      // Play/pause game
      if (e.keyCode == 80) {
        car.setAttribute('trex-car-tour', {
          carMarker: car.getAttribute('trex-car-tour').carMarker,
          carSpeed:
            !car.getAttribute('trex-car-tour').carSpeed ||
            car.getAttribute('trex-car-tour').carSpeed == 0
              ? car.getAttribute('trex-car-tour').normalSpeed
              : 0,
        });
      }
      // Go to position
      if (e.keyCode == 13) {
        car.setAttribute('trex-car-tour', {
          carMarker: 0.52, // Specific position
          carSpeed: car.getAttribute('trex-car-tour').carSpeed,
        });
      }
    });
  },
  // ----- Curve functions --------
  convertPosition: function (position2D, ypos) {
    return {
      x: position2D.x,
      y: ypos, // Must not move
      z: position2D.y,
    };
  },
  truncMarker: function (carMarker) {
    return Math.trunc(carMarker * 1000);
  },
});
