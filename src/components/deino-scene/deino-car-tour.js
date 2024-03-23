AFRAME.registerComponent('deino-car-tour', {
  init: function () {
    this.scene = 'deino';
    this.tick = AFRAME.utils.throttleTick(this.tick, 25, this);

    this.system = document.querySelector('a-scene').systems['system'];
    this.movesManager =
      document.querySelector('a-scene').systems['movesManager'];
    this.deino = document.querySelector('#deino');
    this.textCar = document.querySelector('#deino-camera-text');
    this.voiceDeinoSound = 'stop';

    // Tour Path
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(4.535, 0, 81.899),
      new THREE.Vector3(4.535, 0, -174.7),
    ]);

    // Sounds
    this.voiceDeinoSoundPlaying = false;
    // Animation phase
    this.sceneChanged = false;

    // Start tour listeners
    this.el.addEventListener(
      'start',
      () => {
        // Get sounds
        // Get voice from system when init
        this.voiceDeinoSound = this.system.getVoice('deino');
        this.voicePhase = 'deino';

        // Global sound launch
        document.getElementById('jungle-asset').play();
        this.voicedeinoSound = this.system.getVoice('deino');
        this.phase = 'start';
      },
      false
    );
  },
  // --- Phase functions ---
  start: function () {
    setTimeout(() => {
      const event = new Event('enter');
      this.deino.dispatchEvent(event);
    }, 35000);
    this.phase = 'exit';
  },
  checkpointListener: function () {
    if (this.movesManager.distanceFromPoint('deino-checkpoint') < 3) {
      this.textCar.setAttribute('visible', 'true');
      this.movesManager.nextScene = 'ending';
    }
    if (this.movesManager.distanceFromPoint('deino-checkpoint') >= 3) {
      this.textCar.setAttribute('visible', 'false');
      this.movesManager.nextScene = null;
    }
  },
  tick: function () {
    // Voice phases
    if (this.voiceDeinoSound) {
      switch (this.voicePhase) {
        case 'deino':
          this.voiceDeinoSound.play();
          this.voicePhase = 'exit';
          break;
      }
    }
    // Checkpoint listener
    this.checkpointListener();
    // Animation phases
    switch (this.phase) {
      case 'start':
        this.start();
        break;
      case 'changeScene':
        // Destroy and detach all unecessary objets
        // Change scene
        this.system.changeScene('trice');
        this.phase = 'exit';
        break;
    }
  },
});
