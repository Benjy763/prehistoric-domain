AFRAME.registerComponent('edmon-car-tour', {
  init: function () {
    this.tick = AFRAME.utils.throttleTick(this.tick, 25, this);

    this.system = document.querySelector('a-scene').systems['system'];
    this.cameraPosition = document.querySelector(
      '#' + this.system.getActualSceneObject().camera
    ).object3D.position;
    this.movesManager =
      document.querySelector('a-scene').systems['movesManager'];
    this.edmonMale = document.querySelector('#edmon-male');
    this.edmonFemale = document.querySelector('#edmon-female');
    this.object = this.el.object3D;

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
          document.getElementById('edmon-male').components['sound__ambiant1'];
        // Get voice from system when init
        this.voiceEdmon1Sound = this.system.getVoice('edmon1');
        this.voicePhase = 'edmon1';
        setTimeout(() => {
          this.phase = 'start';
        }, 20000);
      },
      false
    );
  },
  start: function () {
    setTimeout(() => {
      // Trigger Rabbit animation
      const event = new Event('awake');
      this.edmonFemale.dispatchEvent(event);
    }, 1000);
    setTimeout(() => {
      // Trigger Rabbit animation
      const event = new Event('enterWalk');
      this.edmonMale.dispatchEvent(event);
    }, 3000);
    this.phase = 'exit';
  },
  tick: function () {
    // Walk bound checking
    this.movesManager.checkBoundLimits(this.cameraPosition);

    // Voice phases
    switch (this.voicePhase) {
      case 'aviary1':
        this.voiceEdmon1Sound.play();
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
        this.system.changeEndingScene('ending');
        this.phase = 'exit';
        break;
    }
  },
});
