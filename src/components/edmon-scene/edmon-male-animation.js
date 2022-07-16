AFRAME.registerComponent('edmon-male-animation', {
  schema: {},
  init: function () {
    this.tick = AFRAME.utils.throttleTick(this.tick, 25, this);

    // Objects shortcut
    this.object = this.el.object3D;
    this.system = document.querySelector('a-scene').systems['system'];
    this.movesManager =
      document.querySelector('a-scene').systems['movesManager'];
    this.car = document.querySelector('#edmon-car');
    this.mainScene = document.getElementById('main-scene');
    this.edmonFemale = document.querySelector('#edmon-female');
    this.phase = '';

    // Edmon run Path
    this.edmonMarker = 0; // Position on the curve
    this.edmonSpeed = 0.0015; // Speed on the curve
    this.walkCurve1 = new THREE.SplineCurve([
      new THREE.Vector2(-6.156, 24.277),
      new THREE.Vector2(-18.487, 20.465),
      new THREE.Vector2(-25.143, 16.964),
      new THREE.Vector2(-32.632, 5.541),
    ]);

    this.walkCurve2 = new THREE.SplineCurve([
      new THREE.Vector2(-30.883, 8.422),
      new THREE.Vector2(-26.145, 15.743),
    ]);

    // Sound

    // Start tour listener
    this.el.addEventListener(
      'enterWalk',
      () => {
        this.el.setAttribute('animation-mixer', {
          clip: 'E_Trot',
          loop: true,
          crossFadeDuration: 0.4,
          timeScale: 0.6,
        });
        this.phase = 'enterWalk';
      },
      false
    );
  },
  // --- Phase functions ---
  enterWalk: function () {
    this.edmonMarker = this.movesManager.moveOnCurve(
      this.el.object3D,
      this.walkCurve1,
      this.edmonMarker,
      this.edmonSpeed
    );

    if (this.movesManager.truncMarker(this.edmonMarker) > 700) {
      this.edmonFemale.setAttribute('animation-mixer', {
        clip: 'E_Idle',
        loop: true,
        crossFadeDuration: 1.5,
        timeScale: 1,
      });
    }

    if (this.movesManager.truncMarker(this.edmonMarker) > 900) {
      this.el.setAttribute('animation-mixer', {
        clip: 'E_Idle',
        loop: true,
        crossFadeDuration: 1,
        timeScale: 0.7,
      });
      setTimeout(() => {
        this.phase = 'touch';
      }, 1300);
      this.phase = 'exit';
    }
  },
  touch: function () {
    this.el.setAttribute('animation-mixer', {
      clip: 'Aim_Right',
      loop: true,
      crossFadeDuration: 3,
      timeScale: 0.5,
    });
    this.edmonFemale.setAttribute('animation-mixer', {
      clip: 'E_Hurt',
      loop: true,
      crossFadeDuration: 3,
      timeScale: 0.3,
    });
    setTimeout(() => {
      this.el.setAttribute('animation-mixer', {
        clip: 'E_Idle',
        loop: true,
        crossFadeDuration: 2,
        timeScale: 1,
      });
    }, 3000);
    setTimeout(() => {
      this.edmonFemale.setAttribute('animation-mixer', {
        clip: 'E_Idle',
        loop: true,
        crossFadeDuration: 2,
        timeScale: 1,
      });
    }, 5000);
    setTimeout(() => {
      this.phase = 'roarAndLeave';
    }, 7000);
    this.phase = 'exit';
  },
  roarAndLeave: function () {
    this.el.setAttribute('animation-mixer', {
      clip: 'E_Call',
      loop: true,
      crossFadeDuration: 0.4,
      timeScale: 0.9,
    });
    this.edmonFemale.setAttribute('animation-mixer', {
      clip: 'E_Action2_Yawn',
      loop: true,
      crossFadeDuration: 0.4,
      timeScale: 0.7,
    });
    setTimeout(() => {
      this.edmonFemale.setAttribute('animation-mixer', {
        clip: 'E_Action4_Groom',
        loop: true,
        crossFadeDuration: 0.4,
        timeScale: 0.6,
      });
    }, 5000);
    setTimeout(() => {
      this.el.setAttribute('animation-mixer', {
        clip: 'E_Trot_Back',
        loop: true,
        crossFadeDuration: 1.5,
        timeScale: 0.6,
      });
      this.edmonMarker = 0;
      this.edmonSpeed = 0.003;
      this.phase = 'walkBack';
    }, 7000);
    setTimeout(() => {
      this.edmonFemale.setAttribute('animation-mixer', {
        clip: 'E_RestStart',
        loop: true,
        crossFadeDuration: 1.5,
        timeScale: 0.7,
      });
    }, 8000);
    setTimeout(() => {
      this.edmonFemale.setAttribute('animation-mixer', {
        clip: 'E_Sleep_Start',
        loop: true,
        crossFadeDuration: 1.5,
        timeScale: 0.7,
      });
    }, 9000);
    setTimeout(() => {
      this.edmonFemale.setAttribute('animation-mixer', {
        clip: 'E_Sleep_End',
        loop: true,
        startFrame: 10,
        timeScale: 0,
      });
    }, 9800);
    this.phase = 'exit';
  },
  walkBack: function () {
    this.edmonMarker = this.movesManager.moveOnCurve(
      this.el.object3D,
      this.walkCurve2,
      this.edmonMarker,
      this.edmonSpeed,
      'xz',
      false
    );

    if (this.movesManager.truncMarker(this.edmonMarker) > 750) {
      this.el.setAttribute('animation-mixer', {
        clip: 'E_RestStart',
        loop: true,
        crossFadeDuration: 1.5,
        timeScale: 0.7,
      });
      setTimeout(() => {
        this.el.setAttribute('animation-mixer', {
          clip: 'E_RestEnd',
          loop: true,
          startFrame: 10,
          crossFadeDuration: 0.4,
          timeScale: 0,
        });
      }, 2500);
      this.phase = 'exit';
    }
  },
  tick: function () {
    // Animation steps
    switch (this.phase) {
      case 'enterWalk':
        this.enterWalk();
        break;
      case 'touch':
        this.touch();
        break;
      case 'roarAndLeave':
        this.roarAndLeave();
        break;
      case 'walkBack':
        this.walkBack();
        break;
    }
  },
});
