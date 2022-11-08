AFRAME.registerComponent('cinema-car-tour', {
  init: function () {
    this.scene = 'cinema';
    this.tick = AFRAME.utils.throttleTick(this.tick, 25, this);

    this.system = document.querySelector('a-scene').systems['system'];
    this.movesManager =
      document.querySelector('a-scene').systems['movesManager'];

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
    });

    this.el.addEventListener(
      'start',
      () => {
        this.movesManager.nextScene = 'home';
        setTimeout(() => {
          if (!this.videoEl) {
            return;
          }
          this.el.object3D.visible = true;
          this.videoEl.play();
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
