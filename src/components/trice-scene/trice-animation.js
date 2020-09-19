AFRAME.registerComponent('trice-animation', {
  schema: {},
  init: function () {
    // Objects shortcut
    this.object = this.el.object3D;
    this.system = document.querySelector('a-scene').systems['game'];
    this.car = document.querySelector('#trice-car');
    this.phase = '';
    // trex run Path
    this.triceMarker = 0; // Position on the curve
    this.triceSpeed = 0.0014; // Speed on the curve
    this.curve = new THREE.SplineCurve([
      new THREE.Vector2(9.127, -75.855),
      new THREE.Vector2(9.127, -80),
      new THREE.Vector2(13.349, -91.944),
      new THREE.Vector2(19, -160.74),
    ]);

    // Car shaking
    this.isShaking = false;
    this.carWaves = 0;
    this.carRotationValue = 0.08;
    this.wavesNumber = 12;
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
    this.snoringAudio.playSound();
    this.phase = 'waiting';
    this.el.addEventListener('sound-ended', (e) => {
      if (e.detail.id === 'snoring') {
        this.phase = 'roar1';
      }
    });
    // this.el.setAttribute('animation-mixer', {
    //   clip: 'gate-*',
    //   timeScale: 0.8,
    // });
  },
  roar1: function () {
    this.phase = 'waiting';
    setTimeout(() => {
      this.phase = 'agressive';
    }, 4000);
    this.el.setAttribute('animation-mixer', {
      clip: 'Triceratops_Idle_Break',
      timeScale: 1,
    });
    setTimeout(() => {
      this.roar1Audio.playSound();
    }, 1000);
  },
  agressive: function () {
    this.phase = 'waiting';
    setTimeout(() => {
      this.phase = 'roar2';
    }, 2000);
    this.agressiveAudio.playSound();
    this.el.setAttribute('animation-mixer', {
      clip: 'Triceratops_Aggressive_Idle_Break',
      timeScale: 1,
    });
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
    this.el.setAttribute('animation-mixer', {
      clip: 'Triceratops_Idle_Break',
      timeScale: 1,
    });
    setTimeout(() => {
      this.roar2Audio.playSound();
    }, 1000);
  },
  shaking: function () {
    const rotation = this.car.getAttribute('rotation');
    if (rotation.z < -0.1 || rotation.z > 0.1) {
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
    rotation.z += this.carRotation;
    this.car.setAttribute('rotation', rotation);
  },
  updateRotation: function () {
    const newPosition = this.system.convertPosition(
      this.curve.getPointAt(this.triceMarker + this.triceSpeed),
      this.object.position.y
    );
    this.object.lookAt(newPosition.x, newPosition.y, newPosition.z);
    // Correct rotation with offset
    const rotation = this.el.getAttribute('rotation');
    this.el.setAttribute('rotation', rotation);
  },
  run: function () {
    if (this.system.truncMarker(this.triceMarker) > 270 && !this.shaked) {
      this.impactAudio.play();
      setTimeout(() => {
        this.impactAudio.pause();
      }, 2000);
      this.isShaking = true;
      this.shaked = true;
    }
    if (this.system.truncMarker(this.triceMarker) > 900) {
      this.phase = 'waiting';
      setTimeout(() => {
        const event = new Event('restart');
        this.car.dispatchEvent(event);
      }, 3000);
      return;
    }
    if (this.triceSpeed < 0.003) {
      this.triceSpeed += 0.00008;
    }
    this.triceMarker += this.triceSpeed;
    this.object.position.copy(
      this.system.convertPosition(
        this.curve.getPointAt(this.triceMarker),
        this.object.position.y
      )
    );
    this.updateRotation();
  },
  tock: function () {
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
      case 'agressive':
        this.agressive();
        break;
      case 'roar2':
        this.roar2();
        break;
      case 'run':
        this.run();
        break;
    }
  },
});
