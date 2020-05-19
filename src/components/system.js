AFRAME.registerSystem('game', {
  schema: {},
  init: function () {
    this.loader();
  },
  log: function (text) {
    document
      .querySelector('#log')
      .setAttribute('text', { value: text, color: 'white', width: 0.5 });
  },
  displayScene: function () {
    document.querySelector('.a-enter-vr').style.display = 'none';
    document
      .getElementById('loading-camera')
      .setAttribute('camera', 'active', false);
    document.getElementById('static-loading').style.display = 'none';
    document.getElementById('loading').setAttribute('visible', 'false');
    document.getElementById('trex-scene').setAttribute('visible', 'true');
  },
  loader: function (text) {
    // Load asset
    document.querySelector('a-assets').addEventListener('loaded', () => {
      // Preloading
      setTimeout(() => {
        // Press start
        document.querySelector('.a-enter-vr').style.display = 'flex';
        document.getElementById('put-headset').style.color = 'white';

        //Init Game
        this.startListener();
      }, 4000);
    });
  },
  startListener: function () {
    document.addEventListener('keyup', (e) => {
      const car = document.querySelector('#car');
      // Start tour
      if (e.keyCode == 32) {
        // Display scene
        this.displayScene();

        // Lauch the scene after the rendering time
        setTimeout(() => {
          document.getElementById('rendering').setAttribute('visible', 'false');
          const event = new Event('start');
          car.dispatchEvent(event);
        }, 20000);
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
