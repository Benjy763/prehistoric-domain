AFRAME.registerComponent('trex-animation', {
  schema: {},
  init: function () {
    let self = this;

    // Objects shortcut
    this.object = this.el.object3D;
    this.system = document.querySelector('a-scene').systems['game'];
    this.rotationDirection = 0.2;
    this.rotationoffset = 10;
    this.animationStep = '';
    this.maxPosition = -25;

    // Sound
    this.footStep1Playing = false;
    this.bendDownSoundPlaying = false;
    this.roarSoundPlaying = false;
    this.footStep1Audio;
    this.footStep2Audio;
    this.bendDownAudo = document.getElementById('benddown');
    this.roarAudio = document.getElementById('roar');

    // Start tour listener
    this.el.addEventListener(
      'enter',
      () => {
        this.animationStep = 'enter';
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
      this.system.log(rotation.x);

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
      this.animationStep = 'bendDown';
    }
  },
  bendDown: function () {
    if (!this.bendDownSoundPlaying) {
      this.bendDownAudo.play();
      this.bendDownSoundPlaying = true;
    }
    const rotation = this.el.getAttribute('rotation');
    if (rotation.x < 17) {
      rotation.x -= this.rotationDirection;
      this.el.setAttribute('rotation', rotation);
    } else {
      // Next Animation
    }
  },
  tock: function () {
    // Animation steps
    if (this.animationStep === 'enter') {
      this.enter();
    }

    if (this.animationStep === 'bendDown') {
      this.bendDown();
    }
  },
});
