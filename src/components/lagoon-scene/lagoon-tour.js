AFRAME.registerComponent('lagoon-car-tour', {
  init: function () {
    this.scene = 'aviary';
    this.tick = AFRAME.utils.throttleTick(this.tick, 25, this);

    this.system = document.querySelector('a-scene').systems['game'];
    this.meg = document.querySelector('#meg');

    // Sounds
    this.ambiant1Sound;
    this.ambiant2Sound;

    // Voice and screen phases
    this.voicePhase = 'lagoon1';

    // Tour Path
    const curve = new THREE.SplineCurve([
      new THREE.Vector2(7.988, 81.899),
      new THREE.Vector2(9.7, -174.7),
    ]);

    // En scene activation
    this.sceneChanged = false;

    // Start tour listeners
    this.el.addEventListener(
      'start',
      () => {
        // Set main scene atmosphere color
        const mainSCene = document.getElementById('main-scene');
        mainSCene.setAttribute('background', {
          color: '#26537a', //#00496c
        });
        mainSCene.setAttribute('fog', {
          type: 'exponential',
          color: '#26537a',
          density: 0.1,
        });

        // Global sound launch
        document.getElementById('jungle-asset').play();

        // Get sounds
        // Get voice from system when init
        this.voiceLagoon1Sound = this.system.getVoice('lagoon1');

        this.phase = 'start';
      },
      false
    );

    // Restart tour listeners
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
    this.phase = 'exit';
  },
  restart: function () {},
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
      case 'restart':
        this.restart();
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
