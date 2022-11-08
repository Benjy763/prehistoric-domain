AFRAME.registerComponent('home-car-tour', {
  init: function () {
    this.tick = AFRAME.utils.throttleTick(this.tick, 25, this);
    this.phase = '';
    this.system = document.querySelector('a-scene').systems['system'];
    this.cameraPosition = document.querySelector(
      '#' + this.system.getActualSceneObject().camera
    ).object3D.position;
    this.movesManager =
      document.querySelector('a-scene').systems['movesManager'];
    this.object = this.el.object3D;

    // Video
    this.videoEl = document
      .querySelector('#home-movie')
      .getAttribute('material').src;

    // En scene activation
    this.sceneChanged = false;

    // Sounds
    this.backgroundSound = document.getElementById('home-asset');
    this.fountainSound = document.querySelector('#home-fountain');

    // Start tour listeners
    window.addEventListener('changeScene', () => {
      this.backgroundSound.pause();
      this.videoEl.pause();
      this.fountainSound.components['sound__fountain'].stopSound();
    });

    this.el.addEventListener(
      'start',
      () => {
        setTimeout(() => {
          if (!this.videoEl) {
            return;
          }
          this.el.object3D.visible = true;
          this.videoEl.play();
        }, 3000);

        // Global sound launch
        this.backgroundSound.play();
        this.fountainSound.components['sound__fountain'].playSound();
        setTimeout(() => {
          this.phase = 'start';
        }, 0);
      },
      false
    );
  },
  distanceFromCinema: function () {
    const rigPosition = this.movesManager.getWorldCameraPosition();
    const cinemaCoordinates = { x: -69, z: -14 };
    const a = rigPosition.x - cinemaCoordinates.x;
    const b = rigPosition.z - cinemaCoordinates.z;

    return Math.sqrt(a * a + b * b);
  },
  distanceFromVisitorsHouse: function () {
    const rigPosition = this.movesManager.getWorldCameraPosition();
    const visitorsCoordinates = { x: -39, z: 13 };
    const a = rigPosition.x - visitorsCoordinates.x;
    const b = rigPosition.z - visitorsCoordinates.z;

    return Math.sqrt(a * a + b * b);
  },
  start: function () {
    if (this.distanceFromCinema() < 11) {
      this.movesManager.nextScene = 'cinema';
    }

    if (this.distanceFromVisitorsHouse() < 11) {
      this.movesManager.nextScene = 'visitors';
    }
    if (
      this.distanceFromVisitorsHouse() >= 11 &&
      this.distanceFromCinema() >= 11
    ) {
      this.movesManager.nextScene = 'home';
    }
  },
  tick: function () {
    // Animation phases
    switch (this.phase) {
      case 'start':
        this.start();
        break;
      case 'cinemaScene':
        // Destroy and detach all unecessary objets
        // Change scene
        this.system.changeScene('cinema');
        this.phase = 'exit';
        break;
      case 'changeScene':
        // Destroy and detach all unecessary objets
        // Change scene
        this.system.changeEndingScene();
        this.phase = 'exit';
        break;
    }
  },
});
