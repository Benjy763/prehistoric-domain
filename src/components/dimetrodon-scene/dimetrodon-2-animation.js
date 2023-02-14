AFRAME.registerComponent('dimetrodon-2-animation', {
  schema: {},
  init: function () {
    this.tick = AFRAME.utils.throttleTick(this.tick, 25, this);

    // Objects shortcut
    this.object = this.el.object3D;
    this.system = document.querySelector('a-scene').systems['system'];
    this.movesManager =
      document.querySelector('a-scene').systems['movesManager'];
    this.mainScene = document.getElementById('main-scene');
    this.phase = '';

    // Dimetrodon run Path
    this.dimetrodonMarker = 0; // Position on the curve
    this.dimetrodonSpeed = 0.004; // Speed on the curve
    this.dimetrodonCurve = new THREE.SplineCurve([
      new THREE.Vector2(-42.875, -21.32),
      new THREE.Vector2(-49.144, -21.689),
    ]);
    this.dimetrodonMarker = this.movesManager.moveOnCurve(
      this.el.object3D,
      this.dimetrodonCurve,
      this.dimetrodonMarker,
      this.dimetrodonSpeed
    );

    // Sound

    // Start tour listener
    this.el.addEventListener(
      'enterWalk',
      () => {
        // Load sounds
        this.dimeMoveAudio = this.el.components['sound__dimemove'];

        this.el.setAttribute('animation-mixer', {
          clip: 'Animation',
          loop: true,
          crossFadeDuration: 1.5,
          timeScale: 0.3,
        });
        this.dimeMoveAudio.playSound();
        this.phase = 'enterWalk';
      },
      false
    );
  },
  // --- Phase functions ---
  enterWalk: function () {
    this.dimetrodonMarker = this.movesManager.moveOnCurve(
      this.el.object3D,
      this.dimetrodonCurve,
      this.dimetrodonMarker,
      this.dimetrodonSpeed
    );

    if (this.movesManager.truncMarker(this.dimetrodonMarker) > 900) {
      this.el.setAttribute('animation-mixer', {
        clip: 'stop',
        loop: true,
        crossFadeDuration: 1.5,
        timeScale: 0.3,
      });
      this.phase = 'enterWalk';
      this.phase = 'exit';
    }
  },
  tick: function () {
    // Animation steps
    switch (this.phase) {
      case 'enterWalk':
        this.enterWalk();
        break;
    }
  },
});
