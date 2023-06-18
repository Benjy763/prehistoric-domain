AFRAME.registerComponent('gate-car-tour', {
  init: function () {
    this.scene = 'gate';
    this.tick = AFRAME.utils.throttleTick(this.tick, 25, this);

    this.system = document.querySelector('a-scene').systems['system'];
    this.movesManager =
      document.querySelector('a-scene').systems['movesManager'];
    this.brachio = document.querySelector('#brachio');
    this.trice = document.querySelector('#trice-4');
    this.trice2 = document.querySelector('#trice-5');
    this.screenDefault = document.getElementById('gate-screen-default');
    this.screenBrachio = document.getElementById('gate-screen-brachio');
    this.screenTrice = document.getElementById('gate-screen-trice');
    this.screenGalli = document.getElementById('gate-screen-galli');
    this.bigDoor = document.getElementById('gate-big-door');
    this.directLight1 = document.getElementById('gate-light-2');
    this.directLight2 = document.getElementById('gate-light-3');
    this.textCar = document.querySelector('#gate-camera-text');
    this.light1Intensity = 2;
    this.light2Intensity = 0;
    this.envLights = document.getElementById('gate-ambiant-light');
    this.carLights = {
      light1: document.getElementById('gate-interior-light'),
      light2: document.getElementById('gate-interior-light-2'),
      light3: document.getElementById('gate-headlight-light'),
    };
    this.isTriceAnimationLaunched = false;
    this.isTriceShows = false;

    // Sound
    this.carTurnOn = document.getElementById('car-turn-on');
    this.gateSound = document.querySelector('#gate-big-door');
    this.trice2Sound = document.querySelector('#trice-2');
    this.trice4Sound = document.querySelector('#trice-4');
    this.fountainSound = document.querySelector('#gate-fountain');
    this.gateSoundPhase = 'open';

    // Voice and screen phases
    this.voicePhase = 'gate1';
    this.screenPhase = 'stop';

    // Main control of the car
    this.carControls;

    // Specific statuses
    this.animationsStatuses = {
      gateOpen: false,
      gateClosed: false,
    };

    // Tour Path
    this.curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(7.988, 0, 81.899),
      new THREE.Vector3(8.557, 0, -54.744),
      new THREE.Vector3(7.81, 0, -200.305),
    ]);
    this.curveTurn = new THREE.CatmullRomCurve3([
      new THREE.Vector3(8.106, 0, -154.025),
      new THREE.Vector3(8.399, 0, -170.891),
      new THREE.Vector3(-0.218, 0, -190.982),
      new THREE.Vector3(5.347, 0, -200.496),
      new THREE.Vector3(19.822, 0, -194.518),
      new THREE.Vector3(17.203, 0, -180.089),
      new THREE.Vector3(10.805, 0, -168.758),
      new THREE.Vector3(10.685, 0, -162.186),
    ]);
    this.curveBack = new THREE.CatmullRomCurve3([
      new THREE.Vector3(10.423, 0, -164.116),
      new THREE.Vector3(10.891, 0, -44.742),
      new THREE.Vector3(10.808, 0, 77.255),
    ]);

    // En scene activation
    this.brachioSceneEnded = false;
    this.sceneChanged = false;

    // Init car (when reference is registered in the system) with tour data
    this.el.addEventListener('carRegistered', () => {
      // Get car reference
      this.carControls = this.system.carReference;
      // Init tour path for the car
      this.carControls.initParams(this.curve, 836);
    });

    // Start tour listeners
    this.el.addEventListener(
      'start',
      () => {
        // Manage changing scene trigger
        this.movesManager.nextScene = 'ending';

        // Global sound launch
        document.getElementById('jungle-asset').play();
        // Get voice from system when init
        this.voiceGate1Sound = this.system.getVoice('gate1');
        this.voiceGate2Sound = this.system.getVoice('gate2');
        this.voiceGate3Sound = this.system.getVoice('gate3');
        this.voiceGate4Sound = this.system.getVoice('gate4');
        this.voiceGate5Sound = this.system.getVoice('gate5');

        this.phase = 'turnLights';
      },
      false
    );

    // Restart tour listener, trigger by brachio controler
    this.el.addEventListener(
      'restart',
      () => {
        this.brachioSceneEnded = true;
        this.phase = 'curve1';
        this.carControls.changeDrivingState('starting');
      },
      false
    );
  },
  // --- Phase functions ---
  turnLights: function () {
    this.phase = 'waiting';
    // Start car
    setTimeout(() => {
      this.phase = 'curve1';
      this.fountainSound.components['sound__fountain'].playSound();
      this.carControls.changeDrivingState('starting');
    }, 6000);
  },
  gateSounds: function () {
    if (
      this.movesManager.truncMarker(this.carControls.carMarker) > 70 &&
      this.gateSoundPhase === 'open'
    ) {
      this.gateSound.components['sound__gateopen'].playSound();
      this.gateSoundPhase = 'close';
    }
    if (
      this.movesManager.truncMarker(this.carControls.carMarker) > 260 &&
      this.gateSoundPhase === 'close'
    ) {
      this.gateSound.components['sound__gateclose'].playSound();
      this.gateSoundPhase = 'exit';
    }
  },
  gateBackSounds: function () {
    if (
      this.movesManager.truncMarker(this.carControls.carMarker) > 620 &&
      this.gateSoundPhase === 'open'
    ) {
      this.gateSound.components['sound__gateopen'].playSound();
      this.gateSoundPhase = 'close';
    }
    if (
      this.movesManager.truncMarker(this.carControls.carMarker) > 750 &&
      this.gateSoundPhase === 'close'
    ) {
      this.gateSound.components['sound__gateclose'].playSound();
      this.gateSoundPhase = 'exit';
    }
  },
  openDoors: function () {
    const bigDoorPosition = this.bigDoor.getAttribute('position');
    if (
      this.movesManager.truncMarker(this.carControls.carMarker) > 70 &&
      this.movesManager.truncMarker(this.carControls.carMarker) < 260 &&
      bigDoorPosition.y < 20
    ) {
      bigDoorPosition.y += 0.04;
      this.bigDoor.setAttribute('position', bigDoorPosition);
    }

    if (
      this.movesManager.truncMarker(this.carControls.carMarker) > 260 &&
      bigDoorPosition.y > 10
    ) {
      bigDoorPosition.y -= 0.04;
      this.bigDoor.setAttribute('position', bigDoorPosition);
    }
  },
  openDoorsBack: function () {
    const bigDoorPosition = this.bigDoor.getAttribute('position');
    if (
      this.movesManager.truncMarker(this.carControls.carMarker) > 620 &&
      this.movesManager.truncMarker(this.carControls.carMarker) < 750 &&
      bigDoorPosition.y < 20
    ) {
      bigDoorPosition.y += 0.04;
      this.bigDoor.setAttribute('position', bigDoorPosition);
    }

    if (
      this.movesManager.truncMarker(this.carControls.carMarker) > 750 &&
      bigDoorPosition.y > 10
    ) {
      bigDoorPosition.y -= 0.04;
      this.bigDoor.setAttribute('position', bigDoorPosition);
    }
  },
  curve1: function () {
    if (
      this.movesManager.truncMarker(this.carControls.carMarker) >
      this.carControls.maxDistance
    ) {
      this.carControls.changeCurve(this.curveTurn, 980, 0.0004);
      this.phase = 'curve2';
    }
    if (
      this.movesManager.truncMarker(this.carControls.carMarker) > 470 &&
      !this.brachioSceneEnded
    ) {
      // Trigger Brachio animation
      const event = new Event('enter');
      this.brachio.dispatchEvent(event);
      this.phase = 'continue';
    }
  },
  curve2: function () {
    if (
      this.movesManager.truncMarker(this.carControls.carMarker) > 500 &&
      !this.isTriceShows
    ) {
      this.isTriceShows = true;
      this.trice2Sound.components['sound__blow'].playSound();
      this.trice.setAttribute('visible', true);
      this.trice2.setAttribute('visible', true);
    }
    if (
      this.movesManager.truncMarker(this.carControls.carMarker) > 600 &&
      this.light1Intensity > 0
    ) {
      this.light1Intensity -= 0.05;
      this.light2Intensity += 0.05;
      this.directLight1.setAttribute('light', {
        intensity: this.light1Intensity,
      });
      this.directLight2.setAttribute('light', {
        intensity: this.light2Intensity,
      });
    }
    if (
      this.movesManager.truncMarker(this.carControls.carMarker) >
      this.carControls.maxDistance
    ) {
      this.carControls.changeCurve(this.curveBack, 830, 0.0002);
      this.gateSoundPhase = 'open';
      this.trice4Sound.components['sound__snoring'].playSound();
      this.phase = 'curve3';
    }
  },
  curve3: function () {
    if (
      this.movesManager.truncMarker(this.carControls.carMarker) > 120 &&
      !this.isTriceAnimationLaunched
    ) {
      const event = new Event('enter');
      this.trice.dispatchEvent(event);
      this.isTriceAnimationLaunched = true;
    }

    if (
      this.movesManager.truncMarker(this.carControls.carMarker) >
      this.carControls.maxDistance
    ) {
      this.phase = 'changeScene';
    }
  },
  continue: function () {
    if (this.movesManager.truncMarker(this.carControls.carMarker) > 450) {
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
  tick: function () {
    // console.log(
    //   this.movesManager.truncMarker(this.carControls.carMarker),
    //   this.el.object3D.position
    // );
    if (!this.carControls) {
      return;
    }
    // Screen phases
    switch (this.screenPhase) {
      case 'default':
        if (this.movesManager.truncMarker(this.carControls.carMarker) > 0) {
          this.screenDefault.setAttribute('visible', 'true');
          this.screenPhase = 'galli';
        }
        break;
      case 'galli':
        if (this.movesManager.truncMarker(this.carControls.carMarker) > 300) {
          this.screenDefault.setAttribute('visible', 'false');
          this.screenGalli.setAttribute('visible', 'true');
          this.screenPhase = 'brachio';
        }
        break;
      case 'brachio':
        if (this.movesManager.truncMarker(this.carControls.carMarker) > 420) {
          this.screenTrice.setAttribute('visible', 'false');
          this.screenBrachio.setAttribute('visible', 'true');
          this.screenPhase = 'end';
        }
        break;
    }
    // Voice phases
    switch (this.voicePhase) {
      case 'gate1':
        if (this.movesManager.truncMarker(this.carControls.carMarker) > 40) {
          this.voiceGate1Sound.play();
          this.voicePhase = 'gate2';
        }
        break;
      case 'gate2':
        if (this.movesManager.truncMarker(this.carControls.carMarker) > 300) {
          this.voiceGate2Sound.play();
          this.voicePhase = 'gate3';
        }
        break;
      case 'gate3':
        if (this.movesManager.truncMarker(this.carControls.carMarker) > 450) {
          this.voiceGate3Sound.play();
          this.voicePhase = 'gate4';
        }
        break;
      case 'gate4':
        if (this.movesManager.truncMarker(this.carControls.carMarker) > 555) {
          this.voiceGate4Sound.play();
          this.voicePhase = 'gate5';
        }
        break;
      case 'gate5':
        if (this.movesManager.truncMarker(this.carControls.carMarker) > 800) {
          this.voiceGate5Sound.play();
          this.voicePhase = 'end';
        }
        break;
    }
    // Animation phases
    switch (this.phase) {
      case 'turnLights':
        this.turnLights();
        break;
      case 'curve1':
        this.gateSounds();
        this.openDoors();
        this.curve1();
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
      case 'curve2':
        this.curve2();
        break;
      case 'curve3':
        this.gateBackSounds();
        this.openDoorsBack();
        this.curve3();
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
