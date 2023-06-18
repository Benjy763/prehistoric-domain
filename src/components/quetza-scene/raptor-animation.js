AFRAME.registerComponent('raptor-animation', {
  schema: {},
  init: function () {
    this.tick = AFRAME.utils.throttleTick(this.tick, 25, this);

    // Objects shortcut
    this.object = this.el.object3D;
    this.system = document.querySelector('a-scene').systems['system'];
    this.movesManager =
      document.querySelector('a-scene').systems['movesManager'];
    this.car = document.querySelector('#quetza-car');
    this.mainScene = document.getElementById('main-scene');
    this.phase = '';
    this.animationPhase = '';
    this.quetza = document.querySelector('#quetza');
    this.roarSoundPlayed = false;

    // Raptor run Path
    this.raptorMarker = 0; // Position on the curve
    this.raptorSpeed = 0.00042; // Speed on the curve
    this.walkCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-38.475, 0, 22.371),
      new THREE.Vector3(-24.357, 0, 8.74),
      new THREE.Vector3(-7.135, 0, 21.5366),
    ]);
    this.raptorTimeScale = 0.6;

    // Sound

    // Start tour listener
    this.el.addEventListener(
      'enter',
      () => {
        // Load sounds
        this.raptorWalkAudio = this.el.components['sound__raptorwalk'];
        this.raptorRunAudio = this.el.components['sound__raptorrun'];
        this.quetzaRoar1Audio = this.quetza.components['sound__quetzaroar1'];

        this.el.setAttribute('animation-mixer', {
          clip: 'Walk',
          loop: true,
          crossFadeDuration: 0.4,
          timeScale: this.raptorTimeScale,
        });
        this.raptorWalkAudio.playSound();
        this.phase = 'walk';
      },
      false
    );
  },
  // --- Phase functions ---
  walk: function () {
    this.raptorMarker = this.movesManager.moveOnCurve(
      this,
      this.object,
      this.walkCurve,
      this.raptorMarker,
      this.raptorSpeed
    );

    if (
      this.movesManager.truncMarker(this.raptorMarker) > 380 &&
      !this.roarSoundPlayed
    ) {
      this.quetzaRoar1Audio.playSound();
      this.roarSoundPlayed = true;
    }

    if (this.movesManager.truncMarker(this.raptorMarker) > 400) {
      this.raptorSpeed -= 0.0001;
      this.raptorTimeScale -= 0.01;
    }
    if (this.raptorSpeed <= 0) {
      this.el.setAttribute('animation-mixer', {
        clip: 'Run',
        loop: true,
        crossFadeDuration: 0.2,
        timeScale: 1,
      });
      this.raptorMarker = this.movesManager.moveOnCurve(
        this,
        this.object,
        this.walkCurve,
        this.raptorMarker,
        0.0004
      );
      this.raptorSpeed = 0.004;
      this.raptorWalkAudio.stopSound();
      this.raptorRunAudio.playSound();
      this.phase = 'walkAgain';
      // Trigger Quetza animation
      const event = new Event('enter');
      this.quetza.dispatchEvent(event);

      // this.raptorSpeed = 0;
      // this.el.setAttribute('animation-mixer', {
      //   clip: 'Idle',
      //   loop: true,
      //   crossFadeDuration: 0.4,
      //   timeScale: 1,
      // });
      // this.raptorMarker = this.movesManager.moveOnCurve(this,
      //   this.object,
      //   this.walkCurve,
      //   this.raptorMarker,
      //   0.0004
      // );
      // setTimeout(() => {
      //   this.el.setAttribute('animation-mixer', {
      //     clip: 'Run',
      //     loop: true,
      //     crossFadeDuration: 0.2,
      //     timeScale: 1,
      //   });
      //   this.raptorSpeed = 0.0035;
      //   this.phase = 'walkAgain';
      // }, 5000);
      // this.phase = 'wait';
    }
  },
  walkAgain: function () {
    this.raptorMarker = this.movesManager.moveOnCurve(
      this,
      this.object,
      this.walkCurve,
      this.raptorMarker,
      this.raptorSpeed
    );

    if (this.movesManager.truncMarker(this.raptorMarker) > 900) {
      this.raptorRunAudio.stopSound();
      this.phase = 'exit';
    }
  },
  tick: function () {
    // Animation steps
    switch (this.phase) {
      case 'walk':
        this.walk();
        break;
      case 'walkAgain':
        this.walkAgain();
        break;
    }
  },
});
