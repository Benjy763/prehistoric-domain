AFRAME.registerComponent('aviary-car-tour', {
  init: function () {
    const test = !!true;
    this.scene = 'aviary';
    this.tick = AFRAME.utils.throttleTick(this.tick, 25, this);

    this.system = document.querySelector('a-scene').systems['system'];
    this.cameraPosition = document.querySelector(
      '#' + this.system.getActualSceneObject().camera
    ).object3D.position;
    this.movesManager =
      document.querySelector('a-scene').systems['movesManager'];
    this.ptera = document.querySelector('#pteranodon');
    this.ptera2 = document.querySelector('#pteranodon-2');
    this.textCar = document.querySelector('#aviary-camera-text');

    // Sounds
    this.ambiant1Sound;
    this.ambiant3Sound;

    // Voice and screen phases
    this.voicePhase = 'stop';

    // Tour Path
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(7.988, 0, 81.899),
      new THREE.Vector3(9.7, 0, -174.7)
    ]);

    // En scene activation
    this.sceneChanged = false;

    // Inits
    this.initPteraAnimation();

    // Start tour listeners
    this.el.addEventListener(
      'start',
      () => {
        // Global sound launch
        document.getElementById('coast-asset').play();

        // Get voice from system when init
        this.voicePteraSound = this.system.getVoice('ptera');
        this.voicePhase = 'ptera';
        setTimeout(() => {
          this.phase = 'start';
        }, 40000);
      },
      false
    );

    this.el.addEventListener(
      'secondPtera',
      () => {
        setTimeout(() => {
          // Trigger Pteranodon animation
          const event = new Event('enter');
          this.ptera2.dispatchEvent(event);
        }, 8000);
      },
      false
    );

    this.el.addEventListener(
      'lastPtera',
      () => {
        setTimeout(() => {
          // Trigger Pteranodon animation
          const event = new Event('endFly');
          this.ptera.dispatchEvent(event);
        }, 8000);
      },
      false
    );
  },
  initPteraAnimation: function () {
    const pteras = [
      'pteranodon',
      'pteranodon-2',
      'pteranodon-3',
      'pteranodon-4',
      'pteranodon-5',
      'pteranodon-6',
      'pteranodon-7'
    ];
    let timeout = 200;
    pteras.forEach((ptera) => {
      timeout += 4000;
      setTimeout(() => {
        document.querySelector('#' + ptera).setAttribute('animation-mixer', {
          clip: 'Ptera_Full_Break',
          loop: true,
          timeScale: 0.6,
          crossFadeDuration: 0.5
        });
      }, timeout);
    });
  },
  // --- Phase functions ---
  start: function () {
    setTimeout(() => {
      // Trigger Pteranodon animation
      const event = new Event('enter');
      this.ptera.dispatchEvent(event);
    }, 8000);
    this.phase = 'exit';
  },
  checkpointListener: function () {
    if (this.movesManager.distanceFromPoint('aviary-checkpoint') < 3) {
      this.textCar.setAttribute('visible', 'true');
      this.movesManager.nextScene = 'ending';
    }
    if (this.movesManager.distanceFromPoint('aviary-checkpoint') >= 3) {
      this.textCar.setAttribute('visible', 'false');
      this.movesManager.nextScene = null;
    }
  },
  tick: function () {
    // Checkpoint listener
    this.checkpointListener();
    // Voice phases
    if (this.voicePteraSound) {
      switch (this.voicePhase) {
        case 'ptera':
          this.voicePteraSound.play();
          this.voicePhase = 'exit';
          break;
      }
    }
    // Animation phases
    switch (this.phase) {
      case 'start':
        this.start();
        break;
      case 'changeScene':
        // Destroy and detach all unecessary objets
        // Change scene
        this.system.changeEndingScene('ending');
        this.phase = 'exit';
        break;
    }
  }
});
