AFRAME.registerComponent('dimetrodon-animation', {
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

    //Sound markers
    this.dimeRunAudioPlayed = false;

    // Dimetrodon run Path
    this.dimetrodonMarker = 0; // Position on the curve
    this.dimetrodonSpeed = 0.00072; // Speed on the curve
    this.dimetrodonCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-17.023, 0, 15.229),
      new THREE.Vector3(-26.376, 0, 1.881),
      new THREE.Vector3(-30.837, 0, -11.567),
      new THREE.Vector3(-25.591, 0, -20.955),
    ]);

    this.isAcceleration = false;

    // Sound

    // Start tour listener
    this.el.addEventListener(
      'enterWalk',
      () => {
        // Load sounds
        this.dimeAttackAudio = this.el.components['sound__dimeattack'];
        this.dimeRunAudio = this.el.components['sound__dimerun'];
        this.dimeWalkAudio = this.el.components['sound__dimewalk'];
        this.dimeRoarAudio = this.el.components['sound__dimeroar'];

        this.el.setAttribute('animation-mixer', {
          clip: 'Animation',
          loop: true,
          crossFadeDuration: 0.4,
          timeScale: 0.4,
        });
        this.dimeWalkAudio.playSound();
        setTimeout(() => {
          this.dimeRoarAudio.playSound();
        }, 5000);
        this.phase = 'enterWalk';
      },
      false
    );

    this.el.addEventListener(
      'walkFast',
      () => {
        this.el.setAttribute('animation-mixer', {
          clip: 'Animation',
          loop: true,
          crossFadeDuration: 1,
          timeScale: 1.6,
        });
        this.dimeRunAudio.playSound();
        this.dimeWalkAudio.stopSound();
        this.phase = 'walkFast';
      },
      false
    );
  },
  // --- Phase functions ---
  enterWalk: function () {
    this.dimetrodonMarker = this.movesManager.moveOnCurve(
      this,
      this.el.object3D,
      this.dimetrodonCurve,
      this.dimetrodonMarker,
      this.dimetrodonSpeed
    );

    if (this.movesManager.truncMarker(this.dimetrodonMarker) > 950) {
      this.phase = 'exit';
    }
  },
  walkFast: function () {
    this.dimetrodonMarker = this.movesManager.moveOnCurve(
      this,
      this.el.object3D,
      this.dimetrodonCurve,
      this.dimetrodonMarker,
      this.dimetrodonSpeed
    );

    if (this.dimetrodonSpeed < 0.004) {
      this.dimetrodonSpeed += 0.0002;
    }

    if (
      this.movesManager.truncMarker(this.dimetrodonMarker) > 800 &&
      !this.dimeRunAudioPlayed
    ) {
      this.dimeAttackAudio.playSound();
      this.dimeRunAudio.stopSound();
      this.dimeRunAudioPlayed = true;
    }

    if (this.movesManager.truncMarker(this.dimetrodonMarker) > 950) {
      this.phase = 'exit';
    }
  },
  tick: function () {
    // Animation steps
    switch (this.phase) {
      case 'enterWalk':
        this.enterWalk();
        break;
      case 'walkFast':
        this.walkFast();
        break;
    }
  },
});
