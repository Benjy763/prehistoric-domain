AFRAME.registerComponent('spino-female-animation', {
  schema: {},
  init: function () {
    this.tick = AFRAME.utils.throttleTick(this.tick, 25, this);

    // Objects shortcut
    this.object = this.el.object3D;
    this.system = document.querySelector('a-scene').systems['system'];
    this.movesManager =
      document.querySelector('a-scene').systems['movesManager'];
    this.car = document.querySelector('#spino-car');
    this.mainScene = document.getElementById('main-scene');
    this.spinoMale = document.querySelector('#spino-male');
    this.phase = '';

    // Spino run Path
    this.spinoMarker = 0; // Position on the curve
    this.spinoWalkSpeed = 0.0008; // Speed on the curve
    this.fog = 0.065;
    this.walkCurve1 = new THREE.SplineCurve([
      new THREE.Vector2(-28.408, -40.973),
      new THREE.Vector2(-24.678, -10.058),
      new THREE.Vector2(-21.574, 0.238),
      new THREE.Vector2(-7.407, 28.496),
    ]);
    this.walkCurve2 = new THREE.SplineCurve([
      new THREE.Vector2(-23.791, -11.48),
      new THREE.Vector2(-23.791, -7),
      new THREE.Vector2(-20, 1),
      new THREE.Vector2(-4, 27),
    ]);

    // Sound

    // Start tour listener
    this.el.addEventListener(
      'enterWalk',
      () => {
        this.phase = 'enterWalk';
        this.el.setAttribute('animation-mixer', {
          clip: 'Spinosaurus_Walk_InPlace',
          loop: true,
          crossFadeDuration: 0.4,
          timeScale: 0.7,
        });
      },
      false
    );
    this.el.addEventListener(
      'roar',
      () => {
        this.phase = 'roar';
      },
      false
    );
  },
  // --- Phase functions ---
  enterWalk: function () {
    if (this.movesManager.truncMarker(this.spinoMarker) > 400) {
      this.el.setAttribute('animation-mixer', {
        clip: 'Spinosaurus_Idle_Break2',
        loop: true,
        crossFadeDuration: 0.4,
        timeScale: 1,
      });
      setTimeout(() => {
        this.el.setAttribute('animation-mixer', {
          clip: 'Spinosaurus_Fishing_Idle',
          loop: true,
          crossFadeDuration: 2,
          timeScale: 0.8,
        });
        this.phase = 'eat';
      }, 5000);
      this.phase = 'exit';
    }
    this.spinoMarker = this.movesManager.moveOnCurve(
      this.object,
      this.walkCurve1,
      this.spinoMarker,
      this.spinoWalkSpeed
    );
    this.movesManager.updateRotation(
      this.el,
      this.object,
      this.walkCurve1,
      this.spinoMarker,
      this.spinoWalkSpeed
    );
  },
  eat: function () {
    setTimeout(() => {
      // Trigger Spino animation
      const event = new Event('roar');
      this.spinoMale.dispatchEvent(event);
      this.el.setAttribute('animation-mixer', {
        clip: 'Spinosaurus_Fishing_Caught_Eat',
        loop: true,
        crossFadeDuration: 0.4,
        timeScale: 0.8,
      });
    }, 5000);
    setTimeout(() => {
      this.el.setAttribute('animation-mixer', {
        clip: 'Spinosaurus_Fishing_Idle',
        loop: true,
        crossFadeDuration: 2,
        timeScale: 0.8,
      });
    }, 10000);
    this.phase = 'exit';
  },
  roar: function () {
    setTimeout(() => {
      this.el.setAttribute('animation-mixer', {
        clip: 'Spinosaurus_Roar',
        loop: true,
        crossFadeDuration: 0.4,
        timeScale: 0.8,
      });
    }, 1000);
    setTimeout(() => {
      // Trigger Spino animation
      this.el.setAttribute('animation-mixer', {
        clip: 'Spinosaurus_Walk_InPlace',
        loop: true,
        crossFadeDuration: 0.4,
        timeScale: 0.7,
      });
      this.phase = 'leave';
    }, 5000);
    this.phase = 'exit';
  },
  leave: function () {
    if (this.movesManager.truncMarker(this.spinoMarker) > 950) {
      this.phase = 'exit';
    }
    this.spinoMarker = this.movesManager.moveOnCurve(
      this.object,
      this.walkCurve1,
      this.spinoMarker,
      this.spinoWalkSpeed
    );
    this.movesManager.updateRotation(
      this.el,
      this.object,
      this.walkCurve1,
      this.spinoMarker,
      this.spinoWalkSpeed
    );
  },
  tick: function () {
    // Animation steps
    switch (this.phase) {
      case 'enterWalk':
        this.enterWalk();
        break;
      case 'eat':
        this.eat();
        break;
      case 'roar':
        this.roar();
        break;
      case 'leave':
        this.leave();
        break;
    }
  },
});
