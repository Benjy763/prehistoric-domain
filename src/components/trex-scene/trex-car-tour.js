AFRAME.registerComponent('trex-car-tour', {
  init: function () {
    this.scene = 'trex';
    this.tick = AFRAME.utils.throttleTick(this.tick, 60, this);

    this.system = document.querySelector('a-scene').systems['game'];
    this.console = document.querySelector('a-scene').systems['console'];
    this.carControls;
    this.trex = document.querySelector('#trex');
    // Tour Path
    const curve = new THREE.SplineCurve([
      new THREE.Vector2(18.6, 85),
      new THREE.Vector2(4.6, 47),
      new THREE.Vector2(-4.7, 12.8),
      new THREE.Vector2(-4.7, -18),
      new THREE.Vector2(2.8, -41),
      new THREE.Vector2(30, -94),
    ]);

    // Animation phase
    this.sceneChanged = false;

    // Sound
    this.soundMixing1SoundPlaying = false;
    this.leaveSoundPlaying = false;
    this.soundMixing1Audio = document.getElementById('sound-mixing-1');
    this.leaveAudio = document.getElementById('leave');

    // Register current tour in system
    this.console.registerCurrentTour(this);

    // Init car (when reference is registered in the system) with tour data
    document.addEventListener('carRegistered', () => {
      // Get car reference
      this.carControls = this.system.carReference;
      // Init tour path for the car
      this.carControls.initParams(curve, 900);
    });

    // Start tour listeners
    this.el.addEventListener(
      'start2',
      () => {
        this.phase = 'start';
        // Update console statuses
        this.carControls.changeDrivingState('starting');
        this.console.updateSituation();
        document.getElementById('jungle-asset').play();
      },
      false
    );

    // Restart tour listener, trigger by trex controler
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
    if (this.system.truncMarker(this.carControls.carMarker) === 560) {
      this.phase = 'stop';
    }
  },
  stop: function () {
    this.carControls.changeDrivingState('stopping');
    if (this.carControls.carSpeed <= 0) {
      this.phase = 'stay';
    }
  },
  stay: function () {
    // if (!this.soundMixing1SoundPlaying) {
    //   const event = new Event('enter');
    //   self.trex.dispatchEvent(event);
    //   this.soundMixing1SoundPlaying = true;
    // }

    setTimeout(() => {
      if (!this.soundMixing1SoundPlaying) {
        this.soundMixing1Audio.play();
        this.soundMixing1SoundPlaying = true;
      }
      this.soundMixing1Audio.onended = () => {
        const event = new Event('enter');
        // Trigger TRex animation
        this.trex.dispatchEvent(event);
      };
    }, 8000);
  },
  restart: function () {
    this.carControls.changeDrivingState('starting');
    this.phase = 'finish';
  },
  finish: function () {
    if (
      this.system.truncMarker(this.carControls.carMarker) === 800 &&
      !this.leaveSoundPlaying
    ) {
      this.leaveAudio.play();
      this.leaveSoundPlaying = true;
    }

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
    //this.system.log(this.carControls.carSpeed);
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
