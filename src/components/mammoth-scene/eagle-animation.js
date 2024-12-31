AFRAME.registerComponent('eagle-animation', {
  schema: {},
  init: function () {
    this.tick = AFRAME.utils.throttleTick(this.tick, 25, this);
    // Objects shortcut
    this.object = this.el.object3D;
    this.system = document.querySelector('a-scene').systems['system'];
    this.audioControl =
      document.querySelector('a-scene').systems['audioControl'];
    this.movesManager =
      document.querySelector('a-scene').systems['movesManager'];
    this.car = document.querySelector('#mammoth-car');
    this.wolf = document.querySelector('#wolf');
    this.phase = '';
    this.curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(6.061, 149.341, -325.983),
      new THREE.Vector3(102.495, 83.565, -98.35),
      new THREE.Vector3(205.385, -52.953, 460.006)
    ]);

    this.curve2 = new THREE.CatmullRomCurve3([
      new THREE.Vector3(177.83, 37.073, 31.028),
      new THREE.Vector3(54.325, 38, 31.028),
      new THREE.Vector3(-47.86, 45, 31.028)
    ]);

    // Start tour listener
    this.el.addEventListener(
      'enterFly',
      () => {
        // Load sounds
        // Launch animation
        this.eagleMarker = 0;
        this.phaseConfig = {
          enterFly: {
            speed: 0.02
          },
          flyBack: {
            speed: 0.05
          }
        };
        this.phase = 'enterFly';
      },
      false
    );
  },
  enterFly: function () {
    this.eagleMarker = this.movesManager.moveOnCurve(
      this,
      this.el.object3D,
      this.curve,
      this.eagleMarker,
      this.phaseConfig[this.phase].speed,
      { useDeltaTime: true }
    );

    if (this.movesManager.truncMarker(this.eagleMarker) > 850) {
      this.eagleMarker = 0;
      setTimeout(() => {
        this.phase = 'flyBack';
      }, 1000);
      this.phase = 'exit';
    }
  },
  flyBack: function () {
    this.eagleMarker = this.movesManager.moveOnCurve(
      this,
      this.el.object3D,
      this.curve2,
      this.eagleMarker,
      this.phaseConfig[this.phase].speed,
      { useDeltaTime: true }
    );

    if (this.movesManager.truncMarker(this.eagleMarker) > 800) {
      this.wolf.dispatchEvent(new Event('enterRun'));
      this.el.setAttribute('visible', 'false');
      this.phase = 'exit';
    }
  },
  tick: function () {
    // Animation steps
    switch (this.phase) {
      case 'enterFly':
        this.enterFly();
        break;
      case 'flyBack':
        this.flyBack();
        break;
    }
  }
});
