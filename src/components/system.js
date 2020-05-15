AFRAME.registerSystem('game', {
  schema: {},
  init: function () {
    this.loader();
    this.startListener();
  },
  log: function (text) {
    document
      .querySelector('#log')
      .setAttribute('text', { value: text, color: 'white', width: 0.5 });
  },
  loader: function (text) {
    setTimeout(() => {
      document
        .getElementById('static-loading')
        .setAttribute('visible', 'false');
      document.getElementById('main-scene').setAttribute('visible', 'true');
    }, 12000);
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
