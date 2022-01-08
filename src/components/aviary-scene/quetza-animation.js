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

    // Quetza run Path
    this.quetzaMarker = 0; // Position on the curve
    this.quetzaWalkSpeed = 0.003; // Speed on the curve
    this.quetzaFlySpeed = 0.007; // Speed on the curve
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
    this.footStepAudio;
    this.footRoarAudio;

    // Start tour listener
    this.el.addEventListener(
      'enterWalk',
      () => {
        this.el.setAttribute('animation-mixer', 'clip: Walk');
        this.phase = 'enterWalk';
      },
      false
    );
    this.el.addEventListener(
      'enterFly',
      () => {
        this.el.setAttribute('animation-mixer', 'clip: Fly');
        this.phase = 'enterFly';
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
      this.el.setAttribute('animation-mixer', {
        clip: 'Roar',
        timeScale: 0.5,
      });
      this.phase = 'roar';
      this.stopRoar = true;
    }, 10000);
  },
  moreFog: function () {
    this.fog += 0.00012;
    if (this.fog > 0.14) {
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
  tick: function () {
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
