AFRAME.registerComponent('visitors-car-tour', {
  init: function () {
    this.tick = AFRAME.utils.throttleTick(this.tick, 25, this);

    this.system = document.querySelector('a-scene').systems['system'];
    this.cameraPosition = document.querySelector(
      '#' + this.system.getActualSceneObject().camera
    ).object3D.position;
    this.movesManager =
      document.querySelector('a-scene').systems['movesManager'];
    this.object = this.el.object3D;

    // En scene activation
    this.sceneChanged = false;

    // Sounds
    this.backgroundSound = document.getElementById('visitors-asset');

    // Start tour listeners
    window.addEventListener('changeScene', () => {
      this.backgroundSound.pause();
    });

    this.el.addEventListener(
      'start',
      () => {
        // Global sound launch
        this.backgroundSound.play();
        setTimeout(() => {
          this.phase = 'start';
        }, 20000);
      },
      false
    );
  },
  distanceFromHome: function () {
    const rigPosition = this.movesManager.getWorldCameraPosition();
    const homeCoordinates = { x: -26, z: 2.5 };
    const a = rigPosition.x - homeCoordinates.x;
    const b = rigPosition.z - homeCoordinates.z;

    return Math.sqrt(a * a + b * b);
  },
  start: function () {
    if (this.distanceFromHome() < 8) {
      this.movesManager.nextScene = 'home';
    }
    if (this.distanceFromHome() >= 8) {
      this.movesManager.nextScene = 'visitors';
    }
  },
  tick: function () {
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
