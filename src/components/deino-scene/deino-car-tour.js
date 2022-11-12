AFRAME.registerComponent('deino-car-tour', {
  init: function () {
    this.scene = 'deino';
    this.tick = AFRAME.utils.throttleTick(this.tick, 25, this);

    this.system = document.querySelector('a-scene').systems['system'];
    this.movesManager =
      document.querySelector('a-scene').systems['movesManager'];
    this.deino = document.querySelector('#deino');
    this.textCar = document.querySelector('#deino-camera-text');

    // Tour Path
    const curve = new THREE.SplineCurve([
      new THREE.Vector2(4.535, 81.899),
      new THREE.Vector2(4.535, -174.7),
    ]);

    // Sounds
    this.voiceDeinoSoundPlaying = false;
    // Animation phase
    this.sceneChanged = false;

    // Start tour listeners
    this.el.addEventListener(
      'start',
      () => {
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
    }, 20000);
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
