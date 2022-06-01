AFRAME.registerComponent('pteranodon-animation', {
  schema: {},
  init: function () {
    this.tick = AFRAME.utils.throttleTick(this.tick, 25, this);

    // Objects shortcut
    this.object = this.el.object3D;
    this.system = document.querySelector('a-scene').systems['system'];
    this.movesManager =
      document.querySelector('a-scene').systems['movesManager'];
    this.car = document.querySelector('#aviary-car');
    this.phase = '';

    // Ptera run Path
    this.pteraMarker = 0; // Position on the curve
    this.pteraSpeed = 0.003; // Speed on the curve
    this.curve = new THREE.SplineCurve([
      new THREE.Vector2(-46.398, 8),
      new THREE.Vector2(5.136, -3.5),
      new THREE.Vector2(90, 5),
    ]);

    // Sound
    this.passingAudio;

    // Start tour listener
    this.el.addEventListener(
      'enter',
      () => {
        this.passingAudio = this.el.components['sound__passing'];
        this.el.setAttribute('animation-mixer', 'clip: flying');
        this.passingAudio.playSound();
        setTimeout(() => {
          this.phase = 'enter';
        }, 2000);
      },
      false
    );
  },
  // --- Phase functions ---
  enter: function () {
    if (this.movesManager.truncMarker(this.pteraMarker) > 800) {
      const event = new Event('restartPtera');
      this.car.dispatchEvent(event);
      this.phase = 'finish';
    }
    this.pteraMarker = this.movesManager.moveOnCurve(
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
