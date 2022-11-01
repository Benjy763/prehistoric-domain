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
        this.swampAudio = document.getElementById('swamp-asset');
        this.swampAudio.play();
        this.underwaterAudio = document.getElementById('underwater-asset');
        this.underwaterAudio.volume = 0;
        this.underwaterAudio.play();

        // Get sounds
        const nacelle = document.getElementById('sarco-wall');
        this.nacelleStart = nacelle.components['sound__nacellestart'];
        this.nacelleDown = nacelle.components['sound__nacelledown'];
        this.nacelleEnd = nacelle.components['sound__nacelleend'];
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
    this.el.addEventListener(
      'dive',
      () => {
        this.nacelleStart.playSound();
        this.nacelleDown.playSound();
        this.phase = 'dive';
      },
      false
    );
  },
  // --- Phase functions ---
  start: function () {
    setTimeout(() => {
      // Trigger Sarco animation
      const event = new Event('enter');
      this.sarcoMale.dispatchEvent(event);
    }, 0);
    this.phase = 'exit';
  },
  dive: function () {
    if (this.object.position.y < -5 && !this.isDiveEnvChanged) {
      // Hide all useless elements
      let surfaceEls = document.getElementsByClassName('sarco-surface');
      for (let i = 0; i < surfaceEls.length; i++) {
        surfaceEls[i].setAttribute('visible', false);
      }
      // Show all needed elements
      let underwaterEls = document.getElementsByClassName('sarco-underwater');
      for (let i = 0; i < underwaterEls.length; i++) {
        if (!underwaterEls[i].classList.contains('performance')) {
          underwaterEls[i].setAttribute('visible', true);
        }
      }
      // Set new ground postition
      let ground = document.getElementById('sarco-ground');
      const groundPosition = ground.getAttribute('position');
      groundPosition.y = -13.197;
      ground.setAttribute('position', groundPosition);
      // Change background color
      setTimeout(() => {
        this.mainScene.setAttribute('background', {
          color: '#535d4b',
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
      this.nacelleEnd.playSound();
      this.nacelleDown.stopSound();
      // Trigger Sarco animation
      const event = new Event('sarcoUnderwater');
      this.sarcoMale.dispatchEvent(event);
      this.phase = 'sarcoUnderwater';
    }
    this.object.position.y -= this.diveSpeed;
  },
  pumpUnderwaterAudio: function () {
    if (this.swampAudio.volume > 0.005 && this.underwaterAudio.volume < 0.995) {
      this.swampAudio.volume -= 0.005;
      this.underwaterAudio.volume += 0.005;
    }
  },
  tick: function () {
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
        this.pumpUnderwaterAudio();
        this.dive();
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
