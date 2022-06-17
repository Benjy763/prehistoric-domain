import { Scenes } from '../../components/scenes.config';

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
          document.getElementById('spino-male').components['sound__ambiant1'];
        // Get voice from system when init
        this.voicespino1Sound = this.system.getVoice('spino1');
        this.voicePhase = 'spino1';
        setTimeout(() => {
          this.phase = 'dive';
        }, 10000);
      },
      false
    );
    this.el.addEventListener(
      'dive',
      () => {
        this.phase = 'dive';
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
      // Trigger Spino animation
      const event = new Event('enterWalk');
      this.spinoMale.dispatchEvent(event);
    }, 0);
    this.phase = 'exit';
  },
  dive: function () {
    if (this.object.position.y < -5 && !this.isDiveEnvChanged) {
      // Hide all useless elements
      let surfaceEls = document.getElementsByClassName('spino-surface');
      for (let i = 0; i < surfaceEls.length; i++) {
        surfaceEls[i].setAttribute('visible', false);
      }
      // Show all needed elements
      let underwaterEls = document.getElementsByClassName('spino-underwater');
      for (let i = 0; i < underwaterEls.length; i++) {
        underwaterEls[i].setAttribute('visible', true);
      }
      // Set new ground postition
      let ground = document.getElementById('spino-ground');
      const groundPosition = ground.getAttribute('position');
      groundPosition.y = -13.197;
      ground.setAttribute('position', groundPosition);
      // Change background color
      setTimeout(() => {
        this.mainScene.setAttribute('background', {
          color: '#535d4b', //#00496c
        });
      }, 5000);
      this.isDiveEnvChanged = true;
    }

    // Manage fog
    if (this.object.position.y < -5 && this.currentFog < 0.07) {
      this.currentFog += 0.001;
      this.mainScene.setAttribute('fog', {
        type: 'exponential',
        color: '#535d4b',
        density: this.currentFog,
      });
    }
    if (this.object.position.y < -11.017) {
      this.phase = 'fishHunt';
    }
    this.object.position.y -= this.diveSpeed;
  },
  fishHunt: function () {
    const event = new Event('fishHunt');
    this.spinoFemale.dispatchEvent(event);
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
      case 'dive':
        this.dive();
        break;
      case 'fishHunt':
        this.fishHunt();
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
