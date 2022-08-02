AFRAME.registerComponent('quetza-animation', {
  schema: {},
  init: function () {
    this.tick = AFRAME.utils.throttleTick(this.tick, 25, this);

    // Objects shortcut
    this.object = this.el.object3D;
    this.system = document.querySelector('a-scene').systems['system'];
    this.movesManager =
      document.querySelector('a-scene').systems['movesManager'];
    this.car = document.querySelector('#quetza-car');
    this.mainScene = document.getElementById('main-scene');
    this.phase = '';

    // Spino run Path
    this.quetzaMarker = 0; // Position on the curve
    this.quetzaWalkSpeed = 0.0015; // Speed on the curve
    this.quetzaSwimSpeed = 0.0015; // Speed on the curve
    this.walkCurve1 = new THREE.SplineCurve([
      new THREE.Vector2(-18.969, 0.161),
      new THREE.Vector2(-18.969, 32.365),
    ]);

    // Sound

    // Start tour listener
    this.el.addEventListener(
      'enter',
      () => {
        this.phase = '';
      },
      false
    );
  },
  // --- Phase functions ---
  tick: function () {
    // Animation steps
    switch (this.phase) {
    }
  },
});
