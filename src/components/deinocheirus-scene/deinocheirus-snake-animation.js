AFRAME.registerComponent('deinocheirus-snake-animation', {
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
    this.deinocheirusCar = document.getElementById('deinocheirus-car');
    // Snake run Path
    this.snakeMarker = 0; // Position on the curve
    this.snakeSpeed = 0.018;
    this.curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-18.096, -0.16, -2.647),
      new THREE.Vector3(-31.492, -0.16, 10.162),
      new THREE.Vector3(-6.232, -0.16, 13.607),
    ]);

    // Start tour listener
    this.el.addEventListener(
      'enterWalk',
      () => {
        // Load sounds
        this.snakeEnterSound = this.el.components['sound__enter'];
        this.snakeEnterSound.playSound();
        // Launch animation
        setTimeout(() => {
          this.phase = 'enterWalk';
          this.el.setAttribute('animation-mixer', {
            clip: 'Snake Armature|Walk',
            loop: true,
            crossFadeDuration: 0.4,
            timeScale: 1.2,
          });
        }, 1000);
      },
      false
    );

    this.el.addEventListener(
      'walkAgain',
      () => {
        // Launch animation
        this.snakeSpeed = 0.018;
        this.lastUpdateTime = performance.now();
        this.phase = 'walkAgain';
        this.el.setAttribute('animation-mixer', {
          clip: 'Snake Armature|Walk',
          loop: true,
          crossFadeDuration: 0.4,
          timeScale: 1.2,
        });
      },
      false
    );
  },
  enterWalk: function () {
    this.snakeMarker = this.movesManager.moveOnCurve(
      this,
      this.el.object3D,
      this.curve,
      this.snakeMarker,
      this.snakeSpeed,
      { useDeltaTime: true }
    );

    if (this.movesManager.truncMarker(this.snakeMarker) > 450) {
      const event = new Event('snakePause');
      this.deinocheirusCar.dispatchEvent(event);
      this.snakeSpeed = 0;
      this.phase = 'exit';
    }
  },
  walkAgain: function () {
    this.snakeMarker = this.movesManager.moveOnCurve(
      this,
      this.el.object3D,
      this.curve,
      this.snakeMarker,
      this.snakeSpeed,
      { useDeltaTime: true }
    );

    if (this.movesManager.truncMarker(this.snakeMarker) > 900) {
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
      case 'walkAgain':
        this.walkAgain();
        break;
    }
  },
});
