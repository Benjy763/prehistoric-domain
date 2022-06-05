AFRAME.registerComponent('spino-car-tour', {
  init: function () {
    this.scene = 'spino';
    this.tick = AFRAME.utils.throttleTick(this.tick, 25, this);

    this.system = document.querySelector('a-scene').systems['system'];
    this.cameraPosition = document.querySelector(
      '#' + this.system.getActualSceneObject().camera
    ).object3D.position;
    this.movesManager =
      document.querySelector('a-scene').systems['movesManager'];
    this.spinoMale = document.querySelector('#spino-male');
    this.spinoFemale = document.querySelector('#spino-female');

    // Sounds
    this.ambiant1Sound;

    // Voice and screen phases
    this.voicePhase = 'stop';

    // En scene activation
    this.sceneChanged = false;

    // Start tour listeners
    this.el.addEventListener(
      'start',
      () => {
        // Global sound launch
        document.getElementById('jungle-asset').play();

        // Get sounds
        this.ambiant1Sound =
          document.getElementById('spino-male').components['sound__ambiant1'];
        // Get voice from system when init
        this.voicespino1Sound = this.system.getVoice('spino1');
        this.voicePhase = 'spino1';
        setTimeout(() => {
          this.phase = 'start';
        }, 0);
      },
      false
    );
  },
  // --- Phase functions ---
  start: function () {
    // setTimeout(() => {
    //   this.ambiant1Sound.playSound();
    // }, 20000);
    setTimeout(() => {
      // Trigger Pteranodon animation
      const event = new Event('enterWalk');
      this.spinoMale.dispatchEvent(event);
    }, 0);
    this.phase = 'exit';
  },
  tick: function () {
    // Walk bound checking
    this.movesManager.checkBoundLimits(this.cameraPosition);

    // Voice phases
    switch (this.voicePhase) {
      case 'aviary1':
        this.voiceAviary1Sound.play();
        this.voicePhase = 'exit';
        break;
    }
    // Animation phases
    switch (this.phase) {
      case 'start':
        this.start();
        break;
      case 'changeScene':
        if (!this.sceneChanged) {
          // Destroy and detach all unecessary objets
          //Change scene
          const mainScene = document.getElementById('main-scene');
          mainScene.setAttribute('background', {
            color: '#000', //#00496c
          });
          mainScene.setAttribute('fog', {
            type: 'exponential',
            color: '#000',
            density: 0.1,
          });
          setTimeout(() => {
            window.location.href = 'https://map.prehistoricdomain.com/';
          }, 8000);
          this.system.changeScene('ending', false);
          this.sceneChanged = true;
        }
        break;
    }
  },
});
