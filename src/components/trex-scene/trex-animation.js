AFRAME.registerComponent('trex-animation', {
  schema: {},
  init: function () {
    // Objects shortcut
    this.object = this.el.object3D;
    this.system = document.querySelector('a-scene').systems['game'];
    this.car = document.querySelector('#trex-car');
    this.rotationDirection = 0.2;
    this.rotationoffset = 10;
    this.phase = '';
    this.maxPosition = -25;
    this.carRestarted = false;

    // Car shaking
    this.isShaking = false;
    this.carWaves = 0;
    this.carRotationValue = 0.025;
    this.wavesNumber = 6;
    this.carRotation = this.carRotationValue;

    // Sound
    this.footStep1Playing = false;
    this.bendDownSoundPlaying = false;
    this.bendUpSoundPlaying = false;
    this.snoringSoundPlaying = false;
    this.roarSoundPlaying = false;
    this.footStep1Audio;
    this.footStep2Audio;
    this.bendDownAudio;
    this.snoringAudio;
    this.bendUpAudio;
    this.roarAudio;
    this.longSnoringAudio;

    // Start tour listener
    this.el.addEventListener(
      'enter',
      () => {
        this.phase = 'enter';
      },
      false
    );
  },
  shaking: function () {
    const rotation = this.car.getAttribute('rotation');
    this.system.log(rotation.x);
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
  stopSounds: function () {
    this.el.addEventListener('sound-ended', (e) => {
      if (e.detail.id === 'foot-step-1') {
        this.footStep1Audio.stopSound();
      }
      if (e.detail.id === 'foot-step-2') {
        this.footStep2Audio.stopSound();
      }
      if (e.detail.id === 'benddown') {
        this.bendDownAudio.stopSound();
      }
      if (e.detail.id === 'snoring') {
        this.snoringAudio.stopSound();
      }
      if (e.detail.id === 'bendup') {
        this.bendUpAudio.stopSound();
      }
      if (e.detail.id === 'roar') {
        this.roarAudio.stopSound();
      }
      if (e.detail.id === 'long-snoring') {
        this.longSnoringAudio.stopSound();
      }
    });
  },
  // --- Phase functions ---
  enter: function () {
    this.footStep1Audio = this.el.components['sound__foot1'];
    this.footStep2Audio = this.el.components['sound__foot2'];
    this.bendDownAudio = this.el.components['sound__benddown'];
    this.snoringAudio = this.el.components['sound__snoring'];
    this.bendUpAudio = this.el.components['sound__bendup'];
    this.roarAudio = this.el.components['sound__roar'];
    this.longSnoringAudio = this.el.components['sound__longsnoring'];
    // Stop sounds when end playing
    this.stopSounds();

    // foot movements
    if (this.object.position.x < this.maxPosition) {
      this.object.position.x += 0.06;
    }

    // ----- Head movements -----
    if (this.rotationoffset > 0) {
      this.rotationoffset -= 0.8;
    }
    if (this.object.position.x < this.maxPosition && this.rotationoffset <= 0) {
      const rotation = this.el.getAttribute('rotation');

      // Head up
      if (rotation.x > 5) {
        this.rotationDirection = -0.15;
      }
      // Head down
      // Foot on the ground
      if (rotation.x < 0) {
        this.isShaking = true;
        // Left foot step on ground
        if (!this.footStep1Playing) {
          this.footStep1Audio.playSound();
          this.footStep1Playing = true;
        } else {
          // Right foot step on ground
          this.footStep2Audio.playSound();
          this.footStep1Playing = false;
        }
        this.rotationDirection = 0.15;
        this.rotationoffset = 10;
      }

      rotation.x += this.rotationDirection;
      this.el.setAttribute('rotation', rotation);
    }

    // Next Animation
    if (this.object.position.x >= this.maxPosition) {
      this.phase = 'bendDown';
    }
  },
  bendDown: function () {
    if (!this.bendDownSoundPlaying) {
      this.bendDownAudio.playSound();
      this.bendDownSoundPlaying = true;
    }
    const rotation = this.el.getAttribute('rotation');
    this.rotationDirection = 0.15;
    if (rotation.x < 17) {
      rotation.x += this.rotationDirection;
      this.el.setAttribute('rotation', rotation);
    } else {
      // Next Animation
      this.phase = 'snoring';
    }
  },
  snoring: function () {
    if (!this.snoringSoundPlaying) {
      this.snoringAudio.playSound();
      this.snoringSoundPlaying = true;
    }
    this.el.addEventListener('sound-ended', (e) => {
      if (e.detail.id === 'snoring') {
        this.phase = 'bendUp';
      }
    });
  },
  bendUp: function () {
    if (!this.bendUpSoundPlaying) {
      this.bendUpAudio.playSound();
      this.bendUpSoundPlaying = true;
    }
    const rotation = this.el.getAttribute('rotation');
    if (rotation.x > 0) {
      rotation.x -= this.rotationDirection;
      this.el.setAttribute('rotation', rotation);
    } else {
      // Next Animation
      this.phase = 'roar';
    }
  },
  roar: function () {
    this.el.setAttribute('animation-mixer', 'clip: roar');
    if (!this.roarSoundPlaying) {
      this.roarAudio.playSound();
      this.snoringSoundPlaying = true;
    }
    this.el.addEventListener('sound-ended', (e) => {
      if (e.detail.id === 'roar') {
        this.el.setAttribute('animation-mixer', 'clip: idle');
        this.phase = 'leave';
      }
    });
  },
  leave: function () {
    if (!this.carRestarted) {
      this.longSnoringAudio.playSound();
      const event = new Event('restart');
      this.car.dispatchEvent(event);
      this.carRestarted = true;
    }
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
      case 'bendDown':
        this.bendDown();
        break;
      case 'snoring':
        this.snoring();
        break;
      case 'bendUp':
        this.bendUp();
        break;
      case 'roar':
        this.roar();
        break;
      case 'leave':
        this.leave();
        break;
    }
  },
});
