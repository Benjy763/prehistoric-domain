AFRAME.registerComponent('cinema-car-tour', {
  init: function () {
    this.scene = 'cinema';
    this.tick = AFRAME.utils.throttleTick(this.tick, 25, this);

    this.system = document.querySelector('a-scene').systems['game'];

    // Sounds
    this.ambiant1Sound;

    // Voice and screen phases
    this.voicePhase = 'cinema1';

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
        setTimeout(() => {
          var videoEl = document
            .querySelector('#cinema-movie')
            .getAttribute('material').src;
          if (!videoEl) {
            return;
          }
          this.el.object3D.visible = true;
          videoEl.play();
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
        if (!this.sceneChanged) {
          // Destroy and detach all unecessary objets
          //Change scene
          const mainScene = document.getElementById('main-scene');
          mainScene.setAttribute('background', {
            color: '#000', //#00496c
          });
          mainScene.setAttribute('fog', {
            type: 'exponential',
            color: '#000',
            density: 0.1,
          });
          setTimeout(() => {
            window.location.href = 'https://map.prehistoricdomain.com/';
          }, 8000);
          this.system.changeScene('ending', false);
          this.sceneChanged = true;
        }
        break;
    }
  },
});
