AFRAME.registerComponent('brachio-animation', {
  schema: {},
  init: function () {
    // Objects shortcut
    this.object = this.el.object3D;
    this.system = document.querySelector('a-scene').systems['game'];
    this.car = document.querySelector('#trex-car');
    this.phase = '';
    // trex run Path
    this.brachioMarker = 0; // Position on the curve
    this.brachioSpeed = 0.00012; // Speed on the curve
    this.curve = new THREE.SplineCurve([
      new THREE.Vector2(-49.327, -75.678),
      new THREE.Vector2(86.72, -75.678),
    ]);

    // Start tour listener
    this.el.addEventListener(
      'enter',
      () => {
        this.el.setAttribute(
          'animation-mixer',
          'clip: brachiosaurus_scetchfab'
        );
        this.phase = 'enter';
      },
      false
    );
  },
  // --- Phase functions ---
  enter: function () {
    this.brachioMarker += this.brachioSpeed;
    this.object.position.copy(
      this.system.convertPosition(
        this.curve.getPointAt(this.brachioMarker),
        this.object.position.y
      )
    );
  },
  tock: function () {
    // Animation steps
    switch (this.phase) {
      case 'enter':
        this.enter();
        break;
    }
  },
});
