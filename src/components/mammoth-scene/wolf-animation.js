AFRAME.registerComponent('wolf-animation', {
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
    this.mammoth = document.querySelector('#mammoth');

    this.phase = '';
    this.curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(15.443, 0.4, 24.82),
      new THREE.Vector3(5, 0.6, 24.82),
      new THREE.Vector3(-20, -3.5, 24.82)
    ]);

    this.curve2 = new THREE.CatmullRomCurve3([
      new THREE.Vector3(53.512, 3, 70),
      new THREE.Vector3(53.512, 5.8, 9),
      new THREE.Vector3(53.512, 5.8, -40),
      new THREE.Vector3(53.512, 3, -60.972)
    ]);

    this.curve3 = new THREE.CatmullRomCurve3([
      new THREE.Vector3(53.512, 3, -60.972),
      new THREE.Vector3(53.512, 5.8, -40),
      new THREE.Vector3(53.512, 5.8, 9),
      new THREE.Vector3(53.512, 3, 70)
    ]);

    // Start tour listener
    this.el.addEventListener(
      'enterRun',
      () => {
        // Load sounds
        // Launch animation
        this.wolfMarker = 0;
        this.phaseConfig = {
          enterRun: {
            speed: 0.45
          },
          walk: {
            speed: 0.028
          },
          runBack: {
            speed: 0.108
          }
        };
        this.phase = 'enterRun';
      },
      false
    );
  },
  enterRun: function () {
    this.wolfMarker = this.movesManager.moveOnCurve(
      this,
      this.el.object3D,
      this.curve,
      this.wolfMarker,
      this.phaseConfig[this.phase].speed,
      { useDeltaTime: true, turn180: true }
    );

    if (this.movesManager.truncMarker(this.wolfMarker) > 850) {
      this.wolfMarker = 0;
      this.el.setAttribute('animation-mixer', {
        clip: 'Walk',
        crossFadeDuration: 2,
        timeScale: 1
      });
      setTimeout(() => {
        this.phase = 'walk';
      }, 2000);
      this.phase = 'exit';
    }
  },
  walk: function () {
    this.wolfMarker = this.movesManager.moveOnCurve(
      this,
      this.el.object3D,
      this.curve2,
      this.wolfMarker,
      this.phaseConfig[this.phase].speed,
      { useDeltaTime: true, turn180: true }
    );

    if (this.movesManager.truncMarker(this.wolfMarker) > 850) {
      this.wolfMarker = 0;
      this.el.setAttribute('animation-mixer', {
        clip: 'Run',
        crossFadeDuration: 2,
        timeScale: 1
      });
      setTimeout(() => {
        this.phase = 'runBack';
      }, 4000);
      this.phase = 'exit';
    }
  },
  runBack: function () {
    this.wolfMarker = this.movesManager.moveOnCurve(
      this,
      this.el.object3D,
      this.curve3,
      this.wolfMarker,
      this.phaseConfig[this.phase].speed,
      { useDeltaTime: true, turn180: true }
    );

    if (this.movesManager.truncMarker(this.wolfMarker) > 850) {
      this.mammoth.dispatchEvent(new Event('enterWalk'));
      this.el.setAttribute('visible', 'false');
      this.phase = 'exit';
    }
  },
  tick: function () {
    // Animation steps
    switch (this.phase) {
      case 'enter':
        this.enter();
        // Something else with another function if needed in each step
        break;
      case 'enterRun':
        this.enterRun();
        break;
      case 'walk':
        this.walk();
        break;
      case 'runBack':
        this.runBack();
        break;
    }
  }
});
