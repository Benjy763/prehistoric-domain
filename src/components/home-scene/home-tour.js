AFRAME.registerComponent('home-car-tour', {
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
    this.fountainSound = document.querySelector('#home-fountain');

    // Start tour listeners
    this.el.addEventListener(
      'start',
      () => {
        setTimeout(() => {
          var videoEl = document
            .querySelector('#home-movie')
            .getAttribute('material').src;
          if (!videoEl) {
            return;
          }
          this.el.object3D.visible = true;
          videoEl.play();
        }, 3000);

        // Global sound launch
        document.getElementById('jungle-asset').play();
        this.fountainSound.components['sound__fountain'].playSound();
        setTimeout(() => {
          this.phase = 'start';
        }, 20000);
      },
      false
    );
  },
  start: function () {},
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
