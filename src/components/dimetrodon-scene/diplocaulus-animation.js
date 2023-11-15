AFRAME.registerComponent('diplocaulus-animation', {
  schema: {},
  init: function () {
    this.tick = AFRAME.utils.throttleTick(this.tick, 25, this);

    // Objects shortcut
    this.object = this.el.object3D;
    this.system = document.querySelector('a-scene').systems['system'];
    this.movesManager =
      document.querySelector('a-scene').systems['movesManager'];
    this.dimetrodon = document.getElementById('dimetrodon');
    this.dimetrodon2 = document.getElementById('dimetrodon-2');
    this.phase = '';
    this.dimetrodon2Started = false;

    // Rabbit run Path
    this.rabbitMarker = 0; // Position on the curve
    this.rabbitSpeed = 0.00025; // Speed on the curve
    this.rabbitCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-18.495, -0.30206, -0.607),
      new THREE.Vector3(-22.077, -0.30206, -0.806),
      new THREE.Vector3(-26.389, -0.30206, -2.209),
      new THREE.Vector3(-30.758, -0.30206, -5.863),
      new THREE.Vector3(-32.198, -0.30206, -14.883),
      new THREE.Vector3(-25.586, -0.30206, -22.008),
    ]);

    // Sound

    // Start tour listener
    this.el.addEventListener(
      'enterWalk',
      () => {
        // Load sounds
        this.rabbitWalkAudio = this.el.components['sound__rabbitwalk'];
        this.rabbitCryAudio = this.el.components['sound__rabbitcry'];

        this.el.setAttribute('animation-mixer', {
          clip: 'Walk',
          loop: true,
          crossFadeDuration: 0.4,
          timeScale: 1,
        });
        this.rabbitWalkAudio.playSound();
        this.phase = 'enterWalk';
      },
      false
    );
  },
  // --- Phase functions ---
  enterWalk: function () {
    this.rabbitMarker = this.movesManager.moveOnCurve(
      this,
      this.el.object3D,
      this.rabbitCurve,
      this.rabbitMarker,
      this.rabbitSpeed
    );

    if (
      this.movesManager.truncMarker(this.rabbitMarker) > 380 &&
      !this.dimetrodon2Started
    ) {
      const event = new Event('enterWalk');
      this.dimetrodon2.dispatchEvent(event);
      this.dimetrodon2Started = true;
    }

    if (this.movesManager.truncMarker(this.rabbitMarker) > 400) {
      this.el.setAttribute('animation-mixer', {
        clip: 'LandAction2_Broadcast',
        loop: true,
        crossFadeDuration: 0.4,
        timeScale: 0.2,
      });
      this.rabbitWalkAudio.stopSound();
      this.phase = 'lookAround';
    }
  },
  lookAround: function () {
    setTimeout(() => {
      // Trigger Rabbit animation
      const event = new Event('enterWalk');
      this.dimetrodon.dispatchEvent(event);
    }, 13000);
    setTimeout(() => {
      this.el.setAttribute('animation-mixer', {
        clip: 'Run',
        loop: true,
        crossFadeDuration: 0.4,
        timeScale: 1,
      });
      this.rabbitSpeed = 0.0042;
      this.rabbitCryAudio.playSound();
      this.phase = 'runFast';
      const event = new Event('walkFast');
      this.dimetrodon.dispatchEvent(event);
    }, 32000);
    this.phase = 'exit';
  },
  runFast: function () {
    this.rabbitMarker = this.movesManager.moveOnCurve(
      this,
      this.el.object3D,
      this.rabbitCurve,
      this.rabbitMarker,
      this.rabbitSpeed
    );

    if (this.movesManager.truncMarker(this.rabbitMarker) > 900) {
      this.phase = 'exit';
    }
  },
  tick: function () {
    // Animation steps
    switch (this.phase) {
      case 'enterWalk':
        this.enterWalk();
        break;
      case 'lookAround':
        this.lookAround();
        break;
      case 'runFast':
        this.runFast();
        break;
    }
  },
});
