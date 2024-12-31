AFRAME.registerComponent('mammoth-animation', {
  schema: {},
  init: function () {
    this.tick = AFRAME.utils.throttleTick(this.tick, 25, this);
    // Objects shortcut
    this.object = this.el.object3D;
    this.system = document.querySelector('a-scene').systems['system'];
    this.audioControl =
      document.querySelector('a-scene').systems['audioControl'];
    this.movesManager =
      document.querySelector('a-scene').systems['movesManager'];
    this.mammoth1 = this.el;
    this.mammoth2 = document.querySelector('#mammoth2');
    this.mammoth3 = document.querySelector('#mammoth3');
    this.phase = '';
    this.curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(53.512, -1, -60.972),
      new THREE.Vector3(53.512, 5, -30),
      new THREE.Vector3(53.512, 5, 10),
      new THREE.Vector3(53.512, -5, 50)
    ]);
    this.curve2 = new THREE.CatmullRomCurve3([
      new THREE.Vector3(58, -1, -60.972),
      new THREE.Vector3(58, 4.8, -30),
      new THREE.Vector3(58, 4.8, 10),
      new THREE.Vector3(58, -5, 50)
    ]);
    this.curve3 = new THREE.CatmullRomCurve3([
      new THREE.Vector3(49, -1, -60.972),
      new THREE.Vector3(49, 4.7, -30),
      new THREE.Vector3(49, 4.7, 10),
      new THREE.Vector3(49, -10, 50)
    ]);

    // Start tour listener
    this.el.addEventListener(
      'enterWalk',
      () => {
        // Load sounds
        // Launch animation
        this.mammoth1State = { marker: 0, started: false };
        this.mammoth2State = { marker: 0, started: false };
        this.mammoth3State = { marker: 0, started: false };
        this.phaseConfig = {
          enterWalk: {
            mammoth1Speed: 0.0113,
            mammoth2Speed: 0.011,
            mammoth3Speed: 0.01
          }
        };
        this.mammoth1.setAttribute('visible', 'true');
        this.mammoth2.setAttribute('visible', 'true');
        this.mammoth3.setAttribute('visible', 'true');
        setTimeout(() => {
          this.mammoth2State.started = true;
        }, 5000);
        setTimeout(() => {
          this.mammoth3State.started = true;
        }, 8000);
        this.phase = 'enterWalk';
      },
      false
    );
  },
  enterWalk: function () {
    this.mammoth1State.marker = this.movesManager.moveOnCurve(
      this.mammoth1State,
      this.mammoth1.object3D,
      this.curve,
      this.mammoth1State.marker,
      this.phaseConfig[this.phase].mammoth1Speed,
      { useDeltaTime: true }
    );
    if (this.mammoth2State.started) {
      this.mammoth2State.marker = this.movesManager.moveOnCurve(
        this.mammoth2State,
        this.mammoth2.object3D,
        this.curve2,
        this.mammoth2State.marker,
        this.phaseConfig[this.phase].mammoth2Speed,
        { useDeltaTime: true }
      );
    }

    if (this.mammoth3State.started) {
      this.mammoth3State.marker = this.movesManager.moveOnCurve(
        this.mammoth3State,
        this.mammoth3.object3D,
        this.curve3,
        this.mammoth3State.marker,
        this.phaseConfig[this.phase].mammoth3Speed,
        { useDeltaTime: true }
      );
    }

    if (this.movesManager.truncMarker(this.mammoth1State.marker) > 950) {
      this.phase = 'exit';
      this.mammoth1.setAttribute('visible', 'false');
      this.mammoth2.setAttribute('visible', 'false');
      this.mammoth3.setAttribute('visible', 'false');
    }
  },
  tick: function () {
    // Animation steps
    switch (this.phase) {
      case 'enterWalk':
        this.enterWalk();
        break;
    }
  }
});
