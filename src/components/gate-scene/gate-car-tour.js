AFRAME.registerComponent('gate-car-tour', {
  init: function () {
    this.scene = 'gate';
    this.tick = AFRAME.utils.throttleTick(this.tick, 60, this);

    this.system = document.querySelector('a-scene').systems['game'];
    this.console = document.querySelector('a-scene').systems['console'];
    this.gate = document.querySelector('#gate');
    this.gateSound = document.getElementById('gate-sound');
    this.carControls;
    //this.brachio = document.querySelector('#brachio');
    // Tour Path
    const curve = new THREE.SplineCurve([
      new THREE.Vector2(7.988, 81.899),
      new THREE.Vector2(9.7, -174.7),
    ]);

    // Animation phase
    this.sceneChanged = false;

    // Sound
    this.soundMixing1SoundPlaying = false;
    this.soundMixing1Audio = document.getElementById('sound-mixing-1');

    // Register current tour in system
    this.console.registerCurrentTour(this);

    // Init car (when reference is registered in the system) with tour data
    document.addEventListener('carRegistered', () => {
      // Get car reference
      this.carControls = this.system.carReference;
      // Init tour path for the car
      this.carControls.initParams(curve, 700);
    });

    // Start tour listeners
    this.el.addEventListener(
      'start',
      () => {
        this.phase = 'start';
        // Update console statuses
        this.carControls.changeDrivingState('starting');
        this.console.updateSituation();
        document.getElementById('jungle-asset').play();
      },
      false
    );

    // Restart tour listener, trigger by brachio controler
    this.el.addEventListener(
      'restart',
      () => {
        this.phase = 'restart';
      },
      false
    );
  },
  // --- Phase functions ---
  start: function () {
    if (this.system.truncMarker(this.carControls.carMarker) === 270) {
      this.gateSound.play();
      this.gate.setAttribute('animation-mixer', {
        clip: 'gate-*',
        timeScale: 0.8,
      });
    }
    if (this.system.truncMarker(this.carControls.carMarker) === 305) {
      this.gate.setAttribute('animation-mixer', {
        clip: 'gate-*',
        timeScale: 0,
      });
    }
    if (this.system.truncMarker(this.carControls.carMarker) === 540) {
      this.phase = 'stop';
    }
  },
  stop: function () {
    this.carControls.changeDrivingState('stopping');
    if (this.carControls.carSpeed <= 0) {
      this.phase = 'stay';
    }
  },
  stay: function () {},
  restart: function () {
    this.carControls.changeDrivingState('starting');
    this.phase = 'finish';
  },
  finish: function () {
    if (
      this.system.truncMarker(this.carControls.carMarker) >
      this.carControls.maxDistance
    ) {
      this.carControls.changeDrivingState('stopping');
      if (this.carControls.carSpeed <= 0) {
        this.phase = 'changeScene';
      }
    }
  },
  tick: function () {
    this.system.log(this.carControls.carMarker);
    // Animation phases
    switch (this.phase) {
      case 'start':
        this.start();
        break;
      case 'stop':
        this.stop();
        break;
      case 'stay':
        this.stay();
        break;
      case 'restart':
        this.restart();
        break;
      case 'finish':
        this.finish();
        break;
      case 'changeScene':
        if (!this.sceneChanged) {
          // Destroy and detach all unecessary objets
          // Change scene
          this.system.changeScene('gate');
          this.sceneChanged = true;
        }
        break;
    }
  },
});
