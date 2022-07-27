AFRAME.registerComponent('aviary-car-tour', {
  init: function () {
    this.scene = 'aviary';
    this.tick = AFRAME.utils.throttleTick(this.tick, 25, this);

    this.system = document.querySelector('a-scene').systems['system'];
    this.cameraPosition = document.querySelector(
      '#' + this.system.getActualSceneObject().camera
    ).object3D.position;
    this.movesManager =
      document.querySelector('a-scene').systems['movesManager'];
    this.ptera = document.querySelector('#pteranodon');

    // Sounds
    this.ambiant1Sound;
    this.ambiant3Sound;

    // Voice and screen phases
    this.voicePhase = 'stop';

    // Tour Path
    const curve = new THREE.SplineCurve([
      new THREE.Vector2(7.988, 81.899),
      new THREE.Vector2(9.7, -174.7),
    ]);

    // En scene activation
    this.sceneChanged = false;

    // Start tour listeners
    this.el.addEventListener(
      'start',
      () => {
        // Global sound launch
        document.getElementById('jungle-asset').play();

        // Get sounds
        this.ambiant1Sound =
          document.getElementById('aviary-cliff-1').components[
            'sound__ambiant1'
          ];
        this.ambiant3Sound =
          document.getElementById('aviary-cliff-1').components[
            'sound__ambiant3'
          ];
        // Get voice from system when init
        this.voiceAviary1Sound = this.system.getVoice('aviary1');
        this.voicePhase = 'aviary1';
        setTimeout(() => {
          this.phase = 'start';
        }, 0);
      },
      false
    );
  },
  // --- Phase functions ---
  start: function () {
    setTimeout(() => {
      this.ambiant1Sound.playSound();
    }, 20000);
    setTimeout(() => {
      // Trigger Pteranodon animation
      const event = new Event('enter');
      this.ptera.dispatchEvent(event);
    }, 45000);
    this.phase = 'exit';
  },
  tick: function () {
    // Walk bound checking
    //this.movesManager.checkBoundLimits(this.cameraPosition);

    // Voice phases
    switch (this.voicePhase) {
      case 'aviary1':
        this.voiceAviary1Sound.play();
        this.voicePhase = 'exit';
        break;
    }
    // Animation phases
    switch (this.phase) {
      case 'start':
        this.start();
        break;
      case 'changeScene':
        // Destroy and detach all unecessary objets
        // Change scene
        this.system.changeEndingScene('ending');
        this.phase = 'exit';
        break;
    }
  },
});
