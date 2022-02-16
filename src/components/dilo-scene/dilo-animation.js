AFRAME.registerComponent('dilo-animation', {
  schema: {},
  init: function () {
    this.tick = AFRAME.utils.throttleTick(this.tick, 25, this);
    // Objects shortcut
    this.object = this.el.object3D;
    this.system = document.querySelector('a-scene').systems['game'];
    this.phase = '';
    this.car = document.querySelector('#dilo-car');

    // dilo run Path
    this.diloMarker = 0; // Position on the curve
    this.diloSpeed = 0.0016; // Speed on the curve
    this.curve = new THREE.SplineCurve([
      new THREE.Vector2(51.594, -20.419),
      new THREE.Vector2(39.932, -23.053),
      new THREE.Vector2(34.854, -27.586),
      new THREE.Vector2(34.578, -37.863),
      new THREE.Vector2(32.643, -48.31),
      new THREE.Vector2(33.145, -64.481),
      new THREE.Vector2(37.96, -83.969),
    ]);

    // Sound
    this.diloWalkAudio;
    this.diloRoar2Audio;

    // Start tour listener
    this.el.addEventListener(
      'enter',
      () => {
        // Load sounds
        this.diloWalkAudio = this.el.components['sound__dilowalk'];
        this.diloRoar2Audio = this.el.components['sound__diloroar2'];
        this.diloWalkAudio.playSound();
        setTimeout(() => {
          this.diloRoar2Audio.playSound();
        }, 5000);

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
    if (this.system.truncMarker(this.diloMarker) > 900) {
      this.phase = 'stop';
      this.diloWalkAudio.stopSound();
      return;
    }
    this.diloMarker = this.system.moveOnCurve(
      this.object,
      this.curve,
      this.diloMarker,
      this.diloSpeed
    );
    this.system.updateRotation(
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
