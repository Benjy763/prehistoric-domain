AFRAME.registerComponent('aviary-car-tour', {
  init: function () {
    this.scene = 'aviary';
    this.tick = AFRAME.utils.throttleTick(this.tick, 25, this);

    this.system = document.querySelector('a-scene').systems['game'];
    this.ptera = document.querySelector('#pteranodon');
    this.quetza = document.querySelector('#quetza');
    this.envLights = document.getElementById('gate-ambiant-light');

    // Sounds
    this.ambiant1Sound;
    this.ambiant2Sound;

    // Voice and screen phases
    this.voicePhase = 'aviary1';

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
        // Get sounds
        this.ambiant1Sound =
          document.getElementById('aviary-cliff-1').components[
            'sound__ambiant1'
          ];
        this.ambiant2Sound =
          document.getElementById('aviary-cliff-2').components[
            'sound__ambiant2'
          ];
        // Get voice from system when init
        this.voiceAviary1Sound = this.system.getVoice('aviary1');

        this.phase = 'start';
      },
      false
    );

    // Restart tour listeners
    this.el.addEventListener(
      'restartPtera',
      () => {
        this.phase = 'restartPtera';
      },
      false
    );
    this.el.addEventListener(
      'restartQuetzaWalk',
      () => {
        this.phase = 'restartQuetzaWalk';
      },
      false
    );
    this.el.addEventListener(
      'restartQuetzaFly',
      () => {
        this.phase = 'restartQuetzaFly';
      },
      false
    );
  },
  // --- Phase functions ---
  start: function () {
    setTimeout(() => {
      this.ambiant1Sound.playSound();
    }, 20000);
    setTimeout(() => {
      // Trigger Pteranodon animation
      const event = new Event('enter');
      this.ptera.dispatchEvent(event);
    }, 45000);
    this.phase = 'exit';
  },
  restartPtera: function () {
    setTimeout(() => {
      // Trigger Pteranodon animation
      const event = new Event('enterWalk');
      this.quetza.dispatchEvent(event);
    }, 6000);
    this.phase = 'exit';
  },
  restartQuetzaWalk: function () {
    setTimeout(() => {
      // Trigger Pteranodon animation
      const event = new Event('enterFly');
      this.quetza.dispatchEvent(event);
    }, 6000);
    this.phase = 'exit';
  },
  restartQuetzaFly: function () {
    this.phase = 'exit';
  },
  tick: function () {
    // Voice phases
    switch (this.voicePhase) {
      case 'aviary1':
        // this.voiceAviary1Sound.play();
        // this.voicePhase = 'exit';
        break;
    }
    // Animation phases
    switch (this.phase) {
      case 'start':
        this.start();
        break;
      case 'restartPtera':
        this.restartPtera();
        break;
      case 'restartQuetzaWalk':
        this.restartQuetzaWalk();
        break;
      case 'restartQuetzaFly':
        this.restartQuetzaFly();
        break;
      case 'changeScene':
        if (!this.sceneChanged) {
          // Destroy and detach all unecessary objets
          //Change scene
          this.system.changeScene('ending');
          this.sceneChanged = true;
        }
        break;
    }
  },
});
