AFRAME.registerComponent('aviary-car-tour', {
  init: function () {
    this.scene = 'aviary';
    this.tick = AFRAME.utils.throttleTick(this.tick, 25, this);

    this.system = document.querySelector('a-scene').systems['game'];
    this.ptera = document.querySelector('#pteranodon');
    this.quetza = document.querySelector('#quetza');

    // Sounds
    this.ambiant1Sound;
    this.ambiant2Sound;

    // Voice and screen phases
    this.voicePhase = 'aviary1';

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
        // Global sound launch
        document.getElementById('jungle-asset').play();

        // Get sounds
        this.ambiant1Sound =
          document.getElementById('aviary-cliff-1').components[
            'sound__ambiant1'
          ];
        this.ambiant2Sound =
          document.getElementById('aviary-cliff-2').components[
            'sound__ambiant2'
          ];
        // Get voice from system when init
        this.voiceAviary1Sound = this.system.getVoice('aviary1');

        this.phase = 'start';
      },
      false
    );

    // Restart tour listeners
    this.el.addEventListener(
      'restartPtera',
      () => {
        this.phase = 'restartPtera';
      },
      false
    );
    this.el.addEventListener(
      'restartQuetzaWalk',
      () => {
        this.phase = 'restartQuetzaWalk';
      },
      false
    );
    this.el.addEventListener(
      'restartQuetzaFly',
      () => {
        this.phase = 'restartQuetzaFly';
      },
      false
    );
  },
  // --- Phase functions ---
  start: function () {
    setTimeout(() => {
      this.ambiant1Sound.playSound();
    }, 20000);
    setTimeout(() => {
      // Trigger Pteranodon animation
      const event = new Event('enter');
      this.ptera.dispatchEvent(event);
    }, 45000);
    this.phase = 'exit';
  },
  restartPtera: function () {
    setTimeout(() => {
      // Trigger Pteranodon animation
      const event = new Event('enterWalk');
      this.quetza.dispatchEvent(event);
    }, 6000);
    this.phase = 'exit';
  },
  restartQuetzaWalk: function () {
    setTimeout(() => {
      // Trigger Pteranodon animation
      const event = new Event('enterFly');
      this.quetza.dispatchEvent(event);
    }, 6000);
    this.phase = 'exit';
  },
  restartQuetzaFly: function () {
    setTimeout(() => {
      this.phase = 'changeScene';
    }, 3000);
  },
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
      case 'restartPtera':
        this.restartPtera();
        break;
      case 'restartQuetzaWalk':
        this.restartQuetzaWalk();
        break;
      case 'restartQuetzaFly':
        this.restartQuetzaFly();
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
