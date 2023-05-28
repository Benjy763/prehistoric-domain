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
    this.edmonSpeed = 0.0025; // Speed on the curve
    this.walkCurve1 = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-6.156, -0.4, 24.277),
      new THREE.Vector3(-18.487, -0.4, 20.465),
      new THREE.Vector3(-25.143, -0.4, 16.964),
      new THREE.Vector3(-32.632, -0.4, 5.541),
    ]);

    this.walkCurve2 = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-29.127, 0, 11.319),
      new THREE.Vector3(-26.145, 0, 15.743),
    ]);

    // Sound

    // Start tour listener
    this.el.addEventListener(
      'enterWalk',
      () => {
        // Load sounds
        this.edmonRoar1Audio = this.edmonFemale.components['sound__roar1'];
        this.edmonRoar2Audio = this.edmonFemale.components['sound__roar2'];
        this.edmonWalkAudio = this.el.components['sound__walk'];
        this.edmonWalkBackAudio = this.el.components['sound__walkback'];
        this.edmonLidownAudio = this.el.components['sound__liedown'];
        this.edmonFemaleLidownAudio =
          this.edmonFemale.components['sound__liedown'];

        this.el.setAttribute('animation-mixer', {
          clip: 'E_Trot',
          loop: true,
          crossFadeDuration: 0.4,
          timeScale: 0.6,
        });
        setTimeout(() => {
          this.edmonWalkAudio.playSound();
        }, 1000);
        this.phase = 'enterWalk';
      },
      false
    );
  },
  // --- Phase functions ---
  enterWalk: function () {
    this.edmonMarker = this.movesManager.moveOnCurve(
      this,
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

    if (this.movesManager.truncMarker(this.edmonMarker) > 800) {
      this.el.setAttribute('animation-mixer', {
        clip: 'E_Idle',
        loop: true,
        crossFadeDuration: 1,
        timeScale: 0.7,
      });
      this.edmonWalkAudio.stopSound();
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
    setTimeout(() => {
      this.edmonRoar1Audio.playSound();
    }, 500);
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
      this.edmonRoar2Audio.playSound();
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
      this.edmonWalkBackAudio.playSound();
      this.phase = 'walkBack';
    }, 7000);
    setTimeout(() => {
      this.edmonFemaleLidownAudio.playSound();
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
      this,
      this.el.object3D,
      this.walkCurve2,
      this.edmonMarker,
      this.edmonSpeed,
      { turn180: true }
    );

    if (this.movesManager.truncMarker(this.edmonMarker) > 750) {
      this.edmonLidownAudio.playSound();
      this.edmonWalkBackAudio.stopSound();
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
