AFRAME.registerComponent('dilo-animation', {
  schema: {},
  init: function () {
    this.tick = AFRAME.utils.throttleTick(this.tick, 25, this);
    // Objects shortcut
    this.object = this.el.object3D;
    this.system = document.querySelector('a-scene').systems['system'];
    this.movesManager =
      document.querySelector('a-scene').systems['movesManager'];
    this.phase = '';
    this.car = document.querySelector('#dilo-car');

    // dilo run Path
    this.diloMarker = 0; // Position on the curve
    this.diloSpeed = 0.0008; // Speed on the curve
    this.curve = new THREE.SplineCurve([
      new THREE.Vector2(112, 9.548),
      new THREE.Vector2(50.377, 3.005),
      new THREE.Vector2(41.511, -16.068),
      new THREE.Vector2(36.279, -28.779),
      new THREE.Vector2(36.382, -40.264),
      new THREE.Vector2(26.553, -57.518),
      new THREE.Vector2(16.536, -84.802),
      new THREE.Vector2(13.938, -133.246),
    ]);

    // Sound
    this.diloWalkAudio;
    this.diloRoar2Audio;
    this.diloRoar2AudioPlayed = false;

    // Start tour listener
    this.el.addEventListener(
      'enter',
      () => {
        // Load sounds
        this.diloWalkAudio = this.el.components['sound__dilowalk'];
        this.diloRoar2Audio = this.el.components['sound__diloroar2'];
        this.diloWalkAudio.playSound();

        this.el.setAttribute('animation-mixer', {
          clip: 'CINEMA_4D_Main',
          timeScale: 0.9,
        });
        this.phase = 'start';
      },
      false
    );
  },
  // --- Phase functions ---
  start: function () {
    if (
      this.movesManager.truncMarker(this.diloMarker) > 500 &&
      !this.diloRoar2AudioPlayed
    ) {
      this.diloRoar2AudioPlayed = true;
      this.diloRoar2Audio.playSound();
      return;
    }
    if (this.movesManager.truncMarker(this.diloMarker) > 900) {
      this.phase = 'stop';
      this.diloWalkAudio.stopSound();
      return;
    }
    this.diloMarker = this.movesManager.moveOnCurve(
      this.object,
      this.curve,
      this.diloMarker,
      this.diloSpeed
    );
    this.movesManager.updateRotation(
      this.el,
      this.object,
      this.curve,
      this.diloMarker,
      this.diloSpeed
    );
  },
  tick: function () {
    // Animation steps
    switch (this.phase) {
      case 'start':
        this.start();
        break;
    }
  },
});
