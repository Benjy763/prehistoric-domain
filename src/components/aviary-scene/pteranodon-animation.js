AFRAME.registerComponent('pteranodon-animation', {
  schema: {},
  init: function () {
    this.tick = AFRAME.utils.throttleTick(this.tick, 25, this);

    // Objects shortcut
    this.object = this.el.object3D;
    this.system = document.querySelector('a-scene').systems['system'];
    this.movesManager =
      document.querySelector('a-scene').systems['movesManager'];
    this.car = document.querySelector('#aviary-car');
    this.phase = '';
    this.animationPhase = 'canFly';

    // Ptera run Path
    this.pteraMarker = 0; // Position on the curve
    this.pteraSpeed = 0; // Speed on the curve
    this.curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(37.448, 80.1, -52.658),
      new THREE.Vector3(48.066, 79.077, -47.373),
      new THREE.Vector3(68.016, 25.763, -27.155),
      new THREE.Vector3(44.23, 8.509, 2.444),
      new THREE.Vector3(30.917, 8.509, 13.796),
    ]);
    this.curveEndFly = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-321.779, 98.779, -131.492),
      new THREE.Vector3(-284.274, 98.779, -91.741),
      new THREE.Vector3(-258.469, 98.779, -64.216),
      new THREE.Vector3(-18.033, 53.129, 19.384),
      new THREE.Vector3(826.814, 22.709, -0.686),
    ]);

    // Sound
    this.passingAudio;

    // Start tour listener
    this.el.addEventListener(
      'enter',
      () => {
        setTimeout(() => {
          this.el.setAttribute('animation-mixer', {
            clip: 'Ptera_Plane',
            loop: true,
            crossFadeDuration: 0.4,
            timeScale: 1,
          });
        }, 3500);
        setTimeout(() => {
          this.phase = 'enter';
        }, 2500);
        setTimeout(() => {
          this.el.setAttribute('animation-mixer', {
            clip: 'Ptera_Start',
            loop: true,
            crossFadeDuration: 0.4,
            timeScale: 0.7,
          });
        }, 2000);
        this.phase = 'exit';
      },
      false
    );

    this.el.addEventListener(
      'endFly',
      () => {
        this.pteraSpeed = 0.0007;
        this.pteraMarker = 0;
        this.el.setAttribute('animation-mixer', {
          clip: 'Ptera_Plane',
          loop: true,
          crossFadeDuration: 0.4,
          timeScale: 1,
        });
        this.phase = 'endFly';
      },
      false
    );
  },
  // --- Phase functions ---
  enter: function () {
    if (this.pteraSpeed < 0.007) {
      this.pteraSpeed += 0.0002;
    }
    if (this.movesManager.truncMarker(this.pteraMarker) > 800) {
      const event = new Event('secondPtera');
      this.car.dispatchEvent(event);
      this.phase = 'finish';
    }
    this.pteraMarker = this.movesManager.moveOnCurve(
      this.object,
      this.curve,
      this.pteraMarker,
      this.pteraSpeed,
      '3d'
    );
  },
  endFly: function () {
    if (this.movesManager.truncMarker(this.pteraMarker) > 800) {
      this.phase = 'finish';
    }
    if (
      this.movesManager.truncMarker(this.pteraMarker) > 300 &&
      this.animationPhase === 'canFly'
    ) {
      this.el.setAttribute('animation-mixer', {
        clip: 'Ptera_Fly',
        loop: true,
        crossFadeDuration: 0.4,
        timeScale: 0.7,
      });
      setTimeout(() => {
        this.el.setAttribute('animation-mixer', {
          clip: 'Ptera_Plane',
          loop: true,
          crossFadeDuration: 0.4,
          timeScale: 0.8,
        });
      }, 4000);
      this.animationPhase = 'planing';
    }
    this.pteraMarker = this.movesManager.moveOnCurve(
      this.object,
      this.curveEndFly,
      this.pteraMarker,
      this.pteraSpeed,
      '3d'
    );
  },
  tick: function () {
    // Animation steps
    switch (this.phase) {
      case 'enter':
        this.enter();
        break;
      case 'endFly':
        this.endFly();
        break;
    }
  },
});
