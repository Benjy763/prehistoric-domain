AFRAME.registerComponent('deinocheirus-animation', {
  schema: {},
  init: function () {
    this.tick = AFRAME.utils.throttleTick(this.tick, 25, this);
    // Objects shortcut
    this.object = this.el.object3D;
    this.system = document.querySelector('a-scene').systems['system'];
    this.car = document.querySelector('#deinocheirus-car');
    this.movesManager =
      document.querySelector('a-scene').systems['movesManager'];
    this.phase = '';
    this.animationChange = 'roar';
    // Deinocheirus run Path
    this.deinocheirusMarker = 0; // Position on the curve
    this.deinocheirusEatSpeed = 0.06;
    this.deinocheirusSpeed = 0.015;
    this.deinocheirusChangingSpeed = 0.002;
    this.deinocheirusMaxDeceleration = 0.001;
    this.deinocheirusMaxAcceleration = 0.015;
    this.eatCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-68.111, -4.5, 0.817),
      new THREE.Vector3(-68.111, -11, 23.911),
    ]);
    this.curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-33.689, -10, 58.795),
      new THREE.Vector3(-33.689, -2.5, 35.66),
      new THREE.Vector3(-33.689, -0.85, -82.936),
    ]);

    // Snake animation
    this.snake = document.querySelector('#deinocheirus-snake');

    // Start tour listener
    this.el.addEventListener(
      'leaveEat',
      () => {
        // Load sounds
        this.deinoWalkSound = this.el.components['sound__walk'];
        this.deinoCheckSound = this.el.components['sound__check'];
        this.deinoLeaveFarSound = this.el.components['sound__leavefar'];
        // Get voice from system when init
        this.voiceDeinoSound = this.system.getVoice('deinocheirus');
        this.voicePhase = 'deino';

        this.deinocheirusMarker = this.movesManager.moveOnCurve(
          this,
          this.el.object3D,
          this.eatCurve,
          this.deinocheirusMarker,
          this.deinocheirusEatSpeed,
          { useDeltaTime: true }
        );
        this.phase = 'exit';
        // Launch animation
        setTimeout(() => {
          this.lastUpdateTime = performance.now();
          this.phase = 'leaveEat';
          this.el.setAttribute('animation-mixer', {
            clip: 'Walk',
            loop: true,
            crossFadeDuration: 1.5,
            timeScale: 0.8,
          });
        }, 45000);
      },
      false
    );

    this.el.addEventListener(
      'enterWalk',
      () => {
        // Launch animation
        setTimeout(() => {
          this.deinoWalkSound.playSound();
          this.phase = 'enterWalk';
          this.el.setAttribute('animation-mixer', {
            clip: 'Walk',
            loop: true,
            crossFadeDuration: 0.4,
            timeScale: 0.8,
          });
        }, 6000);
      },
      false
    );
  },
  leaveEat: function () {
    this.deinocheirusMarker = this.movesManager.moveOnCurve(
      this,
      this.el.object3D,
      this.eatCurve,
      this.deinocheirusMarker,
      this.deinocheirusEatSpeed,
      { useDeltaTime: true }
    );

    if (this.movesManager.truncMarker(this.deinocheirusMarker) > 900) {
      const event = new Event('snakeEnter');
      this.car.dispatchEvent(event);
      this.phase = 'exit';
      this.deinocheirusMarker = 0;
    }
  },
  enterWalk: function () {
    this.deinocheirusMarker = this.movesManager.moveOnCurve(
      this,
      this.el.object3D,
      this.curve,
      this.deinocheirusMarker,
      this.deinocheirusSpeed,
      { useDeltaTime: true }
    );

    if (this.movesManager.truncMarker(this.deinocheirusMarker) > 330) {
      if (this.deinocheirusSpeed === this.deinocheirusMaxAcceleration) {
        this.el.setAttribute('animation-mixer', {
          clip: 'MoveAround',
          loop: true,
          crossFadeDuration: 1,
          timeScale: 0.9,
        });
      }
      if (this.deinocheirusSpeed > 0) {
        this.deinocheirusSpeed -= this.deinocheirusChangingSpeed;
      }
      if (this.deinocheirusSpeed < this.deinocheirusMaxDeceleration) {
        const event = new Event('walkAgain');
        this.snake.dispatchEvent(event);

        this.deinoCheckSound.playSound();
        setTimeout(() => {
          this.deinoWalkSound.stopSound();
        }, 500);
        this.phase = 'moveAround';
      }
    }
  },
  moveAround: function () {
    setTimeout(() => {
      this.el.setAttribute('animation-mixer', {
        clip: 'Walk',
        loop: true,
        crossFadeDuration: 1.5,
        timeScale: 0.8,
      });
      this.deinocheirusSpeed = 0;
      this.lastUpdateTime = performance.now();
      this.deinoWalkSound.playSound();
      setTimeout(() => {
        this.phase = 'walkAgain';
      }, 100);
    }, 14000);
    this.phase = 'exit';
  },
  walkAgain: function () {
    if (this.deinocheirusSpeed < this.deinocheirusMaxAcceleration) {
      this.deinocheirusSpeed += this.deinocheirusChangingSpeed;
    }

    this.deinocheirusMarker = this.movesManager.moveOnCurve(
      this,
      this.el.object3D,
      this.curve,
      this.deinocheirusMarker,
      this.deinocheirusSpeed,
      { useDeltaTime: true }
    );

    if (this.movesManager.truncMarker(this.deinocheirusMarker) > 990) {
      this.deinoLeaveFarSound.playSound();
      setTimeout(() => {
        this.deinoWalkSound.stopSound();
      }, 500);
      this.phase = 'exit';
    }
  },
  tick: function () {
    // Voice phases
    switch (this.voicePhase) {
      case 'deino':
        this.voiceDeinoSound.play();
        this.voicePhase = 'exit';
        break;
    }

    // Animation steps
    switch (this.phase) {
      case 'enter':
        this.enter();
        // Something else with another function if needed in each step
        break;
      case 'leaveEat':
        this.leaveEat();
        break;
      case 'enterWalk':
        this.enterWalk();
        break;
      case 'moveAround':
        this.moveAround();
        break;
      case 'walkAgain':
        this.walkAgain();
        break;
    }
  },
});
