AFRAME.registerComponent('trice-car-tour', {
  init: function () {
    this.scene = 'trice';
    this.tick = AFRAME.utils.throttleTick(this.tick, 60, this);

    this.system = document.querySelector('a-scene').systems['game'];
    this.console = document.querySelector('a-scene').systems['console'];
    this.gate = document.querySelector('#gate-back');
    this.trice = document.querySelector('#trice');
    this.gateSound = document.getElementById('gate-sound');
    this.gateCloseSound = document.getElementById('gate-close-sound');
    this.carControls;
    this.animationsStatuses = {
      gateOpen: false,
      gateClosed: false,
    };
    // Tour Path
    const curve = new THREE.SplineCurve([
      new THREE.Vector2(9.7, -174.7),
      new THREE.Vector2(7.988, 81.899),
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
      this.carControls.initParams(curve, 800);
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

    // Restart tour listener, trigger by trice controler
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
    if (this.system.truncMarker(this.carControls.carMarker) === 310) {
      this.phase = 'stop';
    }
  },
  stop: function () {
    this.carControls.changeDrivingState('stopping');
    this.phase = 'stay';
  },
  stay: function () {
    const event = new Event('enter');
    // Trigger trice animation
    this.trice.dispatchEvent(event);
    this.phase = 'animation';
  },
  restart: function () {
    this.carControls.changeDrivingState('starting');
    this.phase = 'finish';
  },
  finish: function () {
    this.system.log(this.carControls.carMarker);
    if (
      this.system.truncMarker(this.carControls.carMarker) > 615 &&
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
      this.system.truncMarker(this.carControls.carMarker) > 720 &&
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
    if (
      this.system.truncMarker(this.carControls.carMarker) >
      this.carControls.maxDistance
    ) {
      this.carControls.changeDrivingState('stopping');
      if (this.carControls.carSpeed <= 0) {
        this.phase = 'changeScene';
      }
    }
  },
  tick: function () {
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
          // Change scene
          //this.system.changeScene('dilo');
          this.sceneChanged = true;
        }
        break;
    }
  },
});
