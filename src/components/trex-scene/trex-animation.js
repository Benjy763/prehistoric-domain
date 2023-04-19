AFRAME.registerComponent('trex-animation', {
  schema: {},
  init: function () {
    this.tick = AFRAME.utils.throttleTick(this.tick, 25, this);
    // Objects shortcut
    this.object = this.el.object3D;
    this.trexBis = document.querySelector('#trex-bis');
    this.objectBis = this.trexBis.object3D;
    this.system = document.querySelector('a-scene').systems['system'];
    this.movesManager =
      document.querySelector('a-scene').systems['movesManager'];
    this.phase = '';
    this.animationChange = 'roar';
    // Trex run Path
    this.trexMarker = 0; // Position on the curve
    this.trexSpeed = 0.036;
    this.trexChangingSpeed = 0.0012;
    this.trexMaxDeceleration = 0.0024;
    this.trexMaxAcceleration = 0.036;
    this.curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-2.011, 0, 35.434),
      new THREE.Vector3(-24.995, 0, 24.185),
      new THREE.Vector3(-31.018, 0, 15.563),
      new THREE.Vector3(-34.615, 0, 3.228),
      new THREE.Vector3(-27.402, 0, -9.057),
      new THREE.Vector3(-16.326, 0, -28.1),
    ]);

    // Start tour listener
    this.el.addEventListener(
      'enterWalk',
      () => {
        // Load sounds
        this.trexRoarAudio = this.el.components['sound__trexroar'];
        this.trexRoar2Audio = this.el.components['sound__trexroar2'];
        this.trexFootStepAudio = this.el.components['sound__trexfootstep'];
        this.trexDrinkAudio = this.el.components['sound__trexdrink'];
        this.trexLeavesAudio = this.trexBis.components['sound__trexleaves'];
        this.trexHittingAudio = this.trexBis.components['sound__trexhitting'];
        this.trexEndSnoringAudio =
          this.trexBis.components['sound__trexendsnoring'];

        // Launch animation
        setTimeout(() => {
          this.trexFootStepAudio.playSound();
          this.phase = 'enterWalk';
          setTimeout(() => {
            this.el.setAttribute('animation-mixer', {
              clip: 'T_Rex_Walk_InPlace',
              loop: true,
              crossFadeDuration: 0.4,
              timeScale: 0.7,
            });
          }, 500);
        }, 6000);
      },
      false
    );
  },
  enterWalk: function () {
    this.trexMarker = this.movesManager.moveOnCurve(
      this.el.object3D,
      this.curve,
      this.trexMarker,
      this.trexSpeed,
      true
    );

    if (this.movesManager.truncMarker(this.trexMarker) > 380) {
      if (this.trexSpeed > 0) {
        this.trexRoarAudio.playSound();
        setTimeout(() => {
          this.el.setAttribute('animation-mixer', {
            clip: 'T_Rex_Idle_Roar2',
            loop: true,
            crossFadeDuration: 1.5,
            timeScale: 0.7,
          });
        }, 0);
        this.trexSpeed -= this.trexChangingSpeed;
      }
    }

    if (this.trexSpeed < this.trexMaxDeceleration) {
      this.trexFootStepAudio.stopSound();
      setTimeout(() => {
        this.el.setAttribute('animation-mixer', {
          clip: 'T_Rex_Drink_2',
          loop: true,
          crossFadeDuration: 4,
          timeScale: 0.7,
        });
        this.trexDrinkAudio.playSound();
        this.phase = 'drink';
      }, 4500);
      this.phase = 'exit';
    }
  },
  drink: function () {
    setTimeout(() => {
      this.el.setAttribute('animation-mixer', {
        clip: 'T_Rex_Walk_Roar_InPlace',
        loop: true,
        crossFadeDuration: 0.8,
        timeScale: 0.7,
      });
      this.trexSpeed = 0;
      this.trexRoar2Audio.playSound();
      setTimeout(() => {
        this.trexFootStepAudio.playSound();
      }, 1800);
      this.phase = 'walkAgain';
    }, 9000);
    this.phase = 'exit';
  },
  walkAgain: function () {
    if (this.trexSpeed < this.trexMaxAcceleration) {
      this.trexSpeed += this.trexChangingSpeed;
    }

    this.trexMarker = this.movesManager.moveOnCurve(
      this.el.object3D,
      this.curve,
      this.trexMarker,
      this.trexSpeed,
      true
    );

    if (
      this.movesManager.truncMarker(this.trexMarker) > 480 &&
      this.animationChange === 'roar2'
    ) {
      this.el.setAttribute('animation-mixer', {
        clip: 'T_Rex_Walk_Roar_InPlace',
        loop: true,
        crossFadeDuration: 0.5,
        timeScale: 0.6,
      });
      this.animationChange = 'exit';
    }

    if (this.movesManager.truncMarker(this.trexMarker) > 990) {
      this.trexLeavesAudio.playSound();
      setTimeout(() => {
        this.trexFootStepAudio.stopSound();
      }, 500);
      setTimeout(() => {
        this.trexHittingAudio.playSound();
      }, 5000);
      this.el.setAttribute('visible', false);
      this.phase = 'exit';
      setTimeout(() => {
        this.trexBis.setAttribute('visible', true);
        this.trexBis.setAttribute('position', '-21.695 2 -16');
        this.trexBis.setAttribute('rotation', '0 4.900 0.000');
        this.trexBis.setAttribute('scale', '0.024 0.024 0.024');
        this.trexBis.setAttribute('animation-mixer', {
          clip: 'T_Rex_Drink_2',
          loop: true,
          crossFadeDuration: 0.4,
          timeScale: 0.3,
          startFrame: 0,
        });
        this.trexSpeed = 1;
        setTimeout(() => {
          this.trexEndSnoringAudio.playSound();
        }, 3000);
        this.phase = 'walkClose';
      }, 15000);
    }
  },
  walkClose: function () {
    this.objectBis.position.z += this.trexSpeed;

    if (this.objectBis.position.z > -5) {
      this.trexSpeed -= 0.1;
    }
    if (this.trexSpeed <= 0) {
      this.phase = 'showHead';
    }
  },
  showHead: function () {
    setTimeout(() => {
      this.trexBis.setAttribute('animation-mixer', {
        clip: 'T_Rex_Walk_Roar_InPlace',
        loop: true,
        crossFadeDuration: 4,
        timeScale: 1,
      });
      this.phase = 'walkFar';
    }, 10000);
    this.phase = 'exit';
  },
  walkFar: function () {
    if (this.trexSpeed < 1) {
      this.trexSpeed += 0.1;
    }

    this.objectBis.position.z -= this.trexSpeed;

    if (this.objectBis.position.z < -16) {
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
      case 'drink':
        this.drink();
        break;
      case 'walkAgain':
        this.walkAgain();
        break;
      case 'walkClose':
        this.walkClose();
        break;
      case 'showHead':
        this.showHead();
        break;
      case 'walkFar':
        this.walkFar();
        break;
    }
  },
});
