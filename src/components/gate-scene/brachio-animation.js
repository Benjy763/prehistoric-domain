AFRAME.registerComponent('brachio-animation', {
  schema: {},
  init: function () {
    this.tick = AFRAME.utils.throttleTick(this.tick, 25, this);

    // Objects shortcut
    this.object = this.el.object3D;
    this.system = document.querySelector('a-scene').systems['system'];
    this.movesManager =
      document.querySelector('a-scene').systems['movesManager'];
    this.car = document.querySelector('#gate-car');
    this.phase = '';

    // Brachio run Path
    this.brachioMarker = 0; // Position on the curve
    this.brachioSpeed = 0.011; // Speed on the curve
    this.curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-67.74806, 0, -75.678),
      new THREE.Vector3(86.72, 0, -75.678),
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
        this.el.setAttribute(
          'animation-mixer',
          'clip: brachiosaurus_scetchfab'
        );
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
    if (this.movesManager.truncMarker(this.brachioMarker) > 600) {
      const event = new Event('restart');
      this.car.dispatchEvent(event);
      this.phase = 'finish';
    }
    this.brachioMarker = this.movesManager.moveOnCurve(
      this.object,
      this.curve,
      this.brachioMarker,
      this.brachioSpeed,
      true,
      true
    );
  },
  finish: function () {
    if (this.movesManager.truncMarker(this.brachioMarker) > 880) {
      this.el.setAttribute('visible', false);
      this.footStepAudio.stopSound();
      this.footRoarAudio.stopSound();
      this.phase = 'exit';
    }
    this.brachioMarker = this.movesManager.moveOnCurve(
      this.object,
      this.curve,
      this.brachioMarker,
      this.brachioSpeed
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
