AFRAME.registerComponent('eagle-animation', {
  schema: {},
  init: function () {
    this.tick = AFRAME.utils.throttleTick(this.tick, 25, this);
    // Objects shortcut
    this.object = this.el.object3D;
    this.system = document.querySelector('a-scene').systems['system'];
    this.audioControl =
      document.querySelector('a-scene').systems['audioControl'];
    this.movesManager =
      document.querySelector('a-scene').systems['movesManager'];
    this.car = document.querySelector('#mammoth-car');
    this.phase = '';
    this.curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(3, -0.3, 35.434),
      new THREE.Vector3(-24.995, -0.3, 24.185),
      new THREE.Vector3(-31.018, -0.7, 15.563),
      new THREE.Vector3(-34.615, -0.7, 3.228),
      new THREE.Vector3(-27.402, -0.3, -9.057),
      new THREE.Vector3(-16.326, -0.3, -28.1)
    ]);

    // Start tour listener
    this.el.addEventListener(
      'enterWalk',
      () => {
        // Load sounds
        // Launch animation
      },
      false
    );
  },
  tick: function () {
    // Animation steps
    switch (this.phase) {
      case 'enter':
        this.enter();
        // Something else with another function if needed in each step
        break;
    }
  }
});
