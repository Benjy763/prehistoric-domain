AFRAME.registerComponent('dilo-car-tour', {
  init: function () {
    this.scene = 'dilo';
    this.tick = AFRAME.utils.throttleTick(this.tick, 25, this);

    this.system = document.querySelector('a-scene').systems['game'];
    this.console = document.querySelector('a-scene').systems['console'];
    this.gate = document.querySelector('#dilo');
    this.carControls;
    // Tour Path
    const curve = new THREE.SplineCurve([
      new THREE.Vector2(4.554, 44.617),
      new THREE.Vector2(10.924, 29.122),
      new THREE.Vector2(21.55, 6.8),
      new THREE.Vector2(26.218, -14.871),
      new THREE.Vector2(21.415, -32.389),
      new THREE.Vector2(5.603, -53.948),
      new THREE.Vector2(5.603, -79.354),
    ]);

    // Sounds
    this.diloRoarPlaying = false;
    this.diloRoar = document.querySelector('#palms-08-sound');

    // Animation phase
    this.sceneChanged = false;

    // Sound
    this.soundMixing1SoundPlaying = false;
    this.voiceDiloSoundPlaying = false;
    this.soundMixing1Audio = document.getElementById('sound-mixing-1');
    this.voiceDiloSound = document.getElementById('voice-dilo-sound');

    // Init car (when reference is registered in the system) with tour data
    this.el.addEventListener('carRegistered', () => {
      // Get car reference
      this.carControls = this.system.carReference;
      // Init tour path for the car
      this.carControls.initParams(curve, 950);
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
      this.system.truncMarker(this.carControls.carMarker) > 350 &&
      !this.diloRoarPlaying
    ) {
      this.diloRoarPlaying = true;
      this.diloRoar.components['sound__diloroar'].playSound();
    }
    if (this.system.truncMarker(this.carControls.carMarker) > 900) {
      this.phase = 'stop';
    }
  },
  stop: function () {
    this.phase = 'changeScene';
  },
  tick: function () {
    if (!this.carControls) {
      return;
    }
    // Voice
    if (
      this.system.truncMarker(this.carControls.carMarker) > 50 &&
      !this.voiceDiloSoundPlaying
    ) {
      this.voiceDiloSound.play();
      this.voiceDiloSoundPlaying = true;
    }

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
          // Destroy and detach all unecessary objets
          // Change scene
          this.system.changeScene('trex');
          this.sceneChanged = true;
        }
        break;
    }
  },
});
