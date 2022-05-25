AFRAME.registerComponent('trex-animation', {
  schema: {},
  init: function () {
    this.tick = AFRAME.utils.throttleTick(this.tick, 25, this);
    // Objects shortcut
    this.object = this.el.object3D;
    this.system = document.querySelector('a-scene').systems['game'];
    this.car = document.querySelector('#trex-car');
    this.phase = '';
    this.carRestarted = false;
    this.trexSlowing = false;
    // trex run Path
    this.trexMarker = 0; // Position on the curve
    this.trexSpeed = 0.002; // Speed on the curve
    this.curve = new THREE.SplineCurve([
      new THREE.Vector2(-87.691, 40.151),
      new THREE.Vector2(-75.557, 22.368),
      new THREE.Vector2(-65.671, 5.107),
      new THREE.Vector2(-51.749, -9.513),
      new THREE.Vector2(-27.272, -15.086),
    ]);

    // Car shaking
    this.isShaking = false;
    this.carWaves = 0;
    this.carRotationValue = 0.025;
    this.wavesNumber = 6;
    this.carRotation = this.carRotationValue;

    // Sound
    this.soundMixing1SoundPlaying = false;
    this.soundMixing1Audio = document.getElementById('sound-mixing-1');
    this.trexRoarAudio;
    this.trexFootStepAudioPlaying = false;
    this.trexFootStepAudio;
    this.trexLeaveAudioPlaying = false;
    this.trexLeaveAudio;

    // Start tour listener
    this.el.addEventListener(
      'enter',
      () => {
        // Load sounds
        this.trexRoarAudio = this.el.components['sound__trexroar'];
        this.trexFootStepAudio = this.el.components['sound__trexfootstep'];
        this.trexDrinkAudio = this.el.components['sound__trexdrink'];
        this.trexDrinkEndAudio = this.el.components['sound__trexdrinkend'];

        // Launch animation
        setTimeout(() => {
          this.phase = 'trexWait';
        }, 6000);
      },
      false
    );
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
  trexWait: function () {
    setTimeout(() => {
      if (!this.soundMixing1SoundPlaying) {
        this.soundMixing1Audio.play();
        this.soundMixing1SoundPlaying = true;
      }
      this.soundMixing1Audio.onended = () => {
        this.el.setAttribute('animation-mixer', {
          clip: 'T_Rex_Walk_InPlace',
          timeScale: 1,
          crossFadeDuration: 0.4,
        });
        this.phase = 'trexEnter';
      };
    }, 2000);
    this.phase = 'exit';
  },
  trexEnter: function () {
    if (this.system.truncMarker(this.trexMarker) > 940 && !this.trexSlowing) {
      this.trexSlowing = true;
      this.trexSpeed = 0.002;
      this.el.setAttribute('animation-mixer', {
        clip: 'T_Rex_Walk_InPlace',
        timeScale: 0.6,
        crossFadeDuration: 0.4,
      });
    }
    if (this.system.truncMarker(this.trexMarker) > 960) {
      this.trexFootStepAudioPlaying = false;
      this.trexFootStepAudio.stopSound();
      this.trexSpeed = 0.0012;
      this.el.setAttribute('animation-mixer', {
        clip: 'T_Rex_Drink',
        timeScale: 1,
        crossFadeDuration: 0.2,
      });
      this.trexDrinkAudio.playSound();
      this.phase = 'trexDrink';
      return;
    }
    if (!this.trexFootStepAudioPlaying) {
      setTimeout(() => {
        this.trexFootStepAudio.playSound();
      }, 500);
      this.trexFootStepAudioPlaying = true;
    }
    this.trexMarker = this.system.moveOnCurve(
      this.object,
      this.curve,
      this.trexMarker,
      this.trexSpeed
    );
    this.system.updateRotation(
      this.el,
      this.object,
      this.curve,
      this.trexMarker,
      this.trexSpeed
    );
  },
  trexDrink: function () {
    setTimeout(() => {
      this.trexRoarAudio.playSound();
      this.el.setAttribute('animation-mixer', {
        clip: 'T_Rex_Idle_Roar2',
        timeScale: 0.8,
        crossFadeDuration: 0.2,
      });
      this.phase = 'trexRoar';
    }, 8000);
    this.phase = 'trexDrinking';
  },
  trexRoar: function () {
    setTimeout(() => {
      this.el.setAttribute('animation-mixer', {
        clip: 'T_Rex_Drink',
        timeScale: 0.6,
        crossFadeDuration: 0.2,
      });
      setTimeout(() => {
        this.trexDrinkEndAudio.playSound();
      }, 800);
      this.phase = 'trexFinish';
    }, 4000);
    this.phase = 'trexRoaring';
  },
  trexFinish: function () {
    setTimeout(() => {
      const event = new Event('restart');
      this.car.dispatchEvent(event);
    }, 2500);
    this.phase = 'end';
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
      case 'trexWait':
        this.trexWait();
        break;
      case 'trexEnter':
        this.trexEnter();
        break;
      case 'trexDrink':
        this.trexDrink();
        break;
      case 'trexRoar':
        this.trexRoar();
        break;
      case 'trexFinish':
        this.trexFinish();
        break;
    }
  },
});
