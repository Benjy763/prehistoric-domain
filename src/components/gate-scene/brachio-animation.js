AFRAME.registerComponent('brachio-animation', {
  schema: {},
  init: function () {
    // Objects shortcut
    this.object = this.el.object3D;
    this.system = document.querySelector('a-scene').systems['game'];
    this.car = document.querySelector('#gate-car');
    this.phase = '';
    // trex run Path
    this.brachioMarker = 0; // Position on the curve
    this.brachioSpeed = 0.00022; // Speed on the curve
    this.curve = new THREE.SplineCurve([
      new THREE.Vector2(-49.327, -75.678),
      new THREE.Vector2(86.72, -75.678),
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
    if (this.system.truncMarker(this.brachioMarker) > 700) {
      this.footStepAudio.stopSound();
      this.footRoarAudio.stopSound();
      const event = new Event('restart');
      this.car.dispatchEvent(event);
      this.phase = 'exit';
      return;
    }
    this.brachioMarker += this.brachioSpeed;
    this.object.position.copy(
      this.system.convertPosition(
        this.curve.getPointAt(this.brachioMarker),
        this.object.position.y
      )
    );
  },
  tock: function () {
    // Animation steps
    switch (this.phase) {
      case 'enter':
        this.enter();
        break;
    }
  },
});
