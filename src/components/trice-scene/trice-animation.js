AFRAME.registerComponent('trice-animation', {
  schema: {},
  init: function () {
    this.tick = AFRAME.utils.throttleTick(this.tick, 25, this);
    // Objects shortcut
    this.object = this.el.object3D;
    this.system = document.querySelector('a-scene').systems['game'];
    this.car = document.querySelector('#trice-car');
    this.phase = '';
    // trex run Path
    this.triceMarker = 0; // Position on the curve
    this.triceSpeed = 0.28; // Speed on the curve
    this.curve = new THREE.SplineCurve([
      new THREE.Vector2(72.068, -94.573),
      new THREE.Vector2(7.785, -94.573),
    ]);

    // Car shaking
    this.isShaking = false;
    this.carWaves = 0;
    this.carRotationValue = 1;
    this.wavesNumber = 6;
    this.carRotation = this.carRotationValue;
    this.shaked = false;

    // Sound
    this.impactAudio = document.getElementById('trice-impact');
    this.snoringAudio;
    this.agressiveAudio;
    this.roar1Audio;
    this.roar2Audio;
    this.runAudio;

    // Start tour listener
    this.el.addEventListener(
      'enter',
      () => {
        this.snoringAudio = this.el.components['sound__snoring'];
        this.agressiveAudio = this.el.components['sound__agressive'];
        this.roar1Audio = this.el.components['sound__roar1'];
        this.roar2Audio = this.el.components['sound__roar2'];
        this.runAudio = this.el.components['sound__run'];
        this.phase = 'enter';
      },
      false
    );
  },
  // --- Phase functions ---
  enter: function () {
    this.phase = 'waiting';
    setTimeout(() => {
      this.snoringAudio.playSound();
    }, 9000);
    this.el.addEventListener('sound-ended', (e) => {
      if (e.detail.id === 'snoring') {
        this.phase = 'roar1';
      }
    });
  },
  roar1: function () {
    this.phase = 'waiting';
    setTimeout(() => {
      this.phase = 'roar2';
    }, 4000);
    setTimeout(() => {
      this.roar1Audio.playSound();
    }, 1000);
  },
  roar2: function () {
    this.phase = 'waiting';
    setTimeout(() => {
      this.runAudio.playSound();
      this.el.setAttribute('animation-mixer', {
        clip: 'Triceratops_Aggressive_Run_InPlace',
        timeScale: 1,
      });
      this.phase = 'run';
    }, 4000);
    setTimeout(() => {
      this.roar2Audio.playSound();
    }, 1000);
  },
  run: function () {
    if (this.object.position.x < 15) {
      this.phase = 'impact';
      this.impactAudio.play();
      setTimeout(() => {
        this.impactAudio.pause();
      }, 2000);
      this.isShaking = true;
    }
    this.object.position.x -= this.triceSpeed;
  },
  impact: function () {
    if (this.object.position.x > 17) {
      this.runAudio.stopSound();
      this.el.setAttribute('animation-mixer', {
        clip: 'Triceratops_Idle',
        timeScale: 1,
      });
      setTimeout(() => {
        const event = new Event('restart');
        this.car.dispatchEvent(event);
      }, 4000);
      setTimeout(() => {
        this.phase = 'roar3';
      }, 2000);
      this.phase = 'waiting';
    }
    this.object.position.x += this.triceSpeed;
  },
  roar3: function () {
    this.phase = 'waiting';
    setTimeout(() => {
      this.phase = 'roar4';
    }, 4000);
    this.el.setAttribute('animation-mixer', {
      clip: 'Triceratops_Idle_Break',
      timeScale: 1,
    });
    setTimeout(() => {
      this.roar1Audio.playSound();
    }, 1000);
  },
  roar4: function () {
    this.phase = 'waiting';
    this.el.setAttribute('animation-mixer', {
      clip: 'Triceratops_Idle_Break',
      timeScale: 1,
    });
    setTimeout(() => {
      this.runAudio.playSound();
      this.el.setAttribute('animation-mixer', {
        clip: 'Triceratops_Aggressive_Run_InPlace',
        timeScale: 1,
      });
      this.phase = 'run2';
    }, 3500);
    this.roar2Audio.playSound();
  },
  run2: function () {
    if (this.object.position.x < -70) {
      this.runAudio.stopSound();
      this.phase = 'end';
    }
    this.object.position.x -= this.triceSpeed;
  },
  shaking: function () {
    const rotation = this.car.getAttribute('rotation');
    if (rotation.x < -3 || rotation.x > 3) {
      this.carRotation = -this.carRotation;
      this.carWaves++;
    }
    if (this.carWaves === this.wavesNumber) {
      rotation.z = 0;
      this.car.setAttribute('rotation', rotation);
      // reset params
      this.carRotation = this.carRotationValue;
      this.carWaves = 0;
      this.isShaking = false;
    }
    rotation.x += this.carRotation;
    this.car.setAttribute('rotation', rotation);
  },
  tick: function () {
    if (this.isShaking) {
      this.shaking();
    }

    // Animation steps
    switch (this.phase) {
      case 'enter':
        this.enter();
        break;
      case 'roar1':
        this.roar1();
        break;
      case 'roar2':
        this.roar2();
        break;
      case 'roar3':
        this.roar3();
        break;
      case 'roar4':
        this.roar4();
        break;
      case 'run':
        this.run();
        break;
      case 'run2':
        this.run2();
        break;
      case 'impact':
        this.impact();
        break;
    }
  },
});
