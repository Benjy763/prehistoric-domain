AFRAME.registerComponent('pteranodon-2-animation', {
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

    // Ptera run Path
    this.pteraMarker = 0; // Position on the curve
    this.pteraSpeed = 0.003; // Speed on the curve
    this.curveWalk = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-13.341, 59.254, -50.491),
      new THREE.Vector3(-7.429, 59.254, -47.172),
      new THREE.Vector3(-1.461, 59.254, -40.87),
      new THREE.Vector3(3.121, 59.254, -38.321),
    ]);
    this.curveFly = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.485, 59.254, -40.194),
      new THREE.Vector3(12.935, 59.254, -34.362),
      new THREE.Vector3(47.984, 35.666, -21.523),
      new THREE.Vector3(85.311, 26.673, -29.549),
      new THREE.Vector3(107.063, 26.673, -44.925),
      new THREE.Vector3(135.051, 26.673, -89.269),
      new THREE.Vector3(147.831, 26.673, -144.094),
    ]);
    this.curveLand = new THREE.CatmullRomCurve3([
      new THREE.Vector3(47.879, 96.093, -104.701),
      new THREE.Vector3(36.153, 79.253, -48.981),
    ]);

    // Sound
    this.passingAudio;

    // Start tour listener
    this.el.addEventListener(
      'enter',
      () => {
        // Get sounds
        this.pteraRoarAudio = this.el.components['sound__roar'];

        this.el.setAttribute('animation-mixer', {
          clip: 'Ptera_Walk',
          loop: true,
          crossFadeDuration: 0.4,
          timeScale: 0.7,
        });
        this.phase = 'enter';
      },
      false
    );
  },
  // --- Phase functions ---
  enter: function () {
    if (this.movesManager.truncMarker(this.pteraMarker) > 800) {
      this.el.setAttribute('animation-mixer', {
        clip: 'Ptera_Idle',
        loop: true,
        crossFadeDuration: 0.4,
        timeScale: 0.8,
      });
      this.phase = 'idle';
    }
    this.pteraMarker = this.movesManager.moveOnCurve(
      this.object,
      this.curveWalk,
      this.pteraMarker,
      this.pteraSpeed,
      '3d'
    );
  },
  idle: function () {
    setTimeout(() => {
      this.el.setAttribute('animation-mixer', {
        clip: 'Ptera_Roar',
        loop: true,
        crossFadeDuration: 0.4,
        timeScale: 0.6,
      });
      this.pteraRoarAudio.playSound();
      this.phase = 'roar';
    }, 8000);
    this.phase = 'exit';
  },
  roar: function () {
    setTimeout(() => {
      this.el.setAttribute('animation-mixer', {
        clip: 'Ptera_Plane',
        loop: true,
        crossFadeDuration: 0.4,
        timeScale: 1,
      });
    }, 5000);
    setTimeout(() => {
      this.phase = 'fly';
    }, 3000);
    setTimeout(() => {
      this.el.setAttribute('animation-mixer', {
        clip: 'Ptera_Start',
        loop: true,
        crossFadeDuration: 0.4,
        timeScale: 0.7,
      });
      this.pteraSpeed = 0;
      this.pteraMarker = 0;
    }, 2500);
    this.phase = 'exit';
  },
  fly: function () {
    if (this.pteraSpeed < 0.005) {
      this.pteraSpeed += 0.0002;
    }
    if (this.movesManager.truncMarker(this.pteraMarker) > 900) {
      setTimeout(() => {
        this.el.setAttribute('animation-mixer', {
          clip: 'Ptera_Land',
          loop: true,
          crossFadeDuration: 0.4,
          timeScale: 1,
        });
        this.pteraSpeed = 0.007;
        this.pteraMarker = 0;
        this.phase = 'land';
      }, 8000);
      this.phase = 'exit';
    }
    this.pteraMarker = this.movesManager.moveOnCurve(
      this.object,
      this.curveFly,
      this.pteraMarker,
      this.pteraSpeed,
      '3d'
    );
  },
  land: function () {
    if (this.movesManager.truncMarker(this.pteraMarker) > 900) {
      this.el.setAttribute('animation-mixer', {
        clip: 'Ptera_Eat',
        loop: true,
        crossFadeDuration: 0.4,
        timeScale: 0.7,
      });
      this.phase = 'eat';
    }
    this.pteraMarker = this.movesManager.moveOnCurve(
      this.object,
      this.curveLand,
      this.pteraMarker,
      this.pteraSpeed,
      '3d'
    );
  },
  eat: function () {
    setTimeout(() => {
      this.el.setAttribute('animation-mixer', {
        clip: 'Ptera_Idle',
        loop: true,
        crossFadeDuration: 0.4,
        timeScale: 1,
      });
      const event = new Event('lastPtera');
      this.car.dispatchEvent(event);
    }, 5000);
    this.phase = 'exit';
  },
  tick: function () {
    // Animation steps
    switch (this.phase) {
      case 'enter':
        this.enter();
        break;
      case 'idle':
        this.idle();
        break;
      case 'roar':
        this.roar();
        break;
      case 'fly':
        this.fly();
        break;
      case 'land':
        this.land();
        break;
      case 'eat':
        this.eat();
        break;
    }
  },
});
