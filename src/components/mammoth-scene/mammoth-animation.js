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
    this.mammoth2 = document.querySelector('#mammoth-2');
    this.mammoth3 = document.querySelector('#mammoth-3');
    this.mammoth4 = document.querySelector('#mammoth-4');
    this.glacier = document.querySelector('#mammoth-glacier-1');
    this.phase = '';
    this.curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(56, -1, -60.972),
      new THREE.Vector3(56, 4.9, -30),
      new THREE.Vector3(56, 4.9, 10),
      new THREE.Vector3(56, -5, 50)
    ]);
    this.curve2 = new THREE.CatmullRomCurve3([
      new THREE.Vector3(62, -1, -60.972),
      new THREE.Vector3(62, 4.9, -30),
      new THREE.Vector3(62, 4.9, 10),
      new THREE.Vector3(62, -5, 50)
    ]);
    this.curve3 = new THREE.CatmullRomCurve3([
      new THREE.Vector3(49, -1, -60.972),
      new THREE.Vector3(49, 4.9, -30),
      new THREE.Vector3(49, 4.9, 10),
      new THREE.Vector3(49, -10, 50)
    ]);
    this.curve4 = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-21.55, -10, -42.912),
      new THREE.Vector3(14.608, 2.1, -32.406),
      new THREE.Vector3(28, 3.9, -19.408),
      new THREE.Vector3(51.336, 5.6, -1.23),
      new THREE.Vector3(70, -2.575, 50)
    ]);

    // Start tour listener
    this.el.addEventListener(
      'enterWalk',
      () => {
        // Load sounds
        this.glacierAudio = this.glacier.components['sound__glacier'];
        this.mammothEnterAudio =
          this.mammoth4.components['sound__mammothenter'];
        this.mammothAudio3 = this.el.components['sound__mammoth3'];
        this.mammothAudio4 = this.el.components['sound__mammoth4'];
        this.mammothAudio5 = this.el.components['sound__mammoth5'];
        // Launch animation
        this.mammoth1State = { marker: 0, enabled: true, running: false };
        this.mammoth2State = { marker: 0, enabled: false, running: false };
        this.mammoth3State = { marker: 0, enabled: false, running: false };
        this.mammoth4State = { marker: 0, enabled: false, running: false };
        this.glacierStateFalling = false;
        this.phaseConfig = {
          enterWalk: {
            mammoth1Speed: 0.013,
            mammoth2Speed: 0.013,
            mammoth3Speed: 0.0135,
            mammoth4Speed: 0.012
          }
        };
        this.mammothSpeed = 0.003;
        this.glacierSpeed = 0.3;
        this.mammoth1.setAttribute('visible', 'true');
        this.mammoth2.setAttribute('visible', 'true');
        this.mammoth3.setAttribute('visible', 'true');
        this.mammoth4.setAttribute('visible', 'true');

        this.mammothAudio5.playSound();
        setTimeout(() => {
          this.mammoth2State.enabled = true;
        }, 8000);
        setTimeout(() => {
          this.mammoth3State.enabled = true;
        }, 12000);
        setTimeout(() => {
          this.mammothAudio3.playSound();
        }, 18000);
        setTimeout(() => {
          this.mammoth4State.enabled = true;
        }, 25000);
        setTimeout(() => {
          this.mammothEnterAudio.playSound();
        }, 32000);

        this.phase = 'enterWalk';
      },
      false
    );
  },
  enterWalk: function () {
    // Mammoth moving
    if (this.mammoth1State.enabled) {
      this.mammoth1State.marker = this.movesManager.moveOnCurve(
        this.mammoth1State,
        this.mammoth1.object3D,
        this.curve,
        this.mammoth1State.marker,
        this.phaseConfig[this.phase].mammoth1Speed,
        { useDeltaTime: true }
      );
    }

    if (this.mammoth2State.enabled) {
      this.mammoth2State.marker = this.movesManager.moveOnCurve(
        this.mammoth2State,
        this.mammoth2.object3D,
        this.curve2,
        this.mammoth2State.marker,
        this.phaseConfig[this.phase].mammoth2Speed,
        { useDeltaTime: true }
      );
    }

    if (this.mammoth3State.enabled) {
      this.mammoth3State.marker = this.movesManager.moveOnCurve(
        this.mammoth3State,
        this.mammoth3.object3D,
        this.curve3,
        this.mammoth3State.marker,
        this.phaseConfig[this.phase].mammoth3Speed,
        { useDeltaTime: true }
      );
    }

    if (this.mammoth4State.enabled) {
      this.mammoth4State.marker = this.movesManager.moveOnCurve(
        this.mammoth4State,
        this.mammoth4.object3D,
        this.curve4,
        this.mammoth4State.marker,
        this.phaseConfig[this.phase].mammoth4Speed,
        { useDeltaTime: true }
      );
    }

    // Glacier is falling
    if (
      this.movesManager.truncMarker(this.mammoth1State.marker) > 600 &&
      !this.glacierStateFalling
    ) {
      this.glacierAudio.playSound();
    }
    if (
      this.movesManager.truncMarker(this.mammoth1State.marker) > 700 &&
      !this.glacierStateFalling
    ) {
      setTimeout(() => {
        this.mammothAudio4.playSound();
      }, 2000);
      this.glacierStateFalling = true;
      setTimeout(() => {
        this.mammoth1.setAttribute('animation-mixer', {
          clip: 'Run',
          crossFadeDuration: 0.5,
          timeScale: 1
        });
        this.mammoth1State.running = true;

        this.phaseConfig[this.phase].mammoth1Speed =
          this.phaseConfig[this.phase].mammoth1Speed > 0.06
            ? this.phaseConfig[this.phase].mammoth1Speed
            : this.phaseConfig[this.phase].mammoth1Speed + this.mammothSpeed;
      }, 5500);
      setTimeout(() => {
        this.mammoth2.setAttribute('animation-mixer', {
          clip: 'Run',
          crossFadeDuration: 0.5,
          timeScale: 1
        });
        this.mammoth2State.running = true;
        this.phaseConfig[this.phase].mammoth2Speed =
          this.phaseConfig[this.phase].mammoth2Speed > 0.06
            ? this.phaseConfig[this.phase].mammoth2Speed
            : this.phaseConfig[this.phase].mammoth2Speed + this.mammothSpeed;
      }, 6000);
      setTimeout(() => {
        this.mammoth3.setAttribute('animation-mixer', {
          clip: 'Run',
          crossFadeDuration: 0.5,
          timeScale: 1
        });
        this.mammoth3State.running = true;
        this.phaseConfig[this.phase].mammoth3Speed =
          this.phaseConfig[this.phase].mammoth3Speed > 0.06
            ? this.phaseConfig[this.phase].mammoth3Speed
            : this.phaseConfig[this.phase].mammoth3Speed + this.mammothSpeed;
      }, 6000);
      setTimeout(() => {
        this.mammoth4.setAttribute('animation-mixer', {
          clip: 'Run',
          crossFadeDuration: 0.5,
          timeScale: 1
        });
        this.mammoth4State.running = true;
        this.phaseConfig[this.phase].mammoth4Speed =
          this.phaseConfig[this.phase].mammoth4Speed > 0.06
            ? this.phaseConfig[this.phase].mammoth4Speed
            : this.phaseConfig[this.phase].mammoth4Speed + this.mammothSpeed;
      }, 6500);
    }

    // Mammoth running away
    if (
      this.movesManager.truncMarker(this.mammoth1State.marker) > 700 &&
      this.glacierStateFalling
    ) {
      const currentGlacierPosition = this.glacier.object3D.position;
      currentGlacierPosition.y -= this.glacierSpeed;
      this.glacierSpeed += 0.007;
      this.glacier.object3D.position.set(
        currentGlacierPosition.x,
        currentGlacierPosition.y,
        currentGlacierPosition.z
      );
      if (this.mammoth1State.running) {
        this.phaseConfig[this.phase].mammoth1Speed =
          this.phaseConfig[this.phase].mammoth1Speed > 0.06
            ? this.phaseConfig[this.phase].mammoth1Speed
            : this.phaseConfig[this.phase].mammoth1Speed + this.mammothSpeed;
      }
      if (this.mammoth2State.running) {
        this.phaseConfig[this.phase].mammoth2Speed =
          this.phaseConfig[this.phase].mammoth2Speed > 0.06
            ? this.phaseConfig[this.phase].mammoth2Speed
            : this.phaseConfig[this.phase].mammoth2Speed + this.mammothSpeed;
      }
      if (this.mammoth3State.running) {
        this.phaseConfig[this.phase].mammoth3Speed =
          this.phaseConfig[this.phase].mammoth3Speed > 0.06
            ? this.phaseConfig[this.phase].mammoth3Speed
            : this.phaseConfig[this.phase].mammoth3Speed + this.mammothSpeed;
      }
      if (this.mammoth4State.running) {
        this.phaseConfig[this.phase].mammoth4Speed =
          this.phaseConfig[this.phase].mammoth4Speed > 0.06
            ? this.phaseConfig[this.phase].mammoth4Speed
            : this.phaseConfig[this.phase].mammoth4Speed + this.mammothSpeed;
      }
    }
    if (
      this.movesManager.truncMarker(this.mammoth1State.marker) > 950 &&
      this.mammoth1State.enabled
    ) {
      this.mammoth1State.enabled = false;
      this.mammoth2State.enabled = false;
      this.mammoth3State.enabled = false;
      this.mammoth1.setAttribute('visible', 'false');
      this.mammoth2.setAttribute('visible', 'false');
      this.mammoth3.setAttribute('visible', 'false');
    }

    if (this.movesManager.truncMarker(this.mammoth4State.marker) > 950) {
      this.phase = 'exit';
      this.mammoth4.setAttribute('visible', 'false');
    }
  },
  tick: function () {
    // Animation steps
    switch (this.phase) {
      case 'enterWalk':
        this.enterWalk();
        break;
      case 'runAway':
        this.runAway();
        break;
    }
  }
});
