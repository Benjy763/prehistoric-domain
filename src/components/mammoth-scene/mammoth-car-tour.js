AFRAME.registerComponent('mammoth-car-tour', {
  init: function () {
    this.scene = 'mammoth';
    this.tick = AFRAME.utils.throttleTick(this.tick, 25, this);

    this.system = document.querySelector('a-scene').systems['system'];
    this.cameraPosition = document.querySelector(
      '#' + this.system.getActualSceneObject().camera
    ).object3D.position;
    this.movesManager =
      document.querySelector('a-scene').systems['movesManager'];
    this.carControls;
    this.screenDefault = document.getElementById('dilo-screen-default');
    this.textCar = document.querySelector('#mammoth-camera-text');
    this.eagle = document.querySelector('#eagle');
    this.wolf = document.querySelector('#wolf');
    this.mammoth = document.querySelector('#mammoth');

    // Animation phase
    this.sceneChanged = false;

    // Sound
    this.voicePhase = 'sound';
    this.soundMixing1SoundPlaying = false;
    this.leaveSoundPlaying = false;
    this.leaveAudio = document.getElementById('leave');

    // Start tour listeners
    this.el.addEventListener(
      'start',
      () => {
        // Get voice from system when init
        this.voicemammothSound = this.system.getVoice('mammoth');
        this.voicePhase = 'mammoth';

        // Global sound launch
        document.getElementById('env-sound-asset').play();
        document.getElementById('env-sound-switch-asset').play();
        this.voicemammoth1Sound = this.system.getVoice('mammoth1');
        this.voicemammoth2Sound = this.system.getVoice('mammoth2');
        this.phase = 'start';

        this.mammoth.dispatchEvent(new Event('displayMammoths'));
      },
      false
    );
  },
  // --- Phase functions ---
  start: function () {
    setTimeout(() => {
      // Trigger eagle animation
      this.eagle.dispatchEvent(new Event('enterFly'));
      //this.wolf.dispatchEvent(new Event('enterRun'));
      //this.mammoth.dispatchEvent(new Event('enterWalk'));
    }, 5000);
    this.phase = 'exit';
  },
  checkpointListener: function () {
    if (this.movesManager.distanceFromPoint('mammoth-checkpoint') < 1.3) {
      this.textCar.setAttribute('visible', 'true');
      this.movesManager.nextScene = 'ending';
    }
    if (this.movesManager.distanceFromPoint('mammoth-checkpoint') >= 1.3) {
      this.textCar.setAttribute('visible', 'false');
      this.movesManager.nextScene = null;
    }
  },
  tick: function () {
    // Checkpoint listener
    this.checkpointListener();
    // Voice phases
    if (this.voicemammothSound) {
      switch (this.voicePhase) {
        case 'mammoth':
          this.voicemammothSound.play();
          this.voicePhase = 'exit';
          break;
      }
    }
    // Animation phases
    switch (this.phase) {
      case 'start':
        this.start();
        break;
    }
  }
});
