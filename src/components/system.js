AFRAME.registerSystem('game', {
  schema: {},
  init: function () {
    this.firstScene = 'raptor';
    this.displayDistance = 100; // 150
    this.scenes = {
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
    };
    this.carReference;
    this.actuelScene = this.firstScene;
    this.tourStarted = false;
    this.console = document.querySelector('a-scene').systems['console'];
    this.loadingAssets();

    // Debug events
    this.startListener();
  },
  registerCar: function (car) {
    // Save all car references at start
    Object.keys(this.scenes).forEach((scene) => {
      if (this.scenes[scene].car === car.el.id) {
        this.scenes[scene].carReference = car;
      }
    });

    // Send reference to the actual scene
    if (car.el.id !== this.scenes[this.actuelScene].car) {
      return;
    }
    this.carReference = car;
    this.sendCarReference(car);
  },
  sendCarReference(car) {
    const event = new Event('carRegistered');
    car.el.dispatchEvent(event);
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
  // Only for the first time
  displayScene: function () {
    // Hide vr button and loading static screen
    document.querySelector('#enter-vr').style.display = 'none';

    // Display camera
    this.disableAllCameras();
    document
      .getElementById(this.scenes[this.firstScene].camera)
      .setAttribute('camera', { far: this.displayDistance, active: true });

    // Display scene
    document.getElementById('loading-scene').setAttribute('visible', 'false');
    document
      .getElementById(this.scenes[this.firstScene].scene)
      .setAttribute('visible', 'true');
  },
  // Each time we change scene
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
      .setAttribute('camera', { far: this.displayDistance, active: true });

    // Register new scene
    this.actuelScene = sceneId;

    // Notify car reference to the new scene
    this.carReference.stopTrackingCar();
    this.carReference = this.scenes[this.actuelScene].carReference;
    this.sendCarReference(this.carReference);

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
    this.loading();
    // Select car to launch event
    const car = document.getElementById(this.scenes[sceneId].car);

    // Launch the scene after the rendering time
    car.querySelector('#rendering').setAttribute('visible', 'true');
    setTimeout(() => {
      car.querySelector('#rendering').setAttribute('visible', 'false');
      const event = new Event('start');
      if (car) {
        car.dispatchEvent(event);
        this.loading(false);
      }
    }, 15000);
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

      // Other debug
      if (e.keyCode == 55) {
        this.carReference.carMarker = 0.65;
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
  loading: function (loading = true) {
    if (!loading) {
      document
        .querySelector(
          '#' + this.scenes[this.actuelScene].car + ' #loading-logo'
        )
        .setAttribute('visible', false);
      document
        .querySelector('#' + this.scenes[this.actuelScene].car + ' #rig')
        .setAttribute('position', { x: -0.38, y: 1.0, z: 0.5 });
      return;
    }
    document
      .querySelector('#' + this.scenes[this.actuelScene].car + ' #loading-logo')
      .setAttribute('visible', true);
    document
      .querySelector('#' + this.scenes[this.actuelScene].car + ' #rig')
      .setAttribute('position', { x: -0.38, y: -100, z: 0.5 });
  },
});
