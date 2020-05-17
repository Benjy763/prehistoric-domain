AFRAME.registerComponent('trex-animation', {
  schema: {},
  init: function () {
    let self = this;

    // Objects shortcut
    this.object = this.el.object3D;
    this.system = document.querySelector('a-scene').systems['game'];
    this.rotationDirection = 0.2;
    this.rotationoffset = 10;
    this.animationStarted = false;

    // Sound
    this.roarSoundPlaying = false;
    this.footStep1Playing = false;
    this.footStep1Audio;
    this.footStep2Audio;

    this.roarAudio = document.getElementById('roar');

    // Start tour listener
    this.el.addEventListener(
      'enter',
      () => {
        this.animationStarted = true;
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
    if (this.object.position.x < -24) {
      this.object.position.x += 0.03;
    }

    // Head movements
    if (this.rotationoffset > 0) {
      this.rotationoffset -= 0.8;
    }

    if (this.object.position.x < -24 && this.rotationoffset <= 0) {
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
  },
  tock: function () {
    if (this.animationStarted === true) {
      this.enter();
    }
  },
});
