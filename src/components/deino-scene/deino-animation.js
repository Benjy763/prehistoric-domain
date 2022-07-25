AFRAME.registerComponent('deino-animation', {
  schema: {},
  init: function () {
    this.tick = AFRAME.utils.throttleTick(this.tick, 25, this);
    // Objects shortcut
    this.object = this.el.object3D;
    this.system = document.querySelector('a-scene').systems['system'];
    this.movesManager =
      document.querySelector('a-scene').systems['movesManager'];
    this.phase = '';
    this.car = document.querySelector('#deino-car');

    // deino run Path
    this.deinoMarker = 0; // Position on the curve
    this.deinoSpeed = 0.016; // Speed on the curve
    this.jumpcurve = new THREE.SplineCurve([
      new THREE.Vector2(-1.8, -3.208),
      new THREE.Vector2(0.974, -3.656),
      new THREE.Vector2(2.2, -4.487),
      new THREE.Vector2(2.4, -6.011),
      new THREE.Vector2(2.1, -7.1),
      new THREE.Vector2(2.717, -8.101),
      new THREE.Vector2(2.275, -9.477),
      new THREE.Vector2(-1.8, -13.351),
    ]);

    // Sound
    //this.bodyRoarAudio = this.el.components['sound__bodyroar'];

    // Start tour listener
    this.el.addEventListener(
      'enter',
      () => {
        // Load sounds
        this.deinoIntroAudio = this.el.components['sound__intro'];
        this.deinoJumpStartAudio = this.el.components['sound__jumpstart'];
        this.deinoRoarAudio = this.el.components['sound__roar'];
        this.deinoJumpEndAudio = this.el.components['sound__jumpend'];

        this.el.setAttribute('animation-mixer', {
          clip: 'Deinonychus_Jump_Jump',
          timeScale: 0.5,
        });
        this.phase = 'hidden';
      },
      false
    );
  },
  // --- Phase functions ---
  hidden: function () {
    this.deinoIntroAudio.playSound();
    this.phase = 'exit';
    setTimeout(() => {
      this.deinoJumpStartAudio.playSound();
      this.phase = 'jumpEnter';
    }, 19000);
  },
  jumpEnter: function () {
    if (this.movesManager.truncMarker(this.deinoMarker) > 300) {
      this.el.setAttribute('animation-mixer', {
        clip: 'Deinonychus_Jump_Landing',
        timeScale: 0.8,
        crossFadeDuration: 0.2,
      });
    }
    if (this.movesManager.truncMarker(this.deinoMarker) > 410) {
      setTimeout(() => {
        this.el.setAttribute('animation-mixer', {
          clip: 'Deinonychus_Idle_Roar',
          timeScale: 0.9,
          crossFadeDuration: 0.2,
        });
        this.deinoRoarAudio.playSound();
        this.phase = 'roar';
      }, 400);
      this.phase = 'exit';
    }
    this.deinoMarker = this.movesManager.moveOnCurve(
      this.object,
      this.jumpcurve,
      this.deinoMarker,
      this.deinoSpeed,
      'yz',
      false
    );
  },
  roar: function () {
    setTimeout(() => {
      this.el.setAttribute('animation-mixer', {
        clip: 'Deinonychus_Jump_Jump',
        timeScale: 0.8,
        crossFadeDuration: 0.2,
      });
      this.deinoJumpEndAudio.playSound();
      this.phase = 'jumpEnd';
    }, 7000);
    this.phase = 'roaring';
  },
  jumpEnd: function () {
    if (this.movesManager.truncMarker(this.deinoMarker) > 580) {
      this.phase = 'end';
    }
    this.deinoMarker = this.movesManager.moveOnCurve(
      this.object,
      this.jumpcurve,
      this.deinoMarker,
      this.deinoSpeed,
      'yz',
      false
    );
  },
  end: function () {
    if (this.movesManager.truncMarker(this.deinoMarker) > 950) {
      setTimeout(() => {
        const event = new Event('turnOnLight');
        this.car.dispatchEvent(event);
      }, 5000);
      this.phase = 'exit';
    }
    this.deinoMarker = this.movesManager.moveOnCurve(
      this.object,
      this.jumpcurve,
      this.deinoMarker,
      this.deinoSpeed,
      'yz',
      false
    );
  },
  tick: function () {
    // Animation steps
    switch (this.phase) {
      case 'hidden':
        this.hidden();
        break;
      case 'jumpEnter':
        this.jumpEnter();
        break;
      case 'roar':
        this.roar();
        break;
      case 'jumpEnd':
        this.jumpEnd();
        break;
      case 'end':
        this.end();
        break;
    }
  },
});
