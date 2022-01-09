AFRAME.registerComponent('meg-animation', {
  schema: {},
  init: function () {
    this.tick = AFRAME.utils.throttleTick(this.tick, 25, this);

    // Objects shortcut
    this.object = this.el.object3D;
    this.system = document.querySelector('a-scene').systems['game'];
    this.car = document.querySelector('#meg-car');
    this.mainScene = document.getElementById('main-scene');
    this.phase = '';

    // Meg run Path
    this.megMarker = 0; // Position on the curve
    this.megSwimSpeed = 0.0075; // Speed on the curve
    this.swimCurve = new THREE.SplineCurve([
      new THREE.Vector2(40, -60), // y,z and x to 13.622
      new THREE.Vector2(33, -5),
      new THREE.Vector2(85, -2.59),
    ]);

    // Sound
    this.megAmbiant1Audio;
    this.megAmbiant2Audio;
    this.megPassingAudio;
    this.megLeaveAudio;
    this.megRoar1Audio;
    this.megRoar2Audio;

    // Start tour listener
    this.el.addEventListener('enter', () => {}, false);
  },
  // --- Phase functions ---
  enter: function () {},
  tick: function () {
    if (this.isShaking) {
      this.shaking();
    }
    // Animation steps
    switch (this.phase) {
      case 'enter':
        this.enter();
        break;
    }
  },
});
