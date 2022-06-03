AFRAME.registerComponent('spino-animation', {
  schema: {},
  init: function () {
    this.tick = AFRAME.utils.throttleTick(this.tick, 25, this);

    // Objects shortcut
    this.object = this.el.object3D;
    this.system = document.querySelector('a-scene').systems['system'];
    this.movesManager =
      document.querySelector('a-scene').systems['movesManager'];
    this.car = document.querySelector('#spino-car');
    this.mainScene = document.getElementById('main-scene');
    this.phase = '';

    // Spino run Path
    this.spinoMarker = 0; // Position on the curve
    this.spinoWalkSpeed = 0.003; // Speed on the curve
    this.spinoFlySpeed = 0.0075; // Speed on the curve
    this.fog = 0.065;
    this.walkCurve = new THREE.SplineCurve([
      new THREE.Vector2(-10, -25),
      new THREE.Vector2(-1, -18),
      new THREE.Vector2(5, -8.287),
    ]);
    this.flyCurve = new THREE.SplineCurve([
      new THREE.Vector2(40, -60), // y,z and x to 13.622
      new THREE.Vector2(33, -5),
      new THREE.Vector2(85, -2.59),
    ]);

    // Sound

    // Start tour listener
    this.el.addEventListener(
      'enterWalk',
      () => {
        this.el.setAttribute('animation-mixer', {
          clip: 'Walk',
          crossFadeDuration: 0.4,
        });
      },
      false
    );
  },
  // --- Phase functions ---
  enterWalk: function () {
    if (this.movesManager.truncMarker(this.spinoMarker) > 950) {
      this.phase = 'roar';
    }
    this.spinoMarker = this.movesManager.moveOnCurve(
      this.object,
      this.walkCurve,
      this.spinoMarker,
      this.spinoWalkSpeed
    );
    this.movesManager.updateRotation(
      this.el,
      this.object,
      this.walkCurve,
      this.spinoMarker,
      this.spinoWalkSpeed
    );
  },
  tick: function () {
    // Animation steps
    switch (this.phase) {
      case 'enterWalk':
        this.enterWalk();
        break;
    }
  },
});
