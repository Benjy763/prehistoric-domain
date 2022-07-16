AFRAME.registerComponent('edmon-female-animation', {
  schema: {},
  init: function () {
    this.tick = AFRAME.utils.throttleTick(this.tick, 25, this);

    // Objects shortcut
    this.object = this.el.object3D;
    this.system = document.querySelector('a-scene').systems['system'];
    this.movesManager =
      document.querySelector('a-scene').systems['movesManager'];
    this.car = document.querySelector('#edmon-car');
    this.mainScene = document.getElementById('main-scene');
    this.edmonMale = document.querySelector('#edmon-male');
    this.phase = '';

    // Edmon run Path
    this.edmonMarker = 0; // Position on the curve
    this.edmonSpeed = 0.0022; // Speed on the curve
    this.walkCurve1 = new THREE.SplineCurve([
      new THREE.Vector2(-28.408, -40.973),
      new THREE.Vector2(-24.678, -10.058),
      new THREE.Vector2(-21.574, 0.238),
      new THREE.Vector2(-3.314, 31.921),
    ]);

    // Sound

    // Start tour listener
    this.el.addEventListener(
      'awake',
      () => {
        this.phase = 'awake';
      },
      false
    );
  },
  // --- Phase functions ---
  awake: function () {
    this.el.setAttribute('animation-mixer', {
      clip: 'E_RestEnd',
      loop: true,
      crossFadeDuration: 2,
      timeScale: 0.6,
    });
    setTimeout(() => {
      this.phase = 'shake';
    }, 3200);
    this.phase = 'exit';
  },
  shake: function () {
    this.el.setAttribute('animation-mixer', {
      clip: 'E_Action3_Shake',
      loop: true,
      crossFadeDuration: 0.4,
      timeScale: 0.7,
    });
    setTimeout(() => {
      this.phase = 'drink';
    }, 4000);
    this.phase = 'exit';
  },
  drink: function () {
    this.el.setAttribute('animation-mixer', {
      clip: 'E_Drink',
      loop: true,
      crossFadeDuration: 0.4,
      timeScale: 0.7,
    });
    this.phase = 'exit';
  },
  tick: function () {
    // Animation steps
    switch (this.phase) {
      case 'awake':
        this.awake();
        break;
      case 'shake':
        this.shake();
        break;
      case 'drink':
        this.drink();
        break;
    }
  },
});
