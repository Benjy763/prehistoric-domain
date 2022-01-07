AFRAME.registerComponent('aviary-car-tour', {
  init: function () {
    this.scene = 'aviary';
    this.tick = AFRAME.utils.throttleTick(this.tick, 25, this);

    this.system = document.querySelector('a-scene').systems['game'];
    this.ptera = document.querySelector('#pteranodon');
    this.quetza = document.querySelector('#quetza');
    this.envLights = document.getElementById('gate-ambiant-light');

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
        // Get voice from system when init
        this.voiceAviary1Sound = this.system.getVoice('aviary1');

        this.phase = 'start';
      },
      false
    );

    // Restart tour listener, trigger by quetza controler
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
    console.log('test', this.carControls);
    setTimeout(() => {
      // Trigger Pteranodon animation
      const event = new Event('enter');
      this.ptera.dispatchEvent(event);
      this.phase = 'exit';
    }, 6000);
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
