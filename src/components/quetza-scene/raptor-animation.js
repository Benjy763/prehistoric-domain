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

    // Raptor run Path
    this.raptorMarker = 0; // Position on the curve
    this.raptorSpeed = 0.0004; // Speed on the curve
    this.walkCurve = new THREE.SplineCurve([
      new THREE.Vector2(-38.475, 22.371),
      new THREE.Vector2(-24.357, 8.74),
      new THREE.Vector2(-7.135, 21.5366),
    ]);
    this.raptorTimeScale = 0.6;

    // Sound

    // Start tour listener
    this.el.addEventListener(
      'enter',
      () => {
        this.el.setAttribute('animation-mixer', {
          clip: 'Walk',
          loop: true,
          crossFadeDuration: 0.4,
          timeScale: this.raptorTimeScale,
        });
        this.phase = 'walk';
      },
      false
    );
  },
  // --- Phase functions ---
  walk: function () {
    this.raptorMarker = this.movesManager.moveOnCurve(
      this.object,
      this.walkCurve,
      this.raptorMarker,
      this.raptorSpeed
    );

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
        this.object,
        this.walkCurve,
        this.raptorMarker,
        0.0004
      );
      this.raptorSpeed = 0.004;
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
      // this.raptorMarker = this.movesManager.moveOnCurve(
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
      this.object,
      this.walkCurve,
      this.raptorMarker,
      this.raptorSpeed
    );

    if (this.movesManager.truncMarker(this.raptorMarker) > 900) {
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
