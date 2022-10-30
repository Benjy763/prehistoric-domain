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
    this.birds = document.querySelector('#spino-birds-model');
    this.object = this.el.object3D;
    this.mainScene = document.getElementById('main-scene');

    // Dive params
    this.isDiveEnvChanged = false;
    this.diveSpeed = 0.01;

    // Birds curve
    this.birdsMarker = 0; // Position on the curve
    this.birdsSpeed = 0.003; // Speed on the curve
    this.birdsCurve = new THREE.SplineCurve([
      new THREE.Vector2(-33.836, 18.578),
      new THREE.Vector2(-52.504, -40),
    ]);

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
        this.birdsAudio = document.getElementById(
          'spino-palm-tree-long'
        ).components['sound__birds'];
        const nacelle = document.getElementById('spino-wall');
        this.nacelleStart = nacelle.components['sound__nacellestart'];
        this.nacelleDown = nacelle.components['sound__nacelledown'];
        this.nacelleEnd = nacelle.components['sound__nacelleend'];

        // Get sounds
        this.ambiant1Sound =
          document.getElementById('spino-male').components['sound__ambiant1'];
        // Get voice from system when init
        this.voiceSpino1Sound = this.system.getVoice('spino1');
        this.voicePhase = 'spino1';
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
    this.el.addEventListener(
      'surface',
      () => {
        this.nacelleStart.playSound();
        this.nacelleDown.playSound();
        this.isDiveEnvChanged = false;
        this.phase = 'surface';
      },
      false
    );
  },
  // --- Phase functions ---
  birdsFly: function () {
    this.birdsMarker = this.movesManager.moveOnCurve(
      this.birds.object3D,
      this.birdsCurve,
      this.birdsMarker,
      this.birdsSpeed
    );
    if (this.movesManager.truncMarker(this.birdsMarker) > 950) {
      this.phase = 'exit';
    }
  },
  start: function () {
    // setTimeout(() => {
    //   this.ambiant1Sound.playSound();
    // }, 20000);
    setTimeout(() => {
      // Trigger Spino animation
      const event = new Event('enterWalk');
      this.spinoMale.dispatchEvent(event);
    }, 0);
    this.birdsAudio.playSound();
    this.phase = 'birdsFly';
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
      this.phase = 'fishHuntUnderwater';
    }
    this.object.position.y -= this.diveSpeed;
  },
  surface: function () {
    if (this.object.position.y > -5 && !this.isDiveEnvChanged) {
      // Hide all useless elements
      let surfaceEls = document.getElementsByClassName('spino-surface');
      for (let i = 0; i < surfaceEls.length; i++) {
        surfaceEls[i].setAttribute('visible', true);
      }
      // Show all needed elements
      let underwaterEls = document.getElementsByClassName('spino-underwater');
      for (let i = 0; i < underwaterEls.length; i++) {
        underwaterEls[i].setAttribute('visible', false);
      }
      // Hide all useless elements
      let deadTreeEls = document.getElementsByClassName('dead-tree');
      for (let i = 0; i < deadTreeEls.length; i++) {
        deadTreeEls[i].setAttribute('visible', false);
      }
      // Set new ground postition
      let ground = document.getElementById('spino-ground');
      const groundPosition = ground.getAttribute('position');
      groundPosition.y = -0.3;
      ground.setAttribute('position', groundPosition);
      // Change background color
      setTimeout(() => {
        this.mainScene.setAttribute('background', {
          color: '#5e5e5e',
        });
      }, 5000);
      this.isDiveEnvChanged = true;
    }

    // Manage fog
    if (this.object.position.y > -5 && this.currentFog > 0.05) {
      this.currentFog -= 0.001;
      this.mainScene.setAttribute('fog', {
        type: 'exponential',
        color: '#5e5e5e',
        density: this.currentFog,
      });
    }
    if (this.object.position.y > 1.02687) {
      this.nacelleEnd.playSound();
      this.nacelleDown.stopSound();
      this.phase = 'fishHuntSurface';
    }
    this.object.position.y += this.diveSpeed;
  },
  fishHuntUnderwater: function () {
    const event = new Event('fishHunt');
    this.spinoFemale.dispatchEvent(event);
    this.phase = 'exit';
  },
  fishHuntSurface: function () {
    const event = new Event('fishHunt');
    this.spinoMale.dispatchEvent(event);
    this.phase = 'exit';
  },
  pumpUnderwaterAudio: function () {
    if (this.swampAudio.volume > 0.005 && this.underwaterAudio.volume < 0.995) {
      this.swampAudio.volume -= 0.005;
      this.underwaterAudio.volume += 0.005;
    }
  },
  pumpSwampAudio: function () {
    if (this.underwaterAudio.volume > 0.001 && this.swampAudio.volume < 0.995) {
      this.underwaterAudio.volume -= 0.005;
      this.swampAudio.volume += 0.005;
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
      case 'birdsFly':
        this.birdsFly();
        break;
      case 'dive':
        this.pumpUnderwaterAudio();
        this.dive();
        break;
      case 'surface':
        if (this.object.position.y > -1) {
          this.pumpSwampAudio();
        }
        this.surface();
        break;
      case 'fishHuntUnderwater':
        this.fishHuntUnderwater();
        break;
      case 'fishHuntSurface':
        this.fishHuntSurface();
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
