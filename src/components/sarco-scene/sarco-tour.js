import { Scenes } from '../scenes.config';

AFRAME.registerComponent('sarco-car-tour', {
  init: function () {
    this.scene = 'sarco';
    this.tick = AFRAME.utils.throttleTick(this.tick, 25, this);

    this.system = document.querySelector('a-scene').systems['system'];
    this.cameraPosition = document.querySelector(
      '#' + this.system.getActualSceneObject().camera
    ).object3D.position;
    this.movesManager =
      document.querySelector('a-scene').systems['movesManager'];
    this.sarcoMale = document.querySelector('#sarco-male');
    this.object = this.el.object3D;
    this.mainScene = document.getElementById('main-scene');

    // Dive params
    this.isDiveEnvChanged = false;
    this.diveSpeed = 0.01;

    // Fog
    this.currentFog = 0;

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
          document.getElementById('sarco-male').components['sound__ambiant1'];
        // Get voice from system when init
        this.voicesarco1Sound = this.system.getVoice('sarco1');
        this.voicePhase = 'sarco1';
        setTimeout(() => {
          this.phase = 'start';
        }, 20000);
      },
      false
    );
  },
  // --- Phase functions ---
  start: function () {
    setTimeout(() => {
      // Trigger Spino animation
      const event = new Event('enter');
      this.sarcoMale.dispatchEvent(event);
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
        // Destroy and detach all unecessary objets
        // Change scene
        this.system.changeEndingScene('ending');
        this.phase = 'exit';
        break;
    }
  },
});
