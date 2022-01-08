AFRAME.registerComponent('quetza-animation', {
  schema: {},
  init: function () {
    this.tick = AFRAME.utils.throttleTick(this.tick, 25, this);

    // Objects shortcut
    this.object = this.el.object3D;
    this.system = document.querySelector('a-scene').systems['game'];
    this.car = document.querySelector('#aviary-car');
    this.mainScene = document.getElementById('main-scene');
    this.phase = '';
    this.stopRoar = false;

    // Car shaking
    this.isShaking = false;
    this.carWaves = 0;
    this.carRotationValue = 0.2;
    this.wavesNumber = 3;
    this.shakingLimits = 0.3;
    this.carRotation = this.carRotationValue;
    this.shaked = false;

    // Quetza run Path
    this.quetzaMarker = 0; // Position on the curve
    this.quetzaWalkSpeed = 0.003; // Speed on the curve
    this.quetzaFlySpeed = 0.0075; // Speed on the curve
    this.fog = 0.065;
    this.walkCurve = new THREE.SplineCurve([
      new THREE.Vector2(-8, -28),
      new THREE.Vector2(5, -12),
    ]);
    this.flyCurve = new THREE.SplineCurve([
      new THREE.Vector2(40, -60), // y,z and x to 13.622
      new THREE.Vector2(33, -5),
      new THREE.Vector2(85, -2.59),
    ]);

    // Sound
    this.quetzaAmbiant1Audio;
    this.quetzaAmbiant2Audio;
    this.quetzaPassingAudio;
    this.quetzaLeaveAudio;
    this.quetzaRoar1Audio;
    this.quetzaRoar2Audio;

    // Start tour listener
    this.el.addEventListener(
      'enterWalk',
      () => {
        this.quetzaAmbiant1Audio = this.el.components['sound__ambiant1'];
        this.quetzaAmbiant2Audio = this.el.components['sound__ambiant2'];
        this.quetzaWalkingAudio = this.el.components['sound__walking'];
        this.quetzaPassingAudio = this.el.components['sound__passing'];
        this.quetzaLeaveAudio = this.el.components['sound__leave'];
        this.quetzaRoar1Audio = this.el.components['sound__roar1'];
        this.quetzaRoar2Audio = this.el.components['sound__roar2'];

        this.el.setAttribute('animation-mixer', 'clip: Walk');

        this.quetzaAmbiant1Audio.playSound();
        setTimeout(() => {
          this.quetzaWalkingAudio.playSound();
          this.phase = 'enterWalk';
        }, 15000);
      },
      false
    );
    this.el.addEventListener(
      'enterFly',
      () => {
        this.el.setAttribute('animation-mixer', 'clip: Fly');

        setTimeout(() => {
          this.quetzaAmbiant2Audio.playSound();
        }, 8000);

        setTimeout(() => {
          this.quetzaPassingAudio.playSound();
          this.phase = 'enterFly';
        }, 18000);
      },
      false
    );
  },
  // --- Phase functions ---
  enterWalk: function () {
    if (this.system.truncMarker(this.quetzaMarker) > 900) {
      this.el.setAttribute('animation-mixer', {
        clip: 'Roar',
        timeScale: 0.5,
      });
      this.quetzaRoar1Audio.playSound();
      this.phase = 'roar';
    }
    this.quetzaMarker = this.system.moveOnCurve(
      this.object,
      this.walkCurve,
      this.quetzaMarker,
      this.quetzaWalkSpeed
    );
    this.system.updateRotation(
      this.el,
      this.object,
      this.walkCurve,
      this.quetzaMarker,
      this.quetzaWalkSpeed
    );
  },
  roar: function () {
    this.quetzaMarker = 0;
    this.phase = 'exit';
    setTimeout(() => {
      this.el.setAttribute('animation-mixer', 'clip: Idle');
      this.phase = 'moreFog';
    }, 3000);

    if (this.stopRoar) {
      this.phase = 'moreFog';
      return;
    }
    // SecondRoar
    setTimeout(() => {
      this.quetzaRoar2Audio.playSound();
      this.el.setAttribute('animation-mixer', {
        clip: 'Roar',
        timeScale: 1,
      });
      this.phase = 'roar';
      this.stopRoar = true;
    }, 10000);
  },
  moreFog: function () {
    this.fog += 0.00012;
    if (this.fog > 0.14) {
      this.quetzaLeaveAudio.playSound();
      this.el.setAttribute('position', { x: 8, y: 31.025, z: -60 });
      this.phase = 'lessFog';
    }
    this.mainScene.setAttribute('fog', {
      type: 'exponential',
      color: '#5e5e5e',
      density: this.fog,
    });
  },
  lessFog: function () {
    this.fog -= 0.00012;
    if (this.fog < 0.07) {
      setTimeout(() => {}, 15000);
      const event = new Event('restartQuetzaWalk');
      this.car.dispatchEvent(event);
      this.phase = 'exit';
    }
    this.mainScene.setAttribute('fog', {
      type: 'exponential',
      color: '#5e5e5e',
      density: this.fog,
    });
  },
  enterFly: function () {
    if (this.system.truncMarker(this.quetzaMarker) > 900) {
      const event = new Event('restartQuetzaFly');
      this.car.dispatchEvent(event);
      this.phase = 'exit';
    }

    if (
      this.system.truncMarker(this.quetzaMarker) > 500 &&
      this.system.truncMarker(this.quetzaMarker) < 510
    ) {
      this.isShaking = true;
    }

    this.quetzaMarker = this.system.moveOnCurve(
      this.object,
      this.flyCurve,
      this.quetzaMarker,
      this.quetzaFlySpeed,
      'yz'
    );
    this.system.updateRotation(
      this.el,
      this.object,
      this.flyCurve,
      this.quetzaMarker,
      this.quetzaFlySpeed,
      0,
      'yz'
    );
  },
  shaking: function () {
    const rotation = this.car.getAttribute('rotation');
    if (rotation.x < -this.shakingLimits || rotation.x > this.shakingLimits) {
      this.carRotation = -this.carRotation;
      this.carWaves++;
    }
    if (this.carWaves === this.wavesNumber) {
      rotation.x = 0;
      rotation.z = 0;
      this.car.setAttribute('rotation', rotation);
      // reset params
      this.carRotation = this.carRotationValue;
      this.carWaves = 0;
      this.isShaking = false;
      return;
    }
    rotation.x += this.carRotation;
    this.car.setAttribute('rotation', rotation);
  },
  tick: function () {
    if (this.isShaking) {
      this.shaking();
    }
    // Animation steps
    switch (this.phase) {
      case 'enterWalk':
        this.enterWalk();
        break;
      case 'roar':
        this.roar();
        break;
      case 'moreFog':
        this.moreFog();
        break;
      case 'lessFog':
        this.lessFog();
        break;
      case 'enterFly':
        this.enterFly();
        break;
    }
  },
});
