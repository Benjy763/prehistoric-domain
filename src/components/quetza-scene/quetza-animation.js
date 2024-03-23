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
    this.animationPhase = 'canPlane';

    // Spino run Path
    this.quetzaMarker = 0; // Position on the curve
    this.quetzaSpeed = 0.0015; // Speed on the curve
    this.walkCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-20.869, -0.4, -42),
      new THREE.Vector3(-20.869, -0.4, 0.667),
    ]);
    this.flyCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-20.869, -0.237, -1.867),
      new THREE.Vector3(-20.869, 2, 3.407),
      new THREE.Vector3(0.048, 10, 58.076),
    ]);
    this.flyBackCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.502, 5.829, 54.574),
      new THREE.Vector3(-27.638, 6, 22.439),
      new THREE.Vector3(-29.904, 6.5, -25.735),
      new THREE.Vector3(-5.821, 8, -73.481),
    ]);

    // Sound

    // Start tour listener
    this.el.addEventListener(
      'enter',
      () => {
        // Load sounds
        this.quetzaFlyAudio = this.el.components['sound__quetzafly'];
        this.quetzaFlyStartAudio = this.el.components['sound__quetzaflystart'];
        this.quetzaRoar3Audio = this.el.components['sound__quetzaroar3'];
        this.quetzaSnoring1Audio = this.el.components['sound__quetzasnoring1'];
        this.quetzaWalkAudio = this.el.components['sound__quetzawalk'];

        this.el.setAttribute('animation-mixer', {
          clip: 'Quetzal_Walk_InPlace',
          loop: true,
          crossFadeDuration: 0.4,
          timeScale: 0.8,
        });
        this.quetzaWalkAudio.playSound();
        this.phase = 'walk';
      },
      false
    );
  },
  // --- Phase functions ---
  walk: function () {
    this.quetzaMarker = this.movesManager.moveOnCurve(
      this,
      this.object,
      this.walkCurve,
      this.quetzaMarker,
      this.quetzaSpeed
    );

    if (this.movesManager.truncMarker(this.quetzaMarker) > 900) {
      this.quetzaSpeed -= 0.0001;
    }
    if (this.quetzaSpeed <= 0) {
      this.quetzaWalkAudio.stopSound();
      this.quetzaRoar3Audio.playSound();
      this.el.setAttribute('animation-mixer', {
        clip: 'Quetzal_Roar',
        loop: true,
        crossFadeDuration: 1,
        timeScale: 0.6,
      });
      this.phase = 'roar';
    }
  },
  idle: function () {
    setTimeout(() => {
      this.phase = 'roar';
    }, 8000);
    this.phase = 'exit';
  },
  roar: function () {
    setTimeout(() => {
      this.phase = 'idle2';
    }, 3200);
    this.el.setAttribute('animation-mixer', {
      clip: 'Quetzal_Roar',
      loop: true,
      crossFadeDuration: 0.4,
      timeScale: 0.5,
    });
    this.phase = 'exit';
  },
  idle2: function () {
    this.el.setAttribute('animation-mixer', {
      clip: 'Quetzal_Idle',
      loop: true,
      crossFadeDuration: 0.8,
      timeScale: 0.6,
    });

    setTimeout(() => {
      this.quetzaFlyStartAudio.playSound();
      this.el.setAttribute('animation-mixer', {
        clip: 'Quetzal_FlyJump_Idle',
        loop: false,
        crossFadeDuration: 0.4,
        timeScale: 0.3,
      });
      this.quetzaSpeed = 0;
      this.quetzaMarker = 0;
    }, 10000);
    setTimeout(() => {
      this.phase = 'fly';
    }, 11000);
    setTimeout(() => {
      this.el.setAttribute('animation-mixer', {
        clip: 'Quetzal_FlyWave_High',
        loop: false,
        crossFadeDuration: 0.4,
        timeScale: 0.8,
      });
    }, 11500);
    this.phase = 'exit';
  },
  fly: function () {
    if (
      this.movesManager.truncMarker(this.quetzaMarker) < 80 &&
      this.quetzaSpeed < 0.007
    ) {
      this.quetzaSpeed += 0.0004;
    }
    if (
      this.movesManager.truncMarker(this.quetzaMarker) > 80 &&
      this.quetzaSpeed > 0.003
    ) {
      this.quetzaSpeed -= 0.0005;
    }
    this.quetzaMarker = this.movesManager.moveOnCurve(
      this,
      this.object,
      this.flyCurve,
      this.quetzaMarker,
      this.quetzaSpeed,
      { needLookAt: false }
    );

    if (this.movesManager.truncMarker(this.quetzaMarker) > 900) {
      setTimeout(() => {
        this.quetzaSpeed = 0.003;
        this.quetzaMarker = 0;
        this.el.setAttribute('scale', '0.017 0.017 0.017');
        this.quetzaFlyAudio.playSound();
        this.phase = 'flyBack';
      }, 5000);
      this.phase = 'exit';
    }
  },
  flyBack: function () {
    if (
      this.movesManager.truncMarker(this.quetzaMarker) > 400 &&
      this.animationPhase === 'canPlane'
    ) {
      this.animationPhase = 'planing';
      this.el.setAttribute('animation-mixer', {
        clip: 'Quetzal_Fly_High',
        loop: false,
        crossFadeDuration: 0.8,
        timeScale: 0.7,
      });
    }
    this.quetzaMarker = this.movesManager.moveOnCurve(
      this,
      this.object,
      this.flyBackCurve,
      this.quetzaMarker,
      this.quetzaSpeed
    );

    if (this.movesManager.truncMarker(this.quetzaMarker) > 900) {
      this.phase = 'exit';
    }
  },
  tick: function () {
    // Animation steps
    switch (this.phase) {
      case 'walk':
        this.walk();
        break;
      case 'idle':
        this.idle();
        break;
      case 'roar':
        this.roar();
        break;
      case 'idle2':
        this.idle2();
        break;
      case 'fly':
        this.fly();
        break;
      case 'flyBack':
        this.flyBack();
        break;
    }
  },
});
