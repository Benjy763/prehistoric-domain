AFRAME.registerComponent('dilo-car-tour', {
  init: function () {
    this.scene = 'dilo';
    this.tick = AFRAME.utils.throttleTick(this.tick, 60, this);

    this.system = document.querySelector('a-scene').systems['game'];
    this.console = document.querySelector('a-scene').systems['console'];
    this.gate = document.querySelector('#dilo');
    this.carControls;
    // Tour Path
    const curve = new THREE.SplineCurve([
      new THREE.Vector2(7.988, 81.899),
      new THREE.Vector2(9.7, -174.7),
    ]);

    // Sounds
    this.diloRoarPlaying = false;
    this.diloRoar = document.querySelector('#palms-10-sound');

    // Animation phase
    this.sceneChanged = false;

    // Sound
    this.soundMixing1SoundPlaying = false;
    this.soundMixing1Audio = document.getElementById('sound-mixing-1');

    // Init car (when reference is registered in the system) with tour data
    this.el.addEventListener('carRegistered', () => {
      // Get car reference
      this.carControls = this.system.carReference;
      // Init tour path for the car
      this.carControls.initParams(curve, 700);
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
    if (
      this.system.truncMarker(this.carControls.carMarker) === 250 &&
      !this.diloRoarPlaying
    ) {
      this.diloRoarPlaying = true;
      this.diloRoar.components['sound__diloroar'].playSound();
    }
    if (this.system.truncMarker(this.carControls.carMarker) === 560) {
      this.phase = 'stop';
    }
  },
  stop: function () {
    this.carControls.changeDrivingState('stopping');
    this.phase = 'changeScene';
  },
  tick: function () {
    // Animation phases
    switch (this.phase) {
      case 'start':
        this.start();
        break;
      case 'stop':
        this.stop();
        break;
      case 'changeScene':
        if (!this.sceneChanged) {
          console.log('test');
          // Destroy and detach all unecessary objets
          // Change scene
          //this.system.changeScene('dilo');
          this.sceneChanged = true;
        }
        break;
    }
  },
});
