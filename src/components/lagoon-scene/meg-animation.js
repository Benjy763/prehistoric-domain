AFRAME.registerComponent('meg-animation', {
  schema: {},
  init: function () {
    this.tick = AFRAME.utils.throttleTick(this.tick, 25, this);

    // Objects shortcut
    this.object = this.el.object3D;
    this.system = document.querySelector('a-scene').systems['game'];
    this.car = document.querySelector('#lagoon-car');
    this.mainScene = document.getElementById('main-scene');
    this.shark = document.querySelector('#shark');
    this.sharkObject = this.shark.object3D;
    this.phase = '';
    this.bitten = false;
    this.isMegPassed = false;

    // Meg run Path
    this.megMarker = 0; // Position on the curve
    this.megSpeed = 0.001; // Speed on the curve
    this.sharkMarker = 0; // Position on the curve
    this.sharkSpeed = 0.0005; // Speed on the curve
    this.sharkCurve1 = new THREE.SplineCurve([
      new THREE.Vector2(-10.942, -50),
      new THREE.Vector2(-10.932, 50),
    ]);
    this.sharkCurve2 = new THREE.SplineCurve([
      new THREE.Vector2(23.166, 18),
      new THREE.Vector2(-10.063, -1.822),
      new THREE.Vector2(-34.327, -6.174),
    ]);
    this.megCurve1 = new THREE.SplineCurve([
      new THREE.Vector2(11, -80),
      new THREE.Vector2(11, 50),
    ]);
    this.megCurve2 = new THREE.SplineCurve([
      new THREE.Vector2(-10.932, 50),
      new THREE.Vector2(-9.5, -20),
      new THREE.Vector2(0, -70),
    ]);
    this.megCurve3 = new THREE.SplineCurve([
      new THREE.Vector2(11.284, -50.129),
      new THREE.Vector2(17, -6.252),
      new THREE.Vector2(70, 10.654),
    ]);

    // Sound
    this.megPassingAudio;
    this.megBiteAudio;

    // Start tour listener
    this.el.addEventListener(
      'enter',
      () => {
        // Set default meg position
        const megPosition = this.el.getAttribute('position');
        megPosition.y = -8;
        this.el.setAttribute('position', megPosition);

        this.megPassingAudio = this.el.components['sound__passing'];
        this.megBiteAudio = this.el.components['sound__bite'];

        this.phase = 'enter';
      },
      false
    );
  },
  // --- Phase functions ---
  enterShark: function () {
    if (this.system.truncMarker(this.sharkMarker) > 900) {
      this.megMarker = 0;
      this.sharkMarker = 0;
      // Reset default meg position and rotation
      this.megSpeed = 0.3;
      this.el.setAttribute('position', {
        x: -9.966,
        y: -5.533,
        z: -4.989,
      });
      this.el.setAttribute('rotation', {
        x: -90.0,
        y: 180.0,
        z: 0,
      });
      const event = new Event('hit');
      this.car.dispatchEvent(event);
      this.phase = 'return';
    }

    this.sharkMarker = this.system.moveOnCurve(
      this.sharkObject,
      this.sharkCurve1,
      this.sharkMarker,
      this.sharkSpeed
    );
    this.system.updateRotation(
      this.shark,
      this.sharkObject,
      this.sharkCurve1,
      this.sharkMarker,
      this.sharkSpeed,
      90
    );
  },
  enterMeg: function () {
    if (this.system.truncMarker(this.megMarker) > 430 && !this.isMegPassed) {
      this.megPassingAudio.playSound();
      this.isMegPassed = true;
      return;
    }
    if (this.system.truncMarker(this.megMarker) > 900) {
      return;
    }
    this.megMarker = this.system.moveOnCurve(
      this.object,
      this.megCurve1,
      this.megMarker,
      this.megSpeed
    );
    this.system.updateRotation(
      this.el,
      this.object,
      this.megCurve1,
      this.megMarker,
      this.megSpeed
    );
  },
  sharkReturn: function () {
    if (this.system.truncMarker(this.sharkMarker) > 580) {
      this.sharkSpeed = 0.3;
      const sharkPosition = this.shark.getAttribute('position');
      sharkPosition.y += this.sharkSpeed;
      this.shark.setAttribute('position', sharkPosition);
    } else {
      this.sharkMarker = this.system.moveOnCurve(
        this.sharkObject,
        this.sharkCurve2,
        this.sharkMarker,
        this.sharkSpeed
      );
      this.system.updateRotation(
        this.shark,
        this.sharkObject,
        this.sharkCurve2,
        this.sharkMarker,
        this.sharkSpeed,
        90
      );
    }
  },
  megSwim: function () {
    if (this.system.truncMarker(this.sharkMarker) < 570) {
      return;
    }
    if (!this.bitten) {
      // TearOffBite_InPlace
      this.el.setAttribute('animation-mixer', {
        clip: 'SwimBite_InPlace',
        timeScale: 0.2,
      });
      setTimeout(() => {
        this.el.setAttribute('animation-mixer', {
          clip: 'Swim_InPlace',
          timeScale: 0.7,
        });
      }, 3000);
      this.megBiteAudio.playSound();
      this.bitten = true;
    }
    const megPosition = this.el.getAttribute('position');
    if (megPosition.y > 40) {
      // Reset default meg position
      this.el.setAttribute('position', {
        x: 11,
        y: 1.6821,
        z: -80,
      });
      this.megMarker = 0;
      this.megSpeed = 0.001;
      this.isMegPassed = false;
      setTimeout(() => {
        this.phase = 'turnAround';
      }, 10000);
      this.phase = 'exit';
    }
    megPosition.y += this.megSpeed;
    this.el.setAttribute('position', megPosition);
  },
  turnAround: function () {
    if (this.system.truncMarker(this.megMarker) > 250 && !this.isMegPassed) {
      this.megPassingAudio.playSound();
      this.isMegPassed = true;
      return;
    }
    if (this.system.truncMarker(this.megMarker) > 900) {
      const event = new Event('restart');
      this.car.dispatchEvent(event);
      this.phase = 'exit';
    }

    this.megMarker = this.system.moveOnCurve(
      this.object,
      this.megCurve3,
      this.megMarker,
      this.megSpeed
    );
    this.system.updateRotation(
      this.el,
      this.object,
      this.megCurve3,
      this.megMarker,
      this.megSpeed
    );
  },
  tick: function () {
    // Animation steps
    switch (this.phase) {
      case 'enter':
        this.enterMeg();
        this.enterShark();
        break;
      case 'return':
        this.sharkReturn();
        this.megSwim();
        break;
      case 'bite':
        this.bite();
        break;
      case 'turnAround':
        this.turnAround();
        break;
    }
  },
});
