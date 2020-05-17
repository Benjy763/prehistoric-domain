AFRAME.registerComponent('trex-animation', {
  schema: {},
  init: function () {
    let self = this;

    // Objects shortcut
    this.object = this.el.object3D;
    this.system = document.querySelector('a-scene').systems['game'];
    this.car = document.querySelector('#car');
    this.rotationDirection = 0.2;
    this.rotationoffset = 10;
    this.phase = '';
    this.maxPosition = -25;
    this.carRestarted = false;

    // Sound
    this.footStep1Playing = false;
    this.bendDownSoundPlaying = false;
    this.bendUpSoundPlaying = false;
    this.snoringSoundPlaying = false;
    this.roarSoundPlaying = false;
    this.footStep1Audio;
    this.footStep2Audio;
    this.bendDownAudio = document.getElementById('benddown');
    this.snoringAudio = document.getElementById('snoring');
    this.bendUpAudio = document.getElementById('bendup');
    this.roarAudio = document.getElementById('roar');

    // Start tour listener
    this.el.addEventListener(
      'enter',
      () => {
        this.phase = 'enter';
      },
      false
    );
  },
  enter: function () {
    this.footStep1Audio = document.getElementById('trex').components[
      'sound__foot1'
    ];
    this.footStep2Audio = document.getElementById('trex').components[
      'sound__foot2'
    ];

    // foot movements
    if (this.object.position.x < this.maxPosition) {
      this.object.position.x += 0.03;
    }

    // Head movements
    if (this.rotationoffset > 0) {
      this.rotationoffset -= 0.8;
    }

    if (this.object.position.x < this.maxPosition && this.rotationoffset <= 0) {
      const rotation = this.el.getAttribute('rotation');

      if (rotation.x > 5) {
        this.rotationDirection = -0.15;
      }
      if (rotation.x < 0) {
        if (!this.footStep1Playing) {
          this.footStep1Audio.playSound();
          this.footStep1Playing = true;
        } else {
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
      this.bendDownAudio.play();
      this.bendDownSoundPlaying = true;
    }
    const rotation = this.el.getAttribute('rotation');
    if (rotation.x < 17) {
      rotation.x -= this.rotationDirection;
      this.el.setAttribute('rotation', rotation);
    } else {
      // Next Animation
      this.phase = 'snoring';
    }
  },
  snoring: function () {
    const self = this;
    if (!this.snoringSoundPlaying) {
      this.snoringAudio.play();
      this.snoringSoundPlaying = true;
    }
    this.snoringAudio.onended = function () {
      self.phase = 'bendUp';
    };
  },
  bendUp: function () {
    if (!this.bendUpSoundPlaying) {
      this.bendUpAudio.play();
      this.bendUpSoundPlaying = true;
    }
    const rotation = this.el.getAttribute('rotation');
    if (rotation.x > 0) {
      rotation.x += this.rotationDirection;
      this.el.setAttribute('rotation', rotation);
    } else {
      // Next Animation
      this.phase = 'roar';
    }
  },
  roar: function () {
    const self = this;
    this.el.setAttribute('animation-mixer', 'clip: roar');
    if (!this.roarSoundPlaying) {
      this.roarAudio.play();
      this.snoringSoundPlaying = true;
    }
    this.roarAudio.onended = function () {
      console.log('test');

      self.el.setAttribute('animation-mixer', 'clip: idle');
      self.phase = 'leave';
    };
  },
  tock: function () {
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
        if (!this.carRestarted) {
          const event = new Event('restart');
          self.car.dispatchEvent(event);
          this.carRestarted = true;
        }
        break;
    }
  },
});
