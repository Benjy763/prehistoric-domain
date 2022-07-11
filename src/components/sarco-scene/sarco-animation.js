AFRAME.registerComponent('sarco-animation', {
  schema: {},
  init: function () {
    this.tick = AFRAME.utils.throttleTick(this.tick, 25, this);

    // Objects shortcut
    this.object = this.el.object3D;
    this.system = document.querySelector('a-scene').systems['system'];
    this.movesManager =
      document.querySelector('a-scene').systems['movesManager'];
    this.car = document.querySelector('#sarco-car');
    this.mainScene = document.getElementById('main-scene');
    this.sarcoCar = document.querySelector('#sarco-car');
    this.phase = '';
    this.bird = document.querySelector('#sarco-bird');

    // Spino run Path
    this.sarcoMarker = 0; // Position on the curve
    this.sarcoWalkSpeed = 0.0015; // Speed on the curve
    this.sarcoSwimSpeed = 0.0015; // Speed on the curve
    this.walkCurve1 = new THREE.SplineCurve([
      new THREE.Vector2(-18.969, 0.161),
      new THREE.Vector2(-18.969, 32.365),
    ]);
    this.swimCurve1 = new THREE.SplineCurve([
      new THREE.Vector2(-15.127, -32),
      new THREE.Vector2(-15.127, 42),
    ]);

    // Bird Path
    this.birdMarker = 0; // Position on the curve
    this.birdSpeed = 0.05; // Speed on the curve
    this.birdCurve = new THREE.SplineCurve([
      new THREE.Vector2(-18.96, 14.287),
      new THREE.Vector2(-18.96, 4),
    ]);
    this.birdCurve2 = new THREE.SplineCurve([
      new THREE.Vector2(-18.96, 6.057),
      new THREE.Vector2(-33.901, -8.755),
    ]);

    // Sound

    // Start tour listener
    this.el.addEventListener(
      'enter',
      () => {
        this.phase = 'openJaws';
      },
      false
    );
    this.el.addEventListener(
      'sarcoUnderwater',
      () => {
        this.el.setAttribute('animation-mixer', {
          clip: 'Sarcosuchus_Swim_InPlace',
          loop: true,
          crossFadeDuration: 0.4,
          timeScale: 1,
        });
        this.object.position.z = -30;
        this.object.position.y = -11.934;
        setTimeout(() => {
          this.sarcoMarker = 0;
          this.phase = 'sarcoSwim';
        }, 8000);
      },
      false
    );
  },
  // --- Phase functions ---
  openJaws: function () {
    setTimeout(() => {
      this.el.setAttribute('animation-mixer', {
        clip: 'Sarcosuchus_Sneak_Idle_OpenJaws',
        loop: true,
        crossFadeDuration: 1.5,
        timeScale: 0.8,
      });
    }, 0);
    setTimeout(() => {
      this.bird.setAttribute('animation-mixer', {
        clip: 'Take 002',
        loop: true,
        crossFadeDuration: 0.4,
        timeScale: 1,
      });
      this.phase = 'birdFly';
    }, 6000);
    this.phase = 'exit';
  },
  birdFly: function () {
    this.birdMarker = this.movesManager.moveOnCurve(
      this.bird.object3D,
      this.birdCurve,
      this.birdMarker,
      this.birdSpeed
    );
    if (this.movesManager.truncMarker(this.birdMarker) > 750) {
      this.bird.setAttribute('animation-mixer', {
        clip: 'Take 001',
        pingPong: true,
        crossFadeDuration: 0.4,
        timeScale: 0.7,
      });
      setTimeout(() => {
        this.birdSpeed = 0.01;
        this.birdMarker = 0;
        this.bird.setAttribute('animation-mixer', {
          startFrame: 0,
          clip: 'Take 002',
          loop: true,
          crossFadeDuration: 0,
          timeScale: 1,
        });
        this.phase = 'birdLeave';
      }, 8000);
      this.phase = 'exit';
    }
  },
  birdLeave: function () {
    this.birdMarker = this.movesManager.moveOnCurve(
      this.bird.object3D,
      this.birdCurve2,
      this.birdMarker,
      this.birdSpeed
    );
    if (this.movesManager.truncMarker(this.birdMarker) > 800) {
      setTimeout(() => {
        this.phase = 'sarcoUp';
      }, 8000);
      this.phase = 'exit';
    }
  },
  sarcoUp: function () {
    this.el.setAttribute('animation-mixer', {
      clip: 'Sarcosuchus_Sneak_StandUp',
      loop: true,
      crossFadeDuration: 0.4,
      timeScale: 0.3,
    });
    setTimeout(() => {
      this.el.setAttribute('animation-mixer', {
        clip: 'Sarcosuchus_Idle',
        loop: true,
        crossFadeDuration: 0.4,
        timeScale: 0.7,
      });
    }, 2500);
    setTimeout(() => {
      this.phase = 'sarcoRoar';
    }, 4000);
    this.phase = 'exit';
  },
  sarcoRoar: function () {
    this.el.setAttribute('animation-mixer', {
      clip: 'Sarcosuchus_Roar',
      loop: true,
      crossFadeDuration: 0.4,
      timeScale: 1,
    });
    setTimeout(() => {
      this.el.setAttribute('animation-mixer', {
        clip: 'Sarcosuchus_Walk_InPlace',
        loop: true,
        crossFadeDuration: 0.4,
        timeScale: 0.6,
      });
      setTimeout(() => {
        this.phase = 'sarcoLeave';
      }, 400);
    }, 3000);
    this.phase = 'exit';
  },
  sarcoLeave: function () {
    this.sarcoMarker = this.movesManager.moveOnCurve(
      this.object,
      this.walkCurve1,
      this.sarcoMarker,
      this.sarcoWalkSpeed
    );
    if (this.movesManager.truncMarker(this.sarcoMarker) > 900) {
      const event = new Event('dive');
      this.car.dispatchEvent(event);
      this.phase = 'exit';
    }
  },
  sarcoSwim: function () {
    this.sarcoMarker = this.movesManager.moveOnCurve(
      this.object,
      this.swimCurve1,
      this.sarcoMarker,
      this.sarcoSwimSpeed
    );
    if (this.movesManager.truncMarker(this.sarcoMarker) > 350) {
      this.sarcoSwimSpeed -= 0.00002;
    }
    if (this.sarcoSwimSpeed <= 0.0002) {
      this.el.setAttribute('animation-mixer', {
        clip: 'Sarcosuchus_Swim_Idle',
        loop: true,
        crossFadeDuration: 1.5,
        timeScale: 1,
      });
      this.phase = 'sarcoLook';
    }
    if (this.movesManager.truncMarker(this.sarcoMarker) > 900) {
      this.phase = 'exit';
    }
  },
  sarcoLook() {
    setTimeout(() => {
      this.el.setAttribute('animation-mixer', {
        clip: 'Sarcosuchus_SwimFast_InPlace',
        loop: true,
        crossFadeDuration: 0.4,
        timeScale: 1,
      });
      this.phase = 'sarcoSwimFast';
    }, 8000);
    this.phase = 'sarcoStay';
  },
  sarcoStay: function () {
    this.sarcoMarker = this.movesManager.moveOnCurve(
      this.object,
      this.swimCurve1,
      this.sarcoMarker,
      this.sarcoSwimSpeed
    );
  },
  sarcoSwimFast: function () {
    this.sarcoMarker = this.movesManager.moveOnCurve(
      this.object,
      this.swimCurve1,
      this.sarcoMarker,
      this.sarcoSwimSpeed
    );
    if (this.sarcoSwimSpeed <= 0.0015) {
      this.sarcoSwimSpeed += 0.0002;
    }
    if (this.movesManager.truncMarker(this.sarcoMarker) > 900) {
      this.phase = 'exit';
    }
  },
  tick: function () {
    // Animation steps
    switch (this.phase) {
      case 'openJaws':
        this.openJaws();
        break;
      case 'birdFly':
        this.birdFly();
        break;
      case 'birdLeave':
        this.birdLeave();
        break;
      case 'sarcoUp':
        this.sarcoUp();
        break;
      case 'sarcoRoar':
        this.sarcoRoar();
        break;
      case 'sarcoLeave':
        this.sarcoLeave();
        break;
      case 'sarcoSwim':
        this.sarcoSwim();
        break;
      case 'sarcoSwimFast':
        this.sarcoSwimFast();
        break;
      case 'sarcoStay':
        this.sarcoStay();
        break;
      case 'sarcoLook':
        this.sarcoLook();
        break;
    }
  },
});
