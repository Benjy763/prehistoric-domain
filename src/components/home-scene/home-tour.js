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
    this.textCar = document.querySelector('#home-camera-text');

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
      this.phase = 'exit';
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
  start: function () {
    if (this.movesManager.distanceFromPoint('home-checkpoint-cinema') < 6) {
      this.textCar.setAttribute('visible', 'true');
      this.movesManager.nextScene = 'cinema';
    }
    if (this.movesManager.distanceFromPoint('home-checkpoint-visitors') < 6) {
      this.textCar.setAttribute('visible', 'true');
      this.movesManager.nextScene = 'visitors';
    }
    if (this.movesManager.distanceFromPoint('home-checkpoint-shop-md') < 6) {
      this.textCar.setAttribute('visible', 'true');
      this.movesManager.nextScene = 'shopmd';
    }
    if (
      this.movesManager.distanceFromPoint('home-checkpoint-cinema') >= 6 &&
      this.movesManager.distanceFromPoint('home-checkpoint-visitors') >= 6 &&
      this.movesManager.distanceFromPoint('home-checkpoint-shop-md') >= 6
    ) {
      this.textCar.setAttribute('visible', 'false');
      this.movesManager.nextScene = null;
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
