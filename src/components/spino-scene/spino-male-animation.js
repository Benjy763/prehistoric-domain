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
    this.spinoWalkSpeed = 0.02; // Speed on the curve
    this.walkCurve1 = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-37.867, -8.657, -30),
      new THREE.Vector3(-37.867, -8.657, 12),
      new THREE.Vector3(-37.867, -0.758, 20),
      new THREE.Vector3(-37.867, -0.758, 55)
    ]);
    this.walkCurve2 = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-22.824, -0.758, 55.687),
      new THREE.Vector3(-22.824, -0.758, 18.887)
    ]);

    // Enablers
    this.waterExitEnabed = false;

    // Sound

    // Start tour listener
    this.el.addEventListener(
      'enterWalk',
      () => {
        // Load sounds
        this.spinoSwimAudio = this.el.components['sound__swim'];
        this.spinoDrinklieAudio = this.el.components['sound__drinklie'];
        this.spinoHuntlieAudio = this.el.components['sound__huntlie'];
        this.spinoSnoringAudio = this.el.components['sound__snoring'];
        this.spinoRoarAudio = this.el.components['sound__spino1roar'];
        this.spinoWalkAudio = this.el.components['sound__walk'];
        this.spinoWateroutAudio = this.el.components['sound__waterout'];
        this.spinoWatermoveAudio = this.el.components['sound__watermove'];

        setTimeout(() => {
          this.spinoSwimAudio.playSound();
        }, 10000);
        setTimeout(() => {
          this.phase = 'enterWalk';
        }, 5000);
        this.el.setAttribute('animation-mixer', {
          clip: 'Spinosaurus_Idle',
          loop: true,
          crossFadeDuration: 0.4,
          timeScale: 0.1
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
    this.el.addEventListener(
      'fishHunt',
      () => {
        this.spinoHuntlieAudio = this.el.components['sound__huntlie'];
        this.phase = 'fishHunt';
      },
      false
    );
  },
  // --- Phase functions ---
  enterWalk: function () {
    if (this.movesManager.truncMarker(this.spinoMarker) > 950) {
      this.spinoMarker = 0;
      this.spinoWalkSpeed = 0.04;
      setTimeout(() => {
        this.spinoWalkAudio.playSound();
      }, 1000);
      this.phase = 'walk2';
    }
    if (
      this.movesManager.truncMarker(this.spinoMarker) > 480 &&
      !this.waterExitEnabed
    ) {
      this.spinoWateroutAudio.playSound();
      this.el.setAttribute('animation-mixer', {
        clip: 'Spinosaurus_Walk_InPlace',
        loop: true,
        crossFadeDuration: 0.4,
        timeScale: 0.7
      });
      this.waterExitEnabed = true;
    }
    this.spinoMarker = this.movesManager.moveOnCurve(
      this,
      this.object,
      this.walkCurve1,
      this.spinoMarker,
      this.spinoWalkSpeed,
      { useDeltaTime: true, needLookAt: false }
    );
  },
  walk2: function () {
    if (this.movesManager.truncMarker(this.spinoMarker) > 950) {
      this.spinoWatermoveAudio.playSound();
      setTimeout(() => {
        this.spinoWalkAudio.stopSound();
      }, 500);
      setTimeout(() => {
        this.spinoDrinklieAudio.playSound();
      }, 1000);
      this.el.setAttribute('animation-mixer', {
        clip: 'Spinosaurus_Drink',
        loop: true,
        crossFadeDuration: 0.4,
        timeScale: 1
      });
      setTimeout(() => {
        this.el.setAttribute('animation-mixer', {
          clip: 'Spinosaurus_LieDown_Start',
          loop: true,
          crossFadeDuration: 1.5,
          timeScale: 0.8
        });
      }, 5000);
      setTimeout(() => {
        this.el.setAttribute('animation-mixer', {
          clip: 'Spinosaurus_LieDown_Idle',
          loop: true,
          crossFadeDuration: 0.4,
          timeScale: 1
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
      this,
      this.object,
      this.walkCurve2,
      this.spinoMarker,
      this.spinoWalkSpeed,
      { useDeltaTime: true }
    );
  },
  roar: function () {
    setTimeout(() => {
      this.el.setAttribute('animation-mixer', {
        clip: 'Spinosaurus_LieDown_Start',
        loop: true,
        crossFadeDuration: 0.4,
        timeScale: -0.8
      });
    }, 5000);
    setTimeout(() => {
      this.spinoRoarAudio.playSound();
      // Trigger Spino animation
      const event = new Event('roar');
      this.spinoFemale.dispatchEvent(event);
      this.el.setAttribute('animation-mixer', {
        clip: 'Spinosaurus_Roar1',
        loop: true,
        crossFadeDuration: 0.4,
        timeScale: 0.7
      });
    }, 7000);
    setTimeout(() => {
      this.el.setAttribute('animation-mixer', {
        clip: 'Spinosaurus_Idle',
        loop: true,
        crossFadeDuration: 0.4,
        timeScale: 0.8
      });
    }, 11000);
    setTimeout(() => {
      this.spinoSnoringAudio.playSound();
      this.el.setAttribute('animation-mixer', {
        clip: 'Spinosaurus_Idle_Break1',
        loop: true,
        crossFadeDuration: 0.4,
        timeScale: -0.4
      });
    }, 13000);
    setTimeout(() => {
      this.phase = 'leave';
    }, 20000);
    this.phase = 'exit';
  },
  fishHunt: function () {
    setTimeout(() => {
      this.spinoHuntlieAudio.playSound();
      this.el.setAttribute('animation-mixer', {
        clip: 'Spinosaurus_Fishing_Caught_Eat',
        loop: true,
        crossFadeDuration: 0.4,
        timeScale: 0.4
      });
    }, 5000);
    setTimeout(() => {
      this.phase = 'leave';
    }, 10200);
    this.phase = 'exit';
  },
  leave: function () {
    setTimeout(() => {
      this.el.setAttribute('animation-mixer', {
        clip: 'Spinosaurus_LieDown_Start',
        loop: true,
        crossFadeDuration: 0.4,
        timeScale: 0.8
      });
    }, 2000);
    setTimeout(() => {
      this.el.setAttribute('animation-mixer', {
        clip: 'Spinosaurus_LieDown_Idle',
        loop: true,
        crossFadeDuration: 0.4,
        timeScale: 1
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
      case 'fishHunt':
        this.fishHunt();
        break;
    }
  }
});
