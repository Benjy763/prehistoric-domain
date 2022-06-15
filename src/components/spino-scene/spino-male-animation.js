AFRAME.registerComponent('spino-male-animation', {
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
    this.spinoFemale = document.querySelector('#spino-female');
    this.phase = '';

    // Spino run Path
    this.spinoMarker = 0; // Position on the curve
    this.spinoWalkSpeed = 0.0008; // Speed on the curve
    this.walkCurve1 = new THREE.SplineCurve([
      new THREE.Vector2(-37.867, -15),
      new THREE.Vector2(-37.867, 55),
    ]);
    this.walkCurve2 = new THREE.SplineCurve([
      new THREE.Vector2(-22.824, 55.687),
      new THREE.Vector2(-22.824, 18.887),
    ]);
    this.walkCurve3 = new THREE.SplineCurve([
      new THREE.Vector2(-22.824, 20.58),
      new THREE.Vector2(-23.747, -49.624),
    ]);

    // Enablers
    this.waterExitSpeed = 0.014;
    this.waterExitEnabed = false;

    // Sound

    // Start tour listener
    this.el.addEventListener(
      'enterWalk',
      () => {
        this.phase = 'enterWalk';
        this.el.setAttribute('animation-mixer', {
          clip: 'Spinosaurus_Idle',
          loop: true,
          crossFadeDuration: 0.4,
          timeScale: 0.1,
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
    if (this.movesManager.truncMarker(this.spinoMarker) > 950) {
      this.spinoMarker = 0;
      this.spinoWalkSpeed = 0.002;
      this.phase = 'walk2';
    }
    if (
      this.movesManager.truncMarker(this.spinoMarker) > 320 &&
      !this.waterExitEnabed
    ) {
      this.waterExitSpeed = 0.04;
      this.el.setAttribute('animation-mixer', {
        clip: 'Spinosaurus_Walk_InPlace',
        loop: true,
        crossFadeDuration: 0.4,
        timeScale: 0.7,
      });
      this.waterExitEnabed = true;
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
    if (this.object.position.y < -0.758) {
      this.object.position.y += this.waterExitSpeed;
    }
  },
  walk2: function () {
    if (this.movesManager.truncMarker(this.spinoMarker) > 950) {
      this.el.setAttribute('animation-mixer', {
        clip: 'Spinosaurus_Drink',
        loop: true,
        crossFadeDuration: 0.4,
        timeScale: 1,
      });
      setTimeout(() => {
        this.el.setAttribute('animation-mixer', {
          clip: 'Spinosaurus_LieDown_Start',
          loop: true,
          crossFadeDuration: 1.5,
          timeScale: 0.8,
        });
      }, 5000);
      setTimeout(() => {
        this.el.setAttribute('animation-mixer', {
          clip: 'Spinosaurus_LieDown_Idle',
          loop: true,
          crossFadeDuration: 0.4,
          timeScale: 1,
        });
      }, 7000);
      setTimeout(() => {
        // Trigger Spino animation
        const event = new Event('enterWalk');
        this.spinoFemale.dispatchEvent(event);
      }, 10000);
      this.phase = 'fish';
    }
    this.spinoMarker = this.movesManager.moveOnCurve(
      this.object,
      this.walkCurve2,
      this.spinoMarker,
      this.spinoWalkSpeed
    );
    this.movesManager.updateRotation(
      this.el,
      this.object,
      this.walkCurve2,
      this.spinoMarker,
      this.spinoWalkSpeed
    );
  },
  roar: function () {
    setTimeout(() => {
      this.el.setAttribute('animation-mixer', {
        clip: 'Spinosaurus_LieDown_Start',
        loop: true,
        crossFadeDuration: 0.4,
        timeScale: -0.8,
      });
    }, 5000);
    setTimeout(() => {
      // Trigger Spino animation
      const event = new Event('roar');
      this.spinoFemale.dispatchEvent(event);
      this.el.setAttribute('animation-mixer', {
        clip: 'Spinosaurus_Roar1',
        loop: true,
        crossFadeDuration: 0.4,
        timeScale: 0.7,
      });
    }, 7000);
    setTimeout(() => {
      this.el.setAttribute('animation-mixer', {
        clip: 'Spinosaurus_Idle',
        loop: true,
        crossFadeDuration: 0.4,
        timeScale: 0.8,
      });
    }, 11000);
    setTimeout(() => {
      this.phase = 'leave';
    }, 20000);
    this.phase = 'exit';
  },
  leave: function () {
    setTimeout(() => {
      this.el.setAttribute('animation-mixer', {
        clip: 'Spinosaurus_LieDown_Start',
        loop: true,
        crossFadeDuration: 0.4,
        timeScale: 0.8,
      });
    }, 2000);
    setTimeout(() => {
      this.el.setAttribute('animation-mixer', {
        clip: 'Spinosaurus_LieDown_Idle',
        loop: true,
        crossFadeDuration: 0.4,
        timeScale: 1,
      });
    }, 4000);
    this.phase = 'exit';
  },
  tick: function () {
    // Animation steps
    switch (this.phase) {
      case 'enterWalk':
        this.enterWalk();
        break;
      case 'walk2':
        this.walk2();
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
