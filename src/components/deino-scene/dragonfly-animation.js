AFRAME.registerComponent('dragonfly-animation', {
  schema: {},
  init: function () {
    this.tick = AFRAME.utils.throttleTick(this.tick, 25, this);
    // Objects shortcut
    this.object = this.el.object3D;
    this.system = document.querySelector('a-scene').systems['system'];
    this.movesManager =
      document.querySelector('a-scene').systems['movesManager'];
    this.phase = '';
    this.deino = document.querySelector('#deino');
    this.dragonFlyTimeScale = 3;

    // dragonfly run Path
    this.dragonflyMarker = 0; // Position on the curve
    this.dragonflySpeed = 0.01; // Speed on the curve
    this.curveFly = new THREE.CatmullRomCurve3([
      new THREE.Vector3(3.57, 3.495, -15.093),
      new THREE.Vector3(0.756, 3.495, -13.291),
      new THREE.Vector3(0.83, 2.167, -10.414),
      new THREE.Vector3(-0.406, 2.842, -5.696),
      new THREE.Vector3(-3.795, 1.3, -8.838),
    ]);

    this.curveFly2 = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-2.628, 1.874, -7.551),
      new THREE.Vector3(-13.585, 7.881, -37.801),
    ]);

    // Sound
    //this.bodyRoarAudio = this.el.components['sound__bodyroar'];

    // Start tour listener
    this.el.addEventListener(
      'enter',
      () => {
        this.dragonflyAudio = this.el.components['sound__dragonfly'];
        this.el.setAttribute('animation-mixer', {
          clip: 'Armature.001|Take 001|BaseLayer.001',
          timeScale: this.dragonFlyTimeScale,
        });
        this.dragonflyAudio.playSound();
        this.phase = 'fly';
      },
      false
    );

    this.el.addEventListener(
      'flyAgain',
      () => {
        this.el.setAttribute('animation-mixer', {
          clip: 'Armature.001|Take 001|BaseLayer.001',
          timeScale: this.dragonFlyTimeScale,
        });
        this.dragonflyAudio.playSound();
        this.phase = 'flyAgain';
      },
      false
    );
  },
  // --- Phase functions ---
  fly: function () {
    this.dragonflyMarker = this.movesManager.moveOnCurve(
      this.object,
      this.curveFly,
      this.dragonflyMarker,
      this.dragonflySpeed,
      '3d'
    );

    if (this.movesManager.truncMarker(this.dragonflyMarker) > 885) {
      setTimeout(() => {
        const event = new Event('jump');
        this.deino.dispatchEvent(event);
      }, 8000);
      this.dragonflyMarker = 0;
      this.dragonflySpeed = 0.01;
      this.dragonflyAudio.stopSound();
      this.phase = 'stopFlying';
    }
  },
  stopFlying: function () {
    if (this.dragonFlyTimeScale <= 0) {
      this.dragonFlyTimeScale = 0;
      this.el.setAttribute('animation-mixer', {
        clip: 'Armature.001|Take 001|BaseLayer.001',
        timeScale: this.dragonFlyTimeScale,
      });
      return;
    }
    this.dragonFlyTimeScale -= 0.05;
    this.el.setAttribute('animation-mixer', {
      clip: 'Armature.001|Take 001|BaseLayer.001',
      timeScale: this.dragonFlyTimeScale,
    });
  },
  flyAgain: function () {
    this.dragonflyMarker = this.movesManager.moveOnCurve(
      this.object,
      this.curveFly2,
      this.dragonflyMarker,
      this.dragonflySpeed,
      '3d'
    );

    if (this.movesManager.truncMarker(this.dragonflyMarker) > 950) {
      this.dragonflyAudio.stopSound();
      this.phase = 'exit';
    }
  },
  tick: function () {
    // Animation steps
    switch (this.phase) {
      case 'fly':
        this.fly();
        break;
      case 'stopFlying':
        this.stopFlying();
        break;
      case 'flyAgain':
        this.flyAgain();
        break;
    }
  },
});
