AFRAME.registerComponent('deinocheirus-car-tour', {
  init: function () {
    this.scene = 'deinocheirus';
    this.tick = AFRAME.utils.throttleTick(this.tick, 25, this);

    this.system = document.querySelector('a-scene').systems['system'];
    this.cameraPosition = document.querySelector(
      '#' + this.system.getActualSceneObject().camera
    ).object3D.position;
    this.movesManager =
      document.querySelector('a-scene').systems['movesManager'];
    this.carControls;
    this.deinocheirus = document.querySelector('#deinocheirus');
    this.tree = document.querySelector('#deinocheirus-swamp-dead-tree-3');
    this.screenDeinocheirus = document.getElementById(
      'deinocheirus-screen-deinocheirus'
    );
    this.screenPhase = 'deinocheirus';
    this.textCar = document.querySelector('#deinocheirus-camera-text');

    // Tree falling animaiton
    // Get the tree entity
    this.treeObject = document.querySelector(
      '#deinocheirus-swamp-dead-tree-3'
    ).object3D;
    this.treeRotationStep = 0.008;

    // Snake animation
    this.snake = document.querySelector('#deinocheirus-snake');

    // Animation phase
    this.sceneChanged = false;

    // Sound
    this.voicePhase = 'sound';
    this.soundMixing1SoundPlaying = false;
    this.leaveSoundPlaying = false;
    this.soundMixing1Audio = document.getElementById('sound-mixing-1');
    this.leaveAudio = document.getElementById('leave');

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
        // Get voice from system when init
        this.voiceDeinocheirusSound = this.system.getVoice('deinocheirus');
        this.voicePhase = 'deinocheirus';

        // Global sound launch
        document.getElementById('swamp-3-asset').play();
        this.deinoEatSound = this.deinocheirus.components['sound__eat'];
        this.treeFallSound = this.tree.components['sound__fall'];
        this.phase = 'start';
      },
      false
    );
    this.el.addEventListener(
      'snakeEnter',
      () => {
        setTimeout(() => {
          this.phase = 'snakeEnter';
        }, 3000);
      },
      false
    );
    this.el.addEventListener(
      'snakePause',
      () => {
        this.phase = 'exit';
        this.treeFallSound.playSound();
        setTimeout(() => {
          this.phase = 'treeFall';
        }, 13000);
      },
      false
    );
  },
  // --- Phase functions ---
  start: function () {
    setTimeout(() => {
      this.deinoEatSound.playSound();
    }, 1000);
    this.phase = 'deinoLeaveEat';
  },
  deinoLeaveEat: function () {
    this.phase = 'exit';
    // Trigger Rabbit animation
    const event = new Event('leaveEat');
    this.deinocheirus.dispatchEvent(event);
  },
  snakeEnter: function () {
    this.phase = 'exit';
    // Trigger Rabbit animation
    const event = new Event('enterWalk');
    this.snake.dispatchEvent(event);
  },
  treeFall: function () {
    this.treeRotationStep += 0.0001;
    this.treeObject.rotation.x -= this.treeRotationStep;
    if (this.treeObject.rotation.x < -2) {
      setTimeout(() => {
        this.phase = 'deinoStart';
      }, 3000);
    }
  },
  deinoStart: function () {
    document.querySelector('#deinocheirus-sky').setAttribute('visible', true);
    setTimeout(() => {
      // Trigger Rabbit animation
      const event = new Event('enterWalk');
      this.deinocheirus.dispatchEvent(event);
    }, 100);
    this.phase = 'exit';
  },
  checkpointListener: function () {
    if (this.movesManager.distanceFromPoint('deinocheirus-checkpoint') < 3) {
      this.textCar.setAttribute('visible', 'true');
      this.movesManager.nextScene = 'ending';
    }
    if (this.movesManager.distanceFromPoint('deinocheirus-checkpoint') >= 3) {
      this.textCar.setAttribute('visible', 'false');
      this.movesManager.nextScene = null;
    }
  },
  tick: function () {
    // Checkpoint listener
    this.checkpointListener();
    // Voice phases
    if (this.voiceDeinocheirusSound) {
      switch (this.voicePhase) {
        case 'deinocheirus':
          this.voiceDeinocheirusSound.play();
          this.voicePhase = 'exit';
          break;
      }
    }
    // Animation phases
    switch (this.phase) {
      case 'start':
        this.start();
        break;
      case 'deinoLeaveEat':
        this.deinoLeaveEat();
        break;
      case 'snakeEnter':
        this.snakeEnter();
        break;
      case 'treeFall':
        this.treeFall();
        break;
      case 'deinoStart':
        this.deinoStart();
        break;
      case 'changeScene':
        // Destroy and detach all unecessary objets
        // Change scene
        this.system.changeScene('raptor');
        this.phase = 'exit';
        break;
    }
  },
});
