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
  loader: function (text) {
    // Load asset
    document.querySelector('a-assets').addEventListener('loaded', function () {
      // Rendering time timeout
      setTimeout(() => {
        // Remove loader
        document.getElementById('static-loading').style.display = 'none';
        document.getElementById('loading').setAttribute('visible', 'false');
        document.getElementById('trex-scene').setAttribute('visible', 'true');
      }, 8000);
    });

    //Init Game
    this.initGame();
  },
  startListener: function () {
    document.addEventListener('keyup', function (e) {
      const car = document.querySelector('#car');
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
      if (e.keyCode == 32) {
        car.setAttribute('car-tour', {
          carMarker: 0.48, // Specific position
          carSpeed: car.getAttribute('car-tour').carSpeed,
        });
      }
    });
  },
});
