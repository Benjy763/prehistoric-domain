import { Scenes } from '../scenes.config';

AFRAME.registerComponent('quetza-car-tour', {
  init: function () {
    this.scene = 'quetza';
    this.tick = AFRAME.utils.throttleTick(this.tick, 25, this);

    this.system = document.querySelector('a-scene').systems['system'];
    this.cameraPosition = document.querySelector(
      '#' + this.system.getActualSceneObject().camera
    ).object3D.position;
    this.movesManager =
      document.querySelector('a-scene').systems['movesManager'];
    this.quetza = document.querySelector('#quetza');
    this.object = this.el.object3D;
    this.mainScene = document.getElementById('main-scene');
    this.textCar = document.querySelector('#quetza-camera-text');

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
        // Get voice from system when init
        this.voicequetza1Sound = this.system.getVoice('quetza1');
        this.voicePhase = 'quetza1';
        setTimeout(() => {
          this.phase = 'start';
        }, 5000);
      },
      false
    );
  },
  // --- Phase functions ---
  start: function () {
    setTimeout(() => {
      // Trigger Quetza animation
      const event = new Event('enter');
      this.quetza.dispatchEvent(event);
    }, 0);
    this.phase = 'exit';
  },
  checkpointListener: function () {
    if (this.movesManager.distanceFromPoint('quetza-checkpoint') < 3) {
      this.textCar.setAttribute('visible', 'true');
      this.movesManager.nextScene = 'ending';
    }
    if (this.movesManager.distanceFromPoint('quetza-checkpoint') >= 3) {
      this.textCar.setAttribute('visible', 'false');
      this.movesManager.nextScene = null;
    }
  },
  tick: function () {
    // Checkpoint listener
    this.checkpointListener();
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
