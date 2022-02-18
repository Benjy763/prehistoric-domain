AFRAME.registerComponent('lagoon-car-tour', {
  init: function () {
    this.scene = 'aviary';
    this.tick = AFRAME.utils.throttleTick(this.tick, 25, this);

    this.system = document.querySelector('a-scene').systems['game'];
    this.meg = document.querySelector('#meg');

    // Sounds
    this.ambiant1Sound;
    this.hitSound;

    // Voice and screen phases
    this.voicePhase = 'stop';

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
        // Global sound launch
        document.getElementById('jungle-asset').play();

        // Get sounds
        this.ambiant1Sound =
          document.getElementById('lagoon-station').components[
            'sound__ambiant1'
          ];
        this.hitSound =
          document.getElementById('lagoon-dome').components['sound__hit'];

        // Get voice from system when init

        this.voiceLagoon1Sound = this.system.getVoice('lagoon1');
        this.voicePhase = 'lagoon1';
        setTimeout(() => {
          this.phase = 'start';
        }, 6000);
      },
      false
    );

    // Tour listeners
    this.el.addEventListener(
      'hit',
      () => {
        this.phase = 'hit';
      },
      false
    );

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
    setTimeout(() => {
      this.ambiant1Sound.playSound();
    }, 10000);
    setTimeout(() => {
      const event = new Event('enter');
      this.meg.dispatchEvent(event);
    }, 30000);
    this.phase = 'exit';
  },
  hit: function () {
    setTimeout(() => {
      this.hitSound.playSound();
    }, 3000);
    this.phase = 'exit';
  },
  tick: function () {
    // Voice phases
    switch (this.voicePhase) {
      case 'lagoon1':
        this.voiceLagoon1Sound.play();
        this.voicePhase = 'exit';
        break;
    }
    // Animation phases
    switch (this.phase) {
      case 'start':
        this.start();
        break;
      case 'hit':
        this.hit();
        break;
      case 'restart':
        setTimeout(() => {
          this.phase = 'changeScene';
        }, 3000);
        break;
      case 'changeScene':
        if (!this.sceneChanged) {
          // Destroy and detach all unecessary objets
          //Change scene
          const mainScene = document.getElementById('main-scene');
          mainScene.setAttribute('background', {
            color: '#000', //#00496c
          });
          mainScene.setAttribute('fog', {
            type: 'exponential',
            color: '#000',
            density: 0.1,
          });
          setTimeout(() => {
            window.location.href = 'https://map.prehistoricdomain.com/';
          }, 8000);
          this.system.changeScene('ending', false);
          this.sceneChanged = true;
        }
        break;
    }
  },
});
