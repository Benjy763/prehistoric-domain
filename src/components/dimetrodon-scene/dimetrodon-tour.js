AFRAME.registerComponent('dimetrodon-car-tour', {
  init: function () {
    this.scene = 'dimetrodon';
    this.tick = AFRAME.utils.throttleTick(this.tick, 25, this);

    this.system = document.querySelector('a-scene').systems['system'];
    this.cameraPosition = document.querySelector(
      '#' + this.system.getActualSceneObject().camera
    ).object3D.position;
    this.movesManager =
      document.querySelector('a-scene').systems['movesManager'];
    this.dimetrodon = document.querySelector('#dimetrodon');
    this.rabbit = document.querySelector('#diplocaulus');
    this.amorosa = document.querySelector('#dimetrodon-desert-amorosa-1');
    this.object = this.el.object3D;
    this.mainScene = document.getElementById('main-scene');
    this.textCar = document.querySelector('#dimetrodon-camera-text');

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
        document.getElementById('desert-asset').play();

        // Get sounds
        this.ambiant1Sound =
          document.getElementById('dimetrodon').components['sound__ambiant1'];
        this.amorosaSound = this.amorosa.components['sound__dimewater'];
        // Get voice from system when init
        this.voiceDimetrodon1Sound = this.system.getVoice('dimetrodon');
        this.voicePhase = 'dimetrodon';
        setTimeout(() => {
          this.amorosaSound.playSound();
        }, 10000);
        setTimeout(() => {
          this.phase = 'start';
        }, 30000);
      },
      false
    );
  },
  start: function () {
    setTimeout(() => {
      // Trigger Rabbit animation
      const event = new Event('enterWalk');
      this.rabbit.dispatchEvent(event);
    }, 1000);
    this.phase = 'exit';
  },
  checkpointListener: function () {
    if (this.movesManager.distanceFromPoint('dimetrodon-checkpoint') < 3) {
      this.textCar.setAttribute('visible', 'true');
      this.movesManager.nextScene = 'ending';
    }
    if (this.movesManager.distanceFromPoint('dimetrodon-checkpoint') >= 3) {
      this.textCar.setAttribute('visible', 'false');
      this.movesManager.nextScene = null;
    }
  },
  tick: function () {
    // Checkpoint listener
    this.checkpointListener();
    // Voice phases
    if (this.voiceDimetrodon1Sound) {
      switch (this.voicePhase) {
        case 'dimetrodon':
          this.voiceDimetrodon1Sound.play();
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
        this.system.changeEndingScene('ending');
        this.phase = 'exit';
        break;
    }
  },
});
