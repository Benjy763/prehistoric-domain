AFRAME.registerComponent('deinocheirus-animation', {
  schema: {},
  init: function () {
    this.tick = AFRAME.utils.throttleTick(this.tick, 25, this);
    // Objects shortcut
    this.object = this.el.object3D;
    this.system = document.querySelector('a-scene').systems['system'];
    this.movesManager =
      document.querySelector('a-scene').systems['movesManager'];
    this.phase = '';
    this.animationChange = 'roar';
    // Deinocheirus run Path
    this.deinocheirusMarker = 0; // Position on the curve
    this.deinocheirusSpeed = 0.015;
    this.deinocheirusChangingSpeed = 0.002;
    this.deinocheirusMaxDeceleration = 0.001;
    this.deinocheirusMaxAcceleration = 0.015;
    this.curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-33.689, -10, 58.795),
      new THREE.Vector3(-33.689, -2.5, 35.66),
      new THREE.Vector3(-33.689, -0.85, -82.936),
    ]);

    // Snake animation
    this.snake = document.querySelector('#deinocheirus-snake');

    // Start tour listener
    this.el.addEventListener(
      'enterWalk',
      () => {
        // Launch animation
        setTimeout(() => {
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
  enterWalk: function () {
    this.deinocheirusMarker = this.movesManager.moveOnCurve(
      this,
      this.el.object3D,
      this.curve,
      this.deinocheirusMarker,
      this.deinocheirusSpeed,
      { useDeltaTime: true }
    );

    // if (this.object.position.y < 0) {
    //   this.object.position.y += 0.1;
    // }

    if (this.movesManager.truncMarker(this.deinocheirusMarker) > 310) {
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
      this.phase = 'walkAgain';
    }, 12000);
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
      { useDeltaTime: true, needUpdateTime: true }
    );

    if (this.movesManager.truncMarker(this.deinocheirusMarker) > 990) {
      this.phase = 'exit';
    }
  },
  tick: function () {
    // Animation steps
    switch (this.phase) {
      case 'enter':
        this.enter();
        // Something else with another function if needed in each step
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
