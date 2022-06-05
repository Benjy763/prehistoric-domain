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
    this.phase = '';

    // Spino run Path
    this.spinoMarker = 0; // Position on the curve
    this.spinoWalkSpeed = 0.0008; // Speed on the curve
    this.fog = 0.065;
    this.walkCurve1 = new THREE.SplineCurve([
      new THREE.Vector2(-37.867, -15),
      new THREE.Vector2(-37.867, 55),
    ]);
    this.walkCurve2 = new THREE.SplineCurve([
      new THREE.Vector2(-22.571, 55.687),
      new THREE.Vector2(-22.571, 18.887),
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
          clip: 'Spinosaurus_Fishing_Idle',
          loop: true,
          crossFadeDuration: 1.5,
          timeScale: 1,
        });
      }, 5000);
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
  tick: function () {
    // Animation steps
    switch (this.phase) {
      case 'enterWalk':
        this.enterWalk();
        break;
      case 'walk2':
        this.walk2();
        break;
    }
  },
});
