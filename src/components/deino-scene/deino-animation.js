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
    this.plant1 = document.querySelector('#deino-forest-plant-1');
    this.plant2 = document.querySelector('#deino-forest-plant-2');
    this.plant1TimeScale = 5;
    this.plant2TimeScale = 5;
    this.dragonFly = document.querySelector('#deino-dragonfly');

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
      new THREE.Vector2(2.275, -10),
      new THREE.Vector2(-1.8, -15),
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
        setTimeout(() => {
          const event = new Event('enter');
          this.dragonFly.dispatchEvent(event);
        }, 10000);
        this.phase = 'hidden';
      },
      false
    );

    this.el.addEventListener(
      'jump',
      () => {
        this.plant1.setAttribute('animation-mixer', {
          clip: 'Take 001',
          timeScale: this.plant1TimeScale,
          loop: false,
        });
        setTimeout(() => {
          this.plant2.setAttribute('animation-mixer', {
            clip: 'Take 001',
            timeScale: this.plant2TimeScale,
            loop: false,
          });
        }, 200);
        this.deinoJumpStartAudio.playSound();
        this.phase = 'jumpEnter';
      },
      false
    );
  },
  // --- Phase functions ---
  hidden: function () {
    this.deinoIntroAudio.playSound();
    this.phase = 'exit';
  },
  waiting: function () {
    console.log(this.plant1TimeScale);
    if (this.plant1TimeScale <= 0) {
      return;
    }
    this.plant1TimeScale -= 0.04;
    this.plant2TimeScale -= 0.04;
    this.plant1.setAttribute('animation-mixer', {
      clip: 'Take 001',
      timeScale: this.plant1TimeScale,
      loop: false,
    });
    this.plant2.setAttribute('animation-mixer', {
      clip: 'Take 001',
      timeScale: this.plant2TimeScale,
      loop: false,
    });
  },
  jumpEnter: function () {
    if (this.movesManager.truncMarker(this.deinoMarker) > 400) {
      const event = new Event('flyAgain');
      this.dragonFly.dispatchEvent(event);
      this.el.setAttribute('animation-mixer', {
        clip: 'Deinonychus_Jump_Landing',
        timeScale: 0.9,
        crossFadeDuration: 0.2,
      });
      setTimeout(() => {
        this.el.setAttribute('animation-mixer', {
          clip: 'Deinonychus_Idle_Roar',
          timeScale: 0.9,
          crossFadeDuration: 0.1,
        });
        this.deinoRoarAudio.playSound();
        this.phase = 'roar';
      }, 500);
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
        crossFadeDuration: 0.1,
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
        this.waiting();
        this.jumpEnter();
        break;
      case 'roar':
        this.waiting();
        this.roar();
        break;
      case 'roaring':
        this.waiting();
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
