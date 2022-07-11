AFRAME.registerComponent('dimetrodon-male-animation', {
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

    // Dimetrodon run Path
    this.dimetrodonMarker = 0; // Position on the curve
    this.dimetrodonWalkSpeed = 0.0008; // Speed on the curve
    this.walkCurve1 = new THREE.SplineCurve([
      new THREE.Vector2(-37.867, -15),
      new THREE.Vector2(-37.867, 55),
    ]);

    // Sound

    // Start tour listener
    this.el.addEventListener(
      'enterWalk',
      () => {
        setTimeout(() => {
          this.phase = 'enterWalk';
        }, 5000);
      },
      false
    );
  },
  // --- Phase functions ---
  enterWalk: function () {},
  tick: function () {
    // Animation steps
    switch (this.phase) {
      case 'enterWalk':
        this.enterWalk();
        break;
    }
  },
});
