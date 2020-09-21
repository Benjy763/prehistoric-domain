AFRAME.registerComponent('raptor-car-tour', {
  init: function () {
    this.scene = 'raptor';
    this.tick = AFRAME.utils.throttleTick(this.tick, 25, this);

    this.system = document.querySelector('a-scene').systems['game'];
    this.console = document.querySelector('a-scene').systems['console'];
    this.raptor = document.querySelector('#raptor');
    this.carControls;
    // Tour Path
    const curve = new THREE.SplineCurve([
      new THREE.Vector2(4.535, 81.899),
      new THREE.Vector2(4.535, -174.7),
    ]);

    // Sounds
    this.voiceRaptorSoundPlaying = false;
    this.voiceRaptorSound = document.getElementById('voice-raptor-sound');
    // Animation phase
    this.sceneChanged = false;

    // Init car (when reference is registered in the system) with tour data
    this.el.addEventListener('carRegistered', () => {
      // Get car reference
      this.carControls = this.system.carReference;
      // Init tour path for the car
      this.carControls.initParams(curve, 620);
    });

    // Start tour listeners
    this.el.addEventListener(
      'start',
      () => {
        // Register current tour in system
        this.console.registerCurrentTour(this);
        this.phase = 'start';
        // Update console statuses
        this.carControls.changeDrivingState('starting');
        this.console.updateSituation();
        document.getElementById('jungle-asset').play();
      },
      false
    );

    // Restart tour listener, trigger by raptor controler
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
    if (this.system.truncMarker(this.carControls.carMarker) > 340) {
      this.carControls.changeDrivingState('stopping');
      const event = new Event('enter');
      this.raptor.dispatchEvent(event);
      this.phase = 'stop';
    }
  },
  restart: function () {
    this.carControls.changeDrivingState('starting');
    this.phase = 'finish';
  },
  finish: function () {
    if (
      this.system.truncMarker(this.carControls.carMarker) >
      this.carControls.maxDistance
    ) {
      this.phase = 'changeScene';
    }
  },
  tick: function () {
    if (!this.carControls) {
      return;
    }
    // Voice
    if (
      this.system.truncMarker(this.carControls.carMarker) > 50 &&
      !this.voiceRaptorSoundPlaying
    ) {
      this.voiceRaptorSound.play();
      this.voiceRaptorSoundPlaying = true;
    }
    // Animation phases
    switch (this.phase) {
      case 'start':
        this.start();
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
          this.system.changeScene('trice');
          this.sceneChanged = true;
        }
        break;
    }
  },
});
