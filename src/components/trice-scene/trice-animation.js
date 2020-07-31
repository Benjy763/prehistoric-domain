AFRAME.registerComponent('trice-animation', {
  schema: {},
  init: function () {
    // Objects shortcut
    this.object = this.el.object3D;
    this.system = document.querySelector('a-scene').systems['game'];
    this.car = document.querySelector('#trice-car');
    this.phase = '';
    // trex run Path
    this.triceMarker = 0; // Position on the curve
    this.triceSpeed = 0.00012; // Speed on the curve
    this.curve = new THREE.SplineCurve([
      new THREE.Vector2(-49.327, -75.678),
      new THREE.Vector2(86.72, -75.678),
    ]);

    // Sound

    // Start tour listener
    this.el.addEventListener(
      'enter',
      () => {
        this.phase = 'enter';
      },
      false
    );
  },
  // --- Phase functions ---
  enter: function () {},
  tock: function () {
    // Animation steps
    switch (this.phase) {
      case 'enter':
        this.enter();
        break;
    }
  },
});
