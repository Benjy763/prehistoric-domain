AFRAME.registerComponent('quetza-animation', {
  schema: {},
  init: function () {
    this.tick = AFRAME.utils.throttleTick(this.tick, 25, this);

    // Objects shortcut
    this.object = this.el.object3D;
    this.system = document.querySelector('a-scene').systems['game'];
    this.car = document.querySelector('#aviary-car');
    this.phase = '';

    // Quetza run Path
    this.quetzaMarker = 0; // Position on the curve
    this.quetzaSpeed = 0.0003; // Speed on the curve
    this.curve = new THREE.SplineCurve([
      new THREE.Vector2(31.025, -30.037), // y,z and x to 13.622
      new THREE.Vector2(28.075, -6.894),
      new THREE.Vector2(31.464, -2.59),
      new THREE.Vector2(72.264, -2.59),
    ]);

    // Sound
    this.footStepAudio;
    this.footRoarAudio;

    // Start tour listener
    this.el.addEventListener(
      'enter',
      () => {
        this.footStepAudio = this.el.components['sound__foot'];
        this.footRoarAudio = this.el.components['sound__roar'];
        this.el.setAttribute('animation-mixer', 'clip: quetzasaurus_scetchfab');
        setTimeout(() => {
          this.footStepAudio.playSound();
          this.footRoarAudio.playSound();
        }, 3200);
        this.phase = 'enter';
      },
      false
    );
  },
  // --- Phase functions ---
  enter: function () {
    if (this.system.truncMarker(this.quetzaMarker) > 600) {
      const event = new Event('restart');
      this.car.dispatchEvent(event);
      this.phase = 'finish';
    }
    this.quetzaMarker = this.system.moveOnCurve(
      this.object,
      this.curve,
      this.quetzaMarker,
      this.quetzaSpeed,
      'yz'
    );
  },
  finish: function () {
    if (this.system.truncMarker(this.quetzaMarker) > 900) {
      this.el.setAttribute('visible', false);
      this.footStepAudio.stopSound();
      this.footRoarAudio.stopSound();
      this.phase = 'exit';
    }
    this.quetzaMarker = this.system.moveOnCurve(
      this.object,
      this.curve,
      this.quetzaMarker,
      this.quetzaSpeed,
      'yz'
    );
  },
  tick: function () {
    // Animation steps
    switch (this.phase) {
      case 'enter':
        this.enter();
        break;
      case 'finish':
        this.finish();
        break;
    }
  },
});
