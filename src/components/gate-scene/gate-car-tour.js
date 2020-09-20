AFRAME.registerComponent('gate-car-tour', {
  init: function () {
    this.scene = 'gate';
    this.tick = AFRAME.utils.throttleTick(this.tick, 25, this);

    this.system = document.querySelector('a-scene').systems['game'];
    this.console = document.querySelector('a-scene').systems['console'];
    this.gate = document.querySelector('#gate');
    this.brachio = document.querySelector('#brachio');
    this.gateSound = document.getElementById('gate-sound');
    this.gateCloseSound = document.getElementById('gate-close-sound');
    this.voiceGate1Sound = document.getElementById('voice-gate1-sound');
    this.voiceGate2Sound = document.getElementById('voice-gate2-sound');
    this.voiceGate3Sound = document.getElementById('voice-gate3-sound');
    this.voiceGate4Sound = document.getElementById('voice-gate4-sound');
    this.voicePhase = 'gate1';
    this.screenDefault = document.getElementById('screen-default');
    this.screenBrachio = document.getElementById('screen-brachio');
    this.screenTrice = document.getElementById('screen-trice');
    this.screenGalli = document.getElementById('screen-galli');
    this.screenPhase = 'default';
    this.carControls;
    this.animationsStatuses = {
      gateOpen: false,
      gateClosed: false,
    };
    //this.brachio = document.querySelector('#brachio');
    // Tour Path
    const curve = new THREE.SplineCurve([
      new THREE.Vector2(7.988, 81.899),
      new THREE.Vector2(9.7, -174.7),
    ]);

    // Animation phase
    this.sceneChanged = false;

    // Sound
    this.soundMixing1SoundPlaying = false;
    this.soundMixing1Audio = document.getElementById('sound-mixing-1');

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
        // Register current tour in system
        this.console.registerCurrentTour(this);
        this.phase = 'start';
        // Update console statuses
        this.carControls.changeDrivingState('starting');
        this.console.updateSituation();
        document.getElementById('jungle-asset').play();
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
  start: function () {
    if (
      this.system.truncMarker(this.carControls.carMarker) > 250 &&
      !this.animationsStatuses.gateOpen
    ) {
      this.animationsStatuses.gateOpen = true;
      this.gateSound.play();
      this.gate.setAttribute('animation-mixer', {
        clip: 'gate-*',
        timeScale: 0.8,
      });
      setTimeout(() => {
        this.gate.setAttribute('animation-mixer', {
          clip: 'gate-*',
          timeScale: 0,
        });
      }, 4500);
    }
    if (
      this.system.truncMarker(this.carControls.carMarker) > 360 &&
      !this.animationsStatuses.gateClosed
    ) {
      this.animationsStatuses.gateClosed = true;
      this.gateCloseSound.play();
      this.gate.setAttribute('animation-mixer', {
        clip: 'gate-*',
        timeScale: -0.8,
      });
      setTimeout(() => {
        this.gate.setAttribute('animation-mixer', {
          clip: 'gate-*',
          timeScale: 0,
        });
      }, 4300);
    }
    if (this.system.truncMarker(this.carControls.carMarker) === 560) {
      this.phase = 'stop';
    }
  },
  stop: function () {
    this.carControls.changeDrivingState('stopping');
    this.phase = 'stay';
  },
  stay: function () {
    const event = new Event('enter');
    // Trigger Brachio animation
    this.brachio.dispatchEvent(event);
    this.phase = 'animation';
  },
  restart: function () {
    this.carControls.changeDrivingState('starting');
    this.phase = 'finish';
  },
  finish: function () {
    this.system.log(this.carControls.maxDistance);
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
          this.screenPhase = 'trice';
        }
        break;
      case 'trice':
        if (this.system.truncMarker(this.carControls.carMarker) > 380) {
          this.screenGalli.setAttribute('visible', 'false');
          this.screenTrice.setAttribute('visible', 'true');
          this.screenPhase = 'brachio';
        }
        break;
      case 'brachio':
        if (this.system.truncMarker(this.carControls.carMarker) > 480) {
          this.screenTrice.setAttribute('visible', 'false');
          this.screenBrachio.setAttribute('visible', 'true');
          this.screenPhase = 'end';
        }
        break;
    }
    // Voice phases
    switch (this.voicePhase) {
      case 'gate1':
        if (this.system.truncMarker(this.carControls.carMarker) > 70) {
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
        if (this.system.truncMarker(this.carControls.carMarker) > 480) {
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
      case 'start':
        this.start();
        break;
      case 'stop':
        this.stop();
        break;
      case 'stay':
        this.stay();
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
