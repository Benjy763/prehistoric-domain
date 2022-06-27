AFRAME.registerComponent('sarco-animation', {
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
    this.sarcoCar = document.querySelector('#sarco-car');
    this.phase = '';
    this.bird = document.querySelector('#sarco-bird');

    // Spino run Path
    this.sarcoMarker = 0; // Position on the curve
    this.sarcoWalkSpeed = 0.0008; // Speed on the curve
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
      new THREE.Vector2(-18.96, 14.287),
      new THREE.Vector2(-18.96, 6.686),
    ]);
    this.birdCurve2 = new THREE.SplineCurve([
      new THREE.Vector2(-18.96, 6.686),
      new THREE.Vector2(-33.901, -8.755),
    ]);

    // Sound

    // Start tour listener
    this.el.addEventListener(
      'enter',
      () => {
        this.phase = 'openJaws';
      },
      false
    );
  },
  // --- Phase functions ---
  openJaws: function () {
    setTimeout(() => {
      this.el.setAttribute('animation-mixer', {
        clip: 'Sarcosuchus_Sneak_Idle_OpenJaws',
        loop: true,
        crossFadeDuration: 1.5,
        timeScale: 0.8,
      });
    }, 0);
  },
  tick: function () {
    // Animation steps
    switch (this.phase) {
      case 'openJaws':
        this.openJaws();
        break;
    }
  },
});
