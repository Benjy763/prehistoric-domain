AFRAME.registerComponent('sarco-female-animation', {
  schema: {},
  init: function () {
    this.tick = AFRAME.utils.throttleTick(this.tick, 25, this);

    // Objects shortcut
    this.object = this.el.object3D;
    this.system = document.querySelector('a-scene').systems['system'];
    this.movesManager =
      document.querySelector('a-scene').systems['movesManager'];
    this.car = document.querySelector('#sarco-car');
    this.mainScene = document.getElementById('main-scene');
    this.sarcoMale = document.querySelector('#sarco-male');
    this.sarcoCar = document.querySelector('#sarco-car');
    this.phase = '';
    this.bird = document.querySelector('#sarco-bird');

    // Spino run Path
    this.sarcoMarker = 0; // Position on the curve
    this.sarcoWalkSpeed = 0.0008; // Speed on the curve
    this.sarcoSwimSpeed = 0.0022; // Speed on the curve
    this.sarcoSwimSpeed2 = 0.0035; // Speed on the curve
    this.walkCurve1 = new THREE.SplineCurve([
      new THREE.Vector2(-28.408, -40.973),
      new THREE.Vector2(-24.678, -10.058),
      new THREE.Vector2(-21.574, 0.238),
      new THREE.Vector2(-3.314, 31.921),
    ]);

    // Bird Path
    this.birdMarker = 0; // Position on the curve
    this.birdSpeed = 0.0008; // Speed on the curve
    this.birdCurve = new THREE.SplineCurve([
      new THREE.Vector2(-10.508, -9.171),
      new THREE.Vector2(-19.703, -3.136),
      new THREE.Vector2(-20.977, 3.892),
      new THREE.Vector2(-24.716, 6.492),
      new THREE.Vector2(-32.015, 6.218),
      new THREE.Vector2(-76.883, 3.19),
    ]);

    // Sound

    // Start tour listener
    this.el.addEventListener(
      'enterWalk',
      () => {
        this.phase = 'enterWalk';
        this.el.setAttribute('animation-mixer', {
          clip: 'Spinosaurus_Walk_InPlace',
          loop: true,
          crossFadeDuration: 0.4,
          timeScale: 0.7,
        });
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
