AFRAME.registerComponent('trex-car-tour', {
  init: function () {
    this.scene = 'trex';
    this.tick = AFRAME.utils.throttleTick(this.tick, 25, this);

    this.system = document.querySelector('a-scene').systems['system'];
    this.cameraPosition = document.querySelector(
      '#' + this.system.getActualSceneObject().camera
    ).object3D.position;
    this.movesManager =
      document.querySelector('a-scene').systems['movesManager'];
    this.carControls;
    this.trex = document.querySelector('#trex');
    this.screenDefault = document.getElementById('dilo-screen-default');
    this.screenTrex = document.getElementById('trex-screen-trex');
    this.screenPhase = 'trex';
    this.textCar = document.querySelector('#trex-camera-text');

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
        // specific VR animation
        if (!this.system.vr) {
          this.launchAnimationMixer();
        }
        // Get voice from system when init
        this.voiceTrexSound = this.system.getVoice('trex');
        this.voicePhase = 'trex';

        // Global sound launch
        document.getElementById('jungle-asset').play();
        this.voiceTrex1Sound = this.system.getVoice('trex1');
        this.voiceTrex2Sound = this.system.getVoice('trex2');
        this.phase = 'start';
      },
      false
    );
  },
  // --- Phase functions ---
  start: function () {
    document.querySelector('#trex-sky').setAttribute('visible', true);
    setTimeout(() => {
      this.soundMixing1Audio.play();
    }, 25000);
    setTimeout(() => {
      // Trigger Rabbit animation
      const event = new Event('enterWalk');
      this.trex.dispatchEvent(event);
    }, 40000);
    this.phase = 'exit';
  },
  launchAnimationMixer: function () {
    // Find all elements with IDs starting with "trex-forest-fern"
    const fernElements = document.querySelectorAll('[id^="trex-forest-fern"]');

    const timeScaleValues = [0.8, 0.5, 0.2, 0.4, 0.7]; // You can adjust these values as needed

    fernElements.forEach((fernElement, index) => {
      const timeScale = timeScaleValues[index % timeScaleValues.length];
      fernElement.setAttribute(
        'animation-mixer',
        `clip: KeyAction.001; startFrame: 200; timeScale: ${timeScale}`
      );
    });
  },
  checkpointListener: function () {
    if (this.movesManager.distanceFromPoint('trex-checkpoint') < 3) {
      this.textCar.setAttribute('visible', 'true');
      this.movesManager.nextScene = 'ending';
    }
    if (this.movesManager.distanceFromPoint('trex-checkpoint') >= 3) {
      this.textCar.setAttribute('visible', 'false');
      this.movesManager.nextScene = null;
    }
  },
  tick: function () {
    // Checkpoint listener
    this.checkpointListener();
    // Voice phases
    if (this.voiceTrexSound) {
      switch (this.voicePhase) {
        case 'trex':
          this.voiceTrexSound.play();
          this.voicePhase = 'exit';
          break;
      }
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
  }
});
