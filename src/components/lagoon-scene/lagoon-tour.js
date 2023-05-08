AFRAME.registerComponent('lagoon-car-tour', {
  init: function () {
    this.scene = 'aviary';
    this.tick = AFRAME.utils.throttleTick(this.tick, 25, this);

    this.system = document.querySelector('a-scene').systems['system'];
    this.meg = document.querySelector('#meg');
    this.movesManager =
      document.querySelector('a-scene').systems['movesManager'];
    this.textCar = document.querySelector('#lagoon-camera-text');

    // Sounds
    this.ambiant1Sound;

    // Voice and screen phases
    this.voicePhase = 'stop';

    // Tour Path
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(7.988, 0, 81.899),
      new THREE.Vector3(9.7, 0, -174.7),
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
        }, 10000);
      },
      false
    );

    // Tour listeners
    this.el.addEventListener(
      'hited',
      () => {
        this.phase = 'hited';
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
  checkpointListener: function () {
    if (this.movesManager.distanceFromPoint('lagoon-checkpoint') < 1) {
      this.textCar.setAttribute('visible', 'true');
      this.movesManager.nextScene = 'ending';
    }
    if (this.movesManager.distanceFromPoint('lagoon-checkpoint') >= 1) {
      this.textCar.setAttribute('visible', 'false');
      this.movesManager.nextScene = null;
    }
  },
  tick: function () {
    // Checkpoint listener
    this.checkpointListener();
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
      case 'hited':
        this.hit();
        break;
      case 'restart':
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
