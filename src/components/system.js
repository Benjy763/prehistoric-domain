AFRAME.registerSystem('game', {
  schema: {},
  init: function () {
    this.startListener();
  },
  log: function (text) {
    document
      .querySelector('#log')
      .setAttribute('text', { value: text, color: 'white', width: 0.5 });
  },
  startListener: function () {
    document.addEventListener('keyup', function (e) {
      const car = document.querySelector('#car');
      // Play/pause game
      if (e.keyCode == 80) {
        car.setAttribute('car-tour', {
          carMarker: car.getAttribute('car-tour').carMarker,
          carSpeed: !car.getAttribute('car-tour').carSpeed ? 0.0002 : 0,
        });
      }
      // Go to position
      if (e.keyCode == 32) {
        car.setAttribute('car-tour', {
          carMarker: 0.2, // Specific position
          carSpeed: car.getAttribute('car-tour').carSpeed,
        });
      }
    });
  },
});
