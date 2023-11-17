AFRAME.registerComponent('cretaceous-lagoon-car-tour', {
  init: function () {
    this.scene = 'aviary';
    this.tick = AFRAME.utils.throttleTick(this.tick, 25, this);

    this.system = document.querySelector('a-scene').systems['system'];
    this.meg = document.querySelector('#meg');
    this.movesManager =
      document.querySelector('a-scene').systems['movesManager'];
    this.textCar = document.querySelector('#cretaceous-lagoon-camera-text');
    this.light = document.querySelector('#cretaceous-lagoon-directionaltarget');
    this.plesiosaur1 = document.querySelector('#plesiosaur-1');
    this.plesiosaur2 = document.querySelector('#plesiosaur-2');
    this.ichthyosaur = document.querySelector('#ichthyosaur');
    this.plesiosaur1Config = {};
    this.plesiosaur2Config = {};

    // Sounds
    this.ambiant1Sound;

    // Voice and screen phases
    this.voicePhase = 'stop';

    // Plesiosaur 1 path config
    this.plesiosaur1Marker = 0; // Position on the curve
    this.plesiosaur1Speed = 0.03;
    // Plesiosaur 2 path config
    this.plesiosaur2Marker = 0; // Position on the curve
    this.plesiosaur2Speed = 0.03;

    // Tour Path
    this.plesiosaur1curve1 = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-35.813, 6.108, 1.639),
      new THREE.Vector3(-2.111, 8.318, -8.842),
      new THREE.Vector3(14.147, 5, -6.817),
      new THREE.Vector3(47.179, 2, 15.078),
    ]);
    this.plesiosaur2curve1 = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-51.316, -4, -65.409),
      new THREE.Vector3(1.055, 4, -9.823),
      new THREE.Vector3(7.7, 4, 1.582),
      new THREE.Vector3(-5.168, 6.316, 85.609),
    ]);
    this.plesiosaur2curve2 = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-40.374, 2, -9.398),
      new THREE.Vector3(3.391, 7.47, -9.398),
      new THREE.Vector3(22.655, 40.349, -9.398),
    ]);

    // En scene activation
    this.sceneChanged = false;

    // Start tour listeners
    this.el.addEventListener(
      'start',
      () => {
        // Start the light animation
        this.light.emit('startAnimation');

        // Global sound launch
        document.getElementById('jungle-asset').play();

        // Get sounds

        // Get voice from system when init
        this.voiceLagoon1Sound = this.system.getVoice('cretaceousLagoon');
        this.voicePhase = 'lagoon1';
        this.plesiosaur1.setAttribute('animation-mixer', {
          clip: 'Take 001',
          crossFadeDuration: 1,
          timeScale: 1.5,
        });
        setTimeout(() => {
          this.plesiosaur2.setAttribute('animation-mixer', {
            clip: 'Take 001',
            crossFadeDuration: 1,
            timeScale: 1.5,
          });
        }, 2000);

        setTimeout(() => {
          this.phase = 'start';
        }, 10000);
      },
      false
    );

    // Tour listeners
  },
  // --- Phase functions ---
  start: function () {
    setTimeout(() => {
      this.ambiant1Sound.playSound();
    }, 10000);
    this.phase = 'plesiosaurFirstMove';
  },
  plesiosaurFirstMove: function () {
    this.plesiosaur1Marker = this.movesManager.moveOnCurve(
      this.plesiosaur1Config,
      this.plesiosaur1.object3D,
      this.plesiosaur1curve1,
      this.plesiosaur1Marker,
      this.plesiosaur1Speed,
      { useDeltaTime: true }
    );
    this.plesiosaur2Marker = this.movesManager.moveOnCurve(
      this.plesiosaur2Config,
      this.plesiosaur2.object3D,
      this.plesiosaur2curve1,
      this.plesiosaur2Marker,
      this.plesiosaur2Speed,
      { useDeltaTime: true }
    );
    if (this.movesManager.truncMarker(this.plesiosaur1Marker) > 900) {
      this.plesiosaur2Marker = 0;
      this.plesiosaur2Speed = 0.06;
      this.phase = 'plesiosaurSecondMove';
    }
  },
  plesiosaurSecondMove: function () {
    this.plesiosaur2Marker = this.movesManager.moveOnCurve(
      this,
      this.plesiosaur2.object3D,
      this.plesiosaur2curve2,
      this.plesiosaur2Marker,
      this.plesiosaur2Speed,
      { useDeltaTime: true }
    );
    if (this.movesManager.truncMarker(this.plesiosaur2Marker) > 900) {
      this.phase = 'exit';
    }
  },
  checkpointListener: function () {
    if (
      this.movesManager.distanceFromPoint('cretaceous-lagoon-checkpoint') < 1
    ) {
      this.textCar.setAttribute('visible', 'true');
      this.movesManager.nextScene = 'ending';
    }
    if (
      this.movesManager.distanceFromPoint('cretaceous-lagoon-checkpoint') >= 1
    ) {
      this.textCar.setAttribute('visible', 'false');
      this.movesManager.nextScene = null;
    }
  },
  tick: function () {
    // Checkpoint listener
    this.checkpointListener();
    // Voice phases
    if (this.voiceLagoon1Sound) {
      switch (this.voicePhase) {
        case 'lagoon1':
          this.voiceLagoon1Sound.play();
          this.voicePhase = 'exit';
          break;
      }
    }
    // Animation phases
    switch (this.phase) {
      case 'start':
        this.start();
        break;
      case 'plesiosaurFirstMove':
        this.plesiosaurFirstMove();
        break;
      case 'plesiosaurSecondMove':
        this.plesiosaurSecondMove();
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
