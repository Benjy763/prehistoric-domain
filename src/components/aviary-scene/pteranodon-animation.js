AFRAME.registerComponent('pteranodon-animation', {
  schema: {},
  init: function () {
    this.tick = AFRAME.utils.throttleTick(this.tick, 25, this);

    // Objects shortcut
    this.object = this.el.object3D;
    this.system = document.querySelector('a-scene').systems['game'];
    this.car = document.querySelector('#aviary-car');
    this.phase = '';

    // Ptera run Path
    this.pteraMarker = 0; // Position on the curve
    this.pteraSpeed = 0.004; // Speed on the curve
    this.curve = new THREE.SplineCurve([
      new THREE.Vector2(-33.384, 1.828),
      new THREE.Vector2(5.136, -2.505),
      new THREE.Vector2(60, -4.233),
    ]);

    // Sound
    this.footStepAudio;
    this.footRoarAudio;

    // Start tour listener
    this.el.addEventListener(
      'enter',
      () => {
        // this.footStepAudio = this.el.components['sound__foot'];
        // this.footRoarAudio = this.el.components['sound__roar'];
        this.el.setAttribute('animation-mixer', 'clip: flying');
        // setTimeout(() => {
        //   this.footStepAudio.playSound();
        //   this.footRoarAudio.playSound();
        // }, 3200);
        this.phase = 'enter';
      },
      false
    );
  },
  // --- Phase functions ---
  enter: function () {
    if (this.system.truncMarker(this.pteraMarker) > 800) {
      const event = new Event('restartPtera');
      this.car.dispatchEvent(event);
      this.phase = 'finish';
    }
    this.pteraMarker = this.system.moveOnCurve(
      this.object,
      this.curve,
      this.pteraMarker,
      this.pteraSpeed
    );
  },
  tick: function () {
    // Animation steps
    switch (this.phase) {
      case 'enter':
        this.enter();
        break;
    }
  },
});
