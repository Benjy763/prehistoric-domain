AFRAME.registerComponent('gate-car-tour', {
  init: function () {
    this.scene = 'gate';
    this.tick = AFRAME.utils.throttleTick(this.tick, 25, this);

    this.system = document.querySelector('a-scene').systems['game'];
    this.brachio = document.querySelector('#brachio');
    this.screenDefault = document.getElementById('gate-screen-default');
    this.screenBrachio = document.getElementById('gate-screen-brachio');
    this.screenTrice = document.getElementById('gate-screen-trice');
    this.screenGalli = document.getElementById('gate-screen-galli');
    this.bigDoor = document.getElementById('gate-big-door');
    this.envLights = document.getElementById('gate-ambiant-light');
    this.carLights = {
      light1: document.getElementById('gate-interior-light'),
      light2: document.getElementById('gate-interior-light-2'),
      light3: document.getElementById('gate-headlight-light'),
    };

    // Sound
    this.carTurnOn = document.getElementById('car-turn-on');

    // Voice and screen phases
    this.voicePhase = 'gate1';
    this.screenPhase = 'default';

    // Main control of the car
    this.carControls;

    // Specific statuses
    this.animationsStatuses = {
      gateOpen: false,
      gateClosed: false,
    };

    // Tour Path
    const curve = new THREE.SplineCurve([
      new THREE.Vector2(7.988, 81.899),
      new THREE.Vector2(9.7, -174.7),
    ]);

    // En scene activation
    this.sceneChanged = false;

    // Init car (when reference is registered in the system) with tour data
    this.el.addEventListener('carRegistered', () => {
      // Get car reference
      this.carControls = this.system.carReference;
      // Init tour path for the car
      this.carControls.initParams(curve, 700);
    });

    // Start tour listeners
    this.el.addEventListener(
      'start',
      () => {
        // Global sound launch
        document.getElementById('jungle-asset').play();
        // Get voice from system when init
        this.voiceGate1Sound = this.system.getVoice('gate1');
        this.voiceGate2Sound = this.system.getVoice('gate2');
        this.voiceGate3Sound = this.system.getVoice('gate3');
        this.voiceGate4Sound = this.system.getVoice('gate4');

        this.phase = 'turnLights';
      },
      false
    );

    // Restart tour listener, trigger by brachio controler
    this.el.addEventListener(
      'restart',
      () => {
        this.phase = 'restart';
      },
      false
    );
  },
  // --- Phase functions ---
  turnLights: function () {
    this.phase = 'waiting';
    // Turn on global light
    setTimeout(() => {
      this.carTurnOn.play();
    }, 6000);
    // Turn on car lights
    setTimeout(() => {
      this.envLights.setAttribute('visible', 'true');
      this.carLights.light1.setAttribute('visible', 'true');
      this.carLights.light2.setAttribute('visible', 'true');
      this.carLights.light3.setAttribute('visible', 'true');
    }, 6000);
    // Start car
    setTimeout(() => {
      this.phase = 'start';
      this.carControls.changeDrivingState('starting');
    }, 9000);
  },
  start: function () {
    const bigDoorPosition = this.bigDoor.getAttribute('position');
    if (
      this.system.truncMarker(this.carControls.carMarker) > 200 &&
      this.system.truncMarker(this.carControls.carMarker) < 280 &&
      bigDoorPosition.y < 20
    ) {
      bigDoorPosition.y += 0.04;
      this.bigDoor.setAttribute('position', bigDoorPosition);
    }

    if (
      this.system.truncMarker(this.carControls.carMarker) > 280 &&
      bigDoorPosition.y > 10
    ) {
      bigDoorPosition.y -= 0.04;
      this.bigDoor.setAttribute('position', bigDoorPosition);
    }

    if (this.system.truncMarker(this.carControls.carMarker) > 400) {
      // Trigger Brachio animation
      const event = new Event('enter');
      this.brachio.dispatchEvent(event);
      this.phase = 'continue';
    }
  },
  continue: function () {
    if (this.system.truncMarker(this.carControls.carMarker) > 560) {
      this.phase = 'stop';
    }
  },
  stop: function () {
    this.carControls.changeDrivingState('stopping');
    this.phase = 'stay';
  },
  stay: function () {
    this.phase = 'animation';
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
    // Screen phases
    switch (this.screenPhase) {
      case 'default':
        if (this.system.truncMarker(this.carControls.carMarker) > 0) {
          this.screenDefault.setAttribute('visible', 'true');
          this.screenPhase = 'galli';
        }
        break;
      case 'galli':
        if (this.system.truncMarker(this.carControls.carMarker) > 300) {
          this.screenDefault.setAttribute('visible', 'false');
          this.screenGalli.setAttribute('visible', 'true');
          this.screenPhase = 'brachio';
        }
        break;
      case 'brachio':
        if (this.system.truncMarker(this.carControls.carMarker) > 420) {
          this.screenTrice.setAttribute('visible', 'false');
          this.screenBrachio.setAttribute('visible', 'true');
          this.screenPhase = 'end';
        }
        break;
    }
    // Voice phases
    switch (this.voicePhase) {
      case 'gate1':
        if (this.system.truncMarker(this.carControls.carMarker) > 40) {
          this.voiceGate1Sound.play();
          this.voicePhase = 'gate2';
        }
        break;
      case 'gate2':
        if (this.system.truncMarker(this.carControls.carMarker) > 300) {
          this.voiceGate2Sound.play();
          this.voicePhase = 'gate3';
        }
        break;
      case 'gate3':
        if (this.system.truncMarker(this.carControls.carMarker) > 450) {
          this.voiceGate3Sound.play();
          this.voicePhase = 'gate4';
        }
        break;
      case 'gate4':
        if (this.system.truncMarker(this.carControls.carMarker) > 555) {
          this.voiceGate4Sound.play();
          this.voicePhase = 'end';
        }
        break;
    }
    // Animation phases
    switch (this.phase) {
      case 'turnLights':
        this.turnLights();
        break;
      case 'start':
        this.start();
        break;
      case 'stop':
        this.stop();
        break;
      case 'stay':
        this.stay();
        break;
      case 'continue':
        this.continue();
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
          //Change scene
          this.system.changeScene('dilo');
          this.sceneChanged = true;
        }
        break;
    }
  },
});
