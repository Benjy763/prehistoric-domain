AFRAME.registerSystem('game', {
  schema: {},
  init: function () {
    this.actuelScene = 'trex-scene'; // Id of the scene
    this.cameras = [
      'loading-scene-camera',
      'gate-scene-camera',
      'trex-scene-camera',
    ];
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
      .getElementById('trex-scene-camera')
      .setAttribute('camera', 'active', true);

    // Display scene
    document.getElementById('loading-scene').setAttribute('visible', 'false');
    document.getElementById('trex-scene').setAttribute('visible', 'true');
  },
  changeScene: function (sceneName) {
    // change scene
    document.getElementById(this.actuelScene).setAttribute('visible', 'false');
    document.getElementById(sceneName).setAttribute('visible', 'true');

    // change camera
    this.disableAllCameras();
    document
      .getElementById(sceneName + '-camera')
      .setAttribute('camera', 'active', true);

    // Register new scene
    this.actuelScene = sceneName;

    // Rendering scene
    this.renderingScene();
  },
  loadingAssets: function (text) {
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
    this.cameras.forEach((camera) => {
      document.getElementById(camera).setAttribute('camera', 'active', false);
    });
  },
  renderingScene: function () {
    // Lauch the scene after the rendering time
    document.getElementById('rendering').setAttribute('visible', 'true');
    setTimeout(() => {
      document.getElementById('rendering').setAttribute('visible', 'false');
      const event = new Event('start');
      car.dispatchEvent(event);
    }, 20000);
  },
  startListener: function () {
    document.addEventListener('keyup', (e) => {
      const car = document.querySelector('#car');
      // Start tour
      if (e.keyCode == 32) {
        // Display scene
        this.displayScene();
        // Rendering scene
        this.renderingScene();
      }

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
});
