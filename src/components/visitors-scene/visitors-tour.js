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
    this.textCar = document.querySelector('#visitors-camera-text');

    // En scene activation
    this.sceneChanged = false;

    // Sounds
    this.backgroundSound = document.getElementById('visitors-asset');

    // Start tour listeners
    window.addEventListener('changeScene', () => {
      this.backgroundSound.pause();
      this.phase = 'exit';
    });

    this.el.addEventListener(
      'start',
      () => {
        // Global sound launch
        this.backgroundSound.play();
        this.phase = 'start';
      },
      false
    );
  },
  start: function () {
    if (this.movesManager.distanceFromPoint('visitors-main-checkpoint') < 6) {
      this.textCar.setAttribute('visible', 'true');
      this.movesManager.nextScene = 'home';
    }
    if (
      this.movesManager.distanceFromPoint('visitors-door-checkpoint-cm') < 4
    ) {
      this.textCar.setAttribute('visible', 'true');
      this.movesManager.nextScene = 'ending';
    }
    if (
      this.movesManager.distanceFromPoint('visitors-door-checkpoint-as') < 4
    ) {
      this.textCar.setAttribute('visible', 'true');
      this.movesManager.nextScene = 'ending';
    }
    if (
      this.movesManager.distanceFromPoint('visitors-door-checkpoint-gc') < 4
    ) {
      this.textCar.setAttribute('visible', 'true');
      this.movesManager.nextScene = 'ending';
    }
    if (
      this.movesManager.distanceFromPoint('visitors-door-checkpoint-st') < 4
    ) {
      this.textCar.setAttribute('visible', 'true');
      this.movesManager.nextScene = 'ending';
    }
    if (
      this.movesManager.distanceFromPoint('visitors-door-checkpoint-vw') < 4
    ) {
      this.textCar.setAttribute('visible', 'true');
      this.movesManager.nextScene = 'ending';
    }
    if (
      this.movesManager.distanceFromPoint('visitors-main-checkpoint') >= 6 &&
      this.movesManager.distanceFromPoint('visitors-door-checkpoint-cm') >= 4 &&
      this.movesManager.distanceFromPoint('visitors-door-checkpoint-as') >= 4 &&
      this.movesManager.distanceFromPoint('visitors-door-checkpoint-gc') >= 4 &&
      this.movesManager.distanceFromPoint('visitors-door-checkpoint-st') >= 4 &&
      this.movesManager.distanceFromPoint('visitors-door-checkpoint-vw') >= 4
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
      case 'changeScene':
        // Destroy and detach all unecessary objets
        // Change scene
        this.system.changeEndingScene('ending');
        this.phase = 'exit';
        break;
    }
  },
});
