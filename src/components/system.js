AFRAME.registerSystem('game', {
  schema: {},
  init: function () {
    this.loader();
  },
  initGame: function (text) {
    this.startListener();
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
    const self = this;
    // Load asset
    document.querySelector('a-assets').addEventListener('loaded', function () {
      // Rendering timeout
      setTimeout(() => {
        // Press start
        document.querySelector('.a-enter-vr').style.display = 'flex';
        document.getElementById('put-headset').style.color = 'white';

        //Init Game
        self.initGame();
      }, 8000);
    });

    //Init Game
    this.initGame();
  },
  startListener: function () {
    const self = this;

    document.addEventListener('keyup', function (e) {
      const car = document.querySelector('#car');
      // Start tour
      if (e.keyCode == 32) {
        // Display scene
        self.displayScene();
        const event = new Event('start');
        this.querySelector('#car').dispatchEvent(event);
      }

      // Commands for testing
      // Play/pause game
      if (e.keyCode == 80) {
        car.setAttribute('car-tour', {
          carMarker: car.getAttribute('car-tour').carMarker,
          carSpeed:
            !car.getAttribute('car-tour').carSpeed ||
            car.getAttribute('car-tour').carSpeed == 0
              ? car.getAttribute('car-tour').speedValue
              : 0,
        });
      }
      // Go to position
      if (e.keyCode == 13) {
        car.setAttribute('car-tour', {
          carMarker: 0.52, // Specific position
          carSpeed: car.getAttribute('car-tour').carSpeed,
        });
      }
    });
  },
});
