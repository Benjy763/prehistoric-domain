AFRAME.registerComponent('trex-animation', {
  schema: {},
  init: function () {
    // Objects shortcut
    this.object = this.el.object3D;
    this.system = document.querySelector('a-scene').systems['game'];
    this.car = document.querySelector('#trex-car');
    this.goat = document.querySelector('#goat');
    this.goatPosition;
    this.goatTimeScale = 1;
    this.phase = '';
    this.carRestarted = false;
    // trex run Path
    this.trexMarker = 0; // Position on the curve
    this.trexSpeed = 0.001; // Speed on the curve
    this.curve = new THREE.SplineCurve([
      new THREE.Vector2(-22, 60.677),
      new THREE.Vector2(-21.5, -4.914),
      new THREE.Vector2(-29.702, -65.513),
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
    this.goatRoarAudio;
    this.goatElevatorAudio;
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
        this.goatRoarAudio = this.goat.components['sound__goatroar'];
        this.goatElevatorAudio = this.goat.components['sound__goatelevator'];
        this.trexRoarAudio = this.el.components['sound__trexroar'];
        this.trexFootStepAudio = this.el.components['sound__trexfootstep'];
        this.trexLeaveAudio = this.el.components['sound__trexleave'];

        // Launch goat animation
        setTimeout(() => {
          this.goatAnimation();
          this.phase = 'enter';
        }, 5000);
      },
      false
    );
  },
  goatAnimation: function () {
    this.goat.setAttribute('animation-mixer', {
      clip: 'Take 001',
    });
    setInterval(() => {
      this.goatTimeScale = -this.goatTimeScale;
      this.goat.setAttribute('animation-mixer', {
        clip: 'Take 001',
        timeScale: this.goatTimeScale,
      });
    }, 6000);
    this.goatElevatorAudio.playSound();
    setInterval(() => {
      this.goatRoarAudio.playSound();
    }, 20000);
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
  enter: function () {
    this.goatPosition = this.goat.getAttribute('position');
    this.goatPosition.y += 0.02;
    this.goat.setAttribute('position', this.goatPosition);
    if (this.goat.getAttribute('position').y > 0.6) {
      this.el.setAttribute('visible', 'true');
      this.phase = 'goatWait';
    }
  },
  goatWait: function () {
    setTimeout(() => {
      if (!this.soundMixing1SoundPlaying) {
        this.soundMixing1Audio.play();
        this.soundMixing1SoundPlaying = true;
      }
      this.soundMixing1Audio.onended = () => {
        this.phase = 'trexEnter';
      };
    }, 5000);
  },
  trexEnter: function () {
    if (this.system.truncMarker(this.trexMarker) > 510) {
      this.trexFootStepAudioPlaying = false;
      this.trexFootStepAudio.stopSound();
      this.phase = 'trexRoar';
      return;
    }
    this.el.setAttribute('animation-mixer', {
      clip: 'Rex_Walk',
    });
    if (!this.trexFootStepAudioPlaying) {
      setTimeout(() => {
        this.trexFootStepAudio.playSound();
      }, 800);
      this.trexFootStepAudioPlaying = true;
    }
    this.trexMarker += this.trexSpeed;
    this.object.position.copy(
      this.system.convertPosition(
        this.curve.getPointAt(this.trexMarker),
        this.object.position.y
      )
    );
    this.updateRotation();
  },
  trexRoar: function () {
    this.trexRoarAudio.playSound();
    this.el.setAttribute('animation-mixer', {
      clip: 'Rex_Action_002',
    });
    setTimeout(() => {
      this.phase = 'trexLeave';
    }, 6500);
    this.phase = 'pause';
  },
  trexLeave: function () {
    if (this.system.truncMarker(this.trexMarker) > 950) {
      this.el.setAttribute('visible', 'false');
      const event = new Event('restart');
      this.car.dispatchEvent(event);
      this.phase = 'trexFinish';
      return;
    }
    this.el.setAttribute('animation-mixer', {
      clip: 'Rex_Walk',
    });
    if (!this.trexLeaveAudioPlaying) {
      setTimeout(() => {
        this.trexLeaveAudio.playSound();
      }, 500);
      this.trexLeaveAudioPlaying = true;
    }
    this.trexMarker += this.trexSpeed;
    this.object.position.copy(
      this.system.convertPosition(
        this.curve.getPointAt(this.trexMarker),
        this.object.position.y
      )
    );
    this.updateRotation();
  },
  updateRotation: function () {
    const newPosition = this.system.convertPosition(
      this.curve.getPointAt(this.trexMarker + this.trexSpeed),
      this.object.position.y
    );
    this.object.lookAt(newPosition.x, newPosition.y, newPosition.z);
    // Correct rotation with offset
    const rotation = this.el.getAttribute('rotation');
    this.el.setAttribute('rotation', rotation);
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
      case 'goatWait':
        this.goatWait();
        break;
      case 'trexEnter':
        this.trexEnter();
        break;
      case 'trexRoar':
        this.trexRoar();
        break;
      case 'trexLeave':
        this.trexLeave();
        break;
    }
  },
});
