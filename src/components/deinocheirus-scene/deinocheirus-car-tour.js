AFRAME.registerComponent('deinocheirus-car-tour', {
  init: function () {
    this.scene = 'deinocheirus';
    this.tick = AFRAME.utils.throttleTick(this.tick, 25, this);

    this.system = document.querySelector('a-scene').systems['system'];
    this.cameraPosition = document.querySelector(
      '#' + this.system.getActualSceneObject().camera
    ).object3D.position;
    this.movesManager =
      document.querySelector('a-scene').systems['movesManager'];
    this.carControls;
    this.deinocheirus = document.querySelector('#deinocheirus');
    this.screenDeinocheirus = document.getElementById(
      'deinocheirus-screen-deinocheirus'
    );
    this.screenPhase = 'deinocheirus';
    this.textCar = document.querySelector('#deinocheirus-camera-text');

    // Animation phase
    this.sceneChanged = false;

    // Sound
    this.voicePhase = 'sound';
    this.soundMixing1SoundPlaying = false;
    this.leaveSoundPlaying = false;
    this.soundMixing1Audio = document.getElementById('sound-mixing-1');
    this.leaveAudio = document.getElementById('leave');

    // Init car (when reference is registered in the system) with tour data
    this.el.addEventListener('carRegistered', () => {
      // Get car reference
      this.carControls = this.system.carReference;
      // Init tour path for the car
      this.carControls.initParams(curve, 800);
    });

    // Start tour listeners
    this.el.addEventListener(
      'start',
      () => {
        // Get voice from system when init
        this.voiceDeinocheirusSound = this.system.getVoice('deinocheirus');
        this.voicePhase = 'deinocheirus1';

        // Global sound launch
        //document.getElementById('swamp-2-asset').play();
        this.voiceDeinocheirus1Sound = this.system.getVoice('deinocheirus1');
        this.voiceDeinocheirus2Sound = this.system.getVoice('deinocheirus2');
        this.phase = 'start';
      },
      false
    );
  },
  // --- Phase functions ---
  start: function () {
    document.querySelector('#deinocheirus-sky').setAttribute('visible', true);
    setTimeout(() => {
      // Trigger Rabbit animation
      const event = new Event('enterWalk');
      this.deinocheirus.dispatchEvent(event);
    }, 100);
    this.phase = 'exit';
  },
  checkpointListener: function () {
    if (this.movesManager.distanceFromPoint('deinocheirus-checkpoint') < 3) {
      this.textCar.setAttribute('visible', 'true');
      this.movesManager.nextScene = 'ending';
    }
    if (this.movesManager.distanceFromPoint('deinocheirus-checkpoint') >= 3) {
      this.textCar.setAttribute('visible', 'false');
      this.movesManager.nextScene = null;
    }
  },
  tick: function () {
    // Checkpoint listener
    this.checkpointListener();
    // Voice phases
    switch (this.voicePhase) {
      case 'deinocheirus':
        this.voiceDeinocheirusSound.play();
        this.voicePhase = 'exit';
        break;
    }
    // Animation phases
    switch (this.phase) {
      case 'start':
        this.start();
        break;
      case 'changeScene':
        // Destroy and detach all unecessary objets
        // Change scene
        this.system.changeScene('raptor');
        this.phase = 'exit';
        break;
    }
  },
});
