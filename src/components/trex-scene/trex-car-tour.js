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

    // Animation phase
    this.sceneChanged = false;

    // Sound
    this.voicePhase = 'trex1';
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
        this.voiceTrex1Sound = this.system.getVoice('trex1');
        this.voiceTrex2Sound = this.system.getVoice('trex2');
        this.phase = 'start';
      },
      false
    );
  },
  // --- Phase functions ---
  start: function () {
    setTimeout(() => {
      // Trigger Rabbit animation
      const event = new Event('enterWalk');
      this.trex.dispatchEvent(event);
    }, 1000);
    this.phase = 'exit';
  },
  tick: function () {
    // Voice phases
    switch (this.voicePhase) {
      case 'trex1':
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
