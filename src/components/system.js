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
    this.tourStarted = false;
    this.console = document.querySelector('a-scene').systems['console'];
    this.loadingAssets();

    // Debug events
    this.startListener();
  },
  log: function (text) {
    document
      .querySelector('#log')
      .setAttribute('text', { value: text, color: 'white', width: 0.5 });
  },
  initClickEvents: function () {
    document.getElementById('enter-vr').onclick = () => {
      // Remove loading interface
      document.getElementById('static-loading').style.display = 'none';
      // Add scene screen
      document.getElementById('main-scene-wrapper').style.zIndex = '9999';
      // Show console interface
      document.getElementById('console').style.display = 'block';
    };

    document.getElementById('start-tour').onclick = () => {
      if (this.tourStarted) {
        return;
      }
      // Init console
      this.console.initTour();
      setTimeout(() => {
        // Display scene
        this.displayScene();
        // Rendering scene
        this.renderingScene(this.firstScene);
      }, 1000);
      this.tourStarted = true;
    };
  },
  displayScene: function () {
    // Hide vr button and loading static screen
    document.querySelector('#enter-vr').style.display = 'none';

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
        document.getElementById('loading-logo').style.display = 'none';
        document.getElementById('put-headset').style.display = 'block';
        document.getElementById('enter-vr').style.display = 'block';

        this.initClickEvents();
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
  },
  startListener: function () {
    // ----- Section for debug events -----
    document.addEventListener('keyup', (e) => {
      // Start tour in debug mode with key 8 (display in navigator)
      if (e.keyCode == 56) {
        // Remove interface to see vr display
        document.getElementById('static-loading').style.display = 'none';
        // Add scene screen
        document.getElementById('main-scene-wrapper').style.zIndex = '9999';
        // Remove embedded for debug
        document.getElementById('main-scene-wrapper').embedded = false;
        // Remove windows for debug
        document
          .getElementById('main-scene-wrapper')
          .classList.remove('scene-wrapper');
        // Display scene
        this.displayScene();
        // Rendering scene
        this.renderingScene(this.firstScene);
      }
      // Display console screen in debug mode with key 9
      if (e.keyCode == 57) {
        // Remove loading interface
        document.getElementById('static-loading').style.display = 'none';
        // Add scene screen
        document.getElementById('main-scene-wrapper').style.zIndex = '9999';
        // Show console interface
        document.getElementById('console').style.display = 'block';
      }

      // ----- Old debug section -----
      // const car = document.querySelector('#trex-car');
      // // Commands for testing
      // // Play/pause game
      // if (e.keyCode == 80) {
      //   car.setAttribute('trex-car-tour', {
      //     carMarker: car.getAttribute('trex-car-tour').carMarker,
      //     carSpeed:
      //       !car.getAttribute('trex-car-tour').carSpeed ||
      //       car.getAttribute('trex-car-tour').carSpeed == 0
      //         ? car.getAttribute('trex-car-tour').normalSpeed
      //         : 0,
      //   });
      // }
      // // Go to position
      // if (e.keyCode == 13) {
      //   car.setAttribute('trex-car-tour', {
      //     carMarker: 0.52, // Specific position
      //     carSpeed: car.getAttribute('trex-car-tour').carSpeed,
      //   });
      // }
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
