AFRAME.registerComponent('trex-animation', {
  schema: {},
  init: function () {
    this.tick = AFRAME.utils.throttleTick(this.tick, 25, this);
    // Objects shortcut
    this.object = this.el.object3D;
    this.system = document.querySelector('a-scene').systems['system'];
    this.movesManager =
      document.querySelector('a-scene').systems['movesManager'];
    this.phase = '';
    this.animationChange = 'roar';
    // Trex run Path
    this.trexMarker = 0; // Position on the curve
    this.trexSpeed = 0.0015; // Speed on the curve
    this.curve = new THREE.SplineCurve([
      new THREE.Vector2(-2.011, 35.434),
      new THREE.Vector2(-24.995, 24.185),
      new THREE.Vector2(-31.018, 15.563),
      new THREE.Vector2(-34.615, 3.228),
      new THREE.Vector2(-27.402, -9.057),
      new THREE.Vector2(-16.326, -28.1),
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
        this.trexLeavesAudio = this.el.components['sound__trexleaves'];
        this.trexHittingAudio = this.el.components['sound__trexhitting'];
        this.trexEndSnoringAudio = this.el.components['sound__trexendsnoring'];

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
      this.trexSpeed
    );

    if (this.movesManager.truncMarker(this.trexMarker) > 400) {
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
        this.trexSpeed -= 0.00005;
      }
    }

    if (this.trexSpeed < 0.0001) {
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
    if (this.trexSpeed < 0.0015) {
      this.trexSpeed += 0.00005;
    }

    this.trexMarker = this.movesManager.moveOnCurve(
      this.el.object3D,
      this.curve,
      this.trexMarker,
      this.trexSpeed
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

    if (this.movesManager.truncMarker(this.trexMarker) > 980) {
      this.trexLeavesAudio.playSound();
      setTimeout(() => {
        this.trexFootStepAudio.stopSound();
      }, 500);
      setTimeout(() => {
        this.trexHittingAudio.playSound();
      }, 5000);
      this.phase = 'exit';
      setTimeout(() => {
        this.el.setAttribute('position', '-21.695 2 -16');
        this.el.setAttribute('rotation', '0 4.900 0.000');
        this.el.setAttribute('scale', '0.023 0.023 0.023');
        this.el.setAttribute('animation-mixer', {
          clip: 'T_Rex_Drink_2',
          loop: true,
          crossFadeDuration: 0.4,
          timeScale: 0.3,
          startFrame: 0,
        });
        this.trexSpeed = 0.05;
        setTimeout(() => {
          this.trexEndSnoringAudio.playSound();
        }, 3000);
        this.phase = 'walkClose';
      }, 15000);
    }
  },
  walkClose: function () {
    this.object.position.z += this.trexSpeed;

    if (this.object.position.z > -5) {
      this.trexSpeed -= 0.005;
    }
    if (this.trexSpeed <= 0) {
      this.phase = 'showHead';
    }
  },
  showHead: function () {
    setTimeout(() => {
      this.el.setAttribute('animation-mixer', {
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
    if (this.trexSpeed < 0.05) {
      this.trexSpeed += 0.005;
    }

    this.object.position.z -= this.trexSpeed;

    if (this.object.position.z < -16) {
      this.phase = 'exit';
    }
  },
  tick: function () {
    // Animation steps
    switch (this.phase) {
      case 'enter':
        this.enter();
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
