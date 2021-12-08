AFRAME.registerComponent('raptor-car-tour', {
  init: function () {
    this.scene = 'raptor';
    this.tick = AFRAME.utils.throttleTick(this.tick, 25, this);

    this.system = document.querySelector('a-scene').systems['game'];
    this.raptor = document.querySelector('#raptor');
    this.ambiantLight = document.querySelector('#raptor-ambiant-light');
    this.ambiantLightIntensity = 1;
    this.ambiantLightIntensitySpeed = 0.002;
    this.carControls;
    // Tour Path
    const curve = new THREE.SplineCurve([
      new THREE.Vector2(4.535, 81.899),
      new THREE.Vector2(4.535, -174.7),
    ]);

    // Sounds
    this.voiceRaptorSoundPlaying = true;
    // Animation phase
    this.sceneChanged = false;

    // Init car (when reference is registered in the system) with tour data
    this.el.addEventListener('carRegistered', () => {
      // Get car reference
      this.carControls = this.system.carReference;
      // Init tour path for the car
      this.carControls.initParams(curve, 620);
    });

    // Start tour listeners
    this.el.addEventListener(
      'start',
      () => {
        this.voiceRaptorSound = this.system.getVoice('raptor');
        this.phase = 'start';
        this.carControls.changeDrivingState('starting');
      },
      false
    );

    // Restart tour listener, trigger by raptor controler
    this.el.addEventListener(
      'turnOnLight',
      () => {
        this.phase = 'turnOnLight';
      },
      false
    );
    this.ambiantLight;
  },
  // --- Phase functions ---
  start: function () {
    if (this.system.truncMarker(this.carControls.carMarker) > 340) {
      this.carControls.changeDrivingState('stopping');
      this.phase = 'exit';
      setTimeout(() => {
        setTimeout(() => {
          const event = new Event('enter');
          this.raptor.dispatchEvent(event);
        }, 5000);
        this.phase = 'turnOffLight';
      }, 5000);
    }
  },
  turnOffLight() {
    if (this.ambiantLightIntensity < 0) {
      this.phase = 'exit';
    }
    this.ambiantLightIntensity -= this.ambiantLightIntensitySpeed;
    this.ambiantLight.setAttribute('light', {
      intensity: this.ambiantLightIntensity,
    });
  },
  turnOnLight() {
    setTimeout(() => {
      this.phase = 'restart';
    }, 5000);
    if (this.ambiantLightIntensity > 1.4) {
      this.phase = 'exit';
    }
    this.ambiantLightIntensity += this.ambiantLightIntensitySpeed;
    this.ambiantLight.setAttribute('light', {
      intensity: this.ambiantLightIntensity,
    });
  },
  restart: function () {
    this.carControls.changeDrivingState('starting');
    this.phase = 'finish';
  },
  finish: function () {
    if (
      this.system.truncMarker(this.carControls.carMarker) >
      this.carControls.maxDistance
    ) {
      this.phase = 'changeScene';
    }
  },
  tick: function () {
    if (!this.carControls) {
      return;
    }
    // Voice
    if (
      this.system.truncMarker(this.carControls.carMarker) > 50 &&
      !this.voiceRaptorSoundPlaying
    ) {
      this.voiceRaptorSound.play();
      this.voiceRaptorSoundPlaying = true;
    }
    // Animation phases
    switch (this.phase) {
      case 'start':
        this.start();
        break;
      case 'turnOffLight':
        this.turnOffLight();
        break;
      case 'turnOnLight':
        this.turnOnLight();
        break;
      case 'restart':
        this.restart();
        break;
      case 'finish':
        this.finish();
        break;
      case 'changeScene':
        if (!this.sceneChanged) {
          // Destroy and detach all unecessary objets
          // Change scene
          this.system.changeScene('trice');
          this.sceneChanged = true;
        }
        break;
    }
  },
});
