AFRAME.registerComponent('trex-car-tour', {
  init: function () {
    this.scene = 'trex';
    this.tick = AFRAME.utils.throttleTick(this.tick, 25, this);

    this.system = document.querySelector('a-scene').systems['game'];
    this.carControls;
    this.trex = document.querySelector('#trex');
    // Tour Path
    const curve = new THREE.SplineCurve([
      new THREE.Vector2(18.6, 85),
      new THREE.Vector2(4.6, 47),
      new THREE.Vector2(-4.7, 12.8),
      new THREE.Vector2(-4.7, -18),
      new THREE.Vector2(2.8, -41),
      new THREE.Vector2(32, -94),
    ]);

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
        this.carControls.changeDrivingState('starting');
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
    if (this.system.truncMarker(this.carControls.carMarker) > 540) {
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
    const event = new Event('enter');
    this.trex.dispatchEvent(event);
    this.phase = 'trex';
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
    // Voice phases
    switch (this.voicePhase) {
      case 'trex1':
        if (this.system.truncMarker(this.carControls.carMarker) > 70) {
          this.voiceTrex1Sound.play();
          this.voicePhase = 'trex2';
        }
        break;
      case 'trex2':
        if (this.system.truncMarker(this.carControls.carMarker) > 530) {
          setTimeout(() => {
            this.voiceTrex2Sound.play();
            this.voicePhase = 'end';
          }, 4000);
        }
        break;
    }
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
          this.system.changeScene('raptor');
          this.sceneChanged = true;
        }
        break;
    }
  },
});
