AFRAME.registerComponent('cinema-car-tour', {
  init: function () {
    this.scene = 'cinema';
    this.tick = AFRAME.utils.throttleTick(this.tick, 25, this);

    this.system = document.querySelector('a-scene').systems['system'];
    this.movesManager =
      document.querySelector('a-scene').systems['movesManager'];
    this.textCar = document.querySelector('#cinema-camera-text');

    // Video
    this.videoEl = document
      .querySelector('#cinema-movie')
      .getAttribute('material').src;

    // Sounds
    this.ambiant1Sound;

    // Voice and screen phases
    this.voicePhase = 'cinema1';

    // En scene activation
    this.sceneChanged = false;

    // Start tour listeners
    window.addEventListener('changeScene', () => {
      this.videoEl.pause();
      this.videoEl.currentTime = 0;
      this.phase = 'exit';
    });

    this.el.addEventListener(
      'start',
      () => {
        document.getElementById('cinema-env').setAttribute('visible', 'true');
        this.textCar.setAttribute('visible', 'true');
        setTimeout(() => {
          this.textCar.setAttribute('visible', 'false');
        }, 10000);
        this.movesManager.nextScene = 'home';
        setTimeout(() => {
          if (!this.videoEl) {
            return;
          }
          this.el.object3D.visible = true;
          this.videoEl.play();
          this.videoEl.volume = 0.7;
        }, 3000);

        this.phase = 'start';
      },
      false
    );
  },
  // --- Phase functions ---
  start: function () {},
  tick: function () {
    // Voice phases
    switch (this.voicePhase) {
      case 'aviary1':
        // this.voiceAviary1Sound.play();
        // this.voicePhase = 'exit';
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
