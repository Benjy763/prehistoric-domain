AFRAME.registerComponent('raptor-animation', {
  schema: {},
  init: function () {
    // Objects shortcut
    this.object = this.el.object3D;
    this.system = document.querySelector('a-scene').systems['game'];
    this.raptorHead = document.querySelector('#raptor-head');
    this.phase = '';
    // raptor run Path
    this.raptorMarker = 0; // Position on the curve
    this.raptorSpeed = 0.007; // Speed on the curve
    this.curve = new THREE.SplineCurve([
      new THREE.Vector2(-9, 3.038),
      new THREE.Vector2(-9, -15.535),
    ]);

    // Sound

    // Start tour listener
    this.el.addEventListener(
      'enter',
      () => {
        this.el.setAttribute('visible', 'true');
        this.el.setAttribute('animation-mixer', {
          clip: 'ArmatureAction.001',
          timeScale: 1,
        });
        // setTimeout(() => {
        //   this.phase = 'enter';
        // }, 6000);
      },
      false
    );
  },
  // --- Phase functions ---
  enter: function () {
    if (this.system.truncMarker(this.raptorMarker) > 900) {
      this.el.setAttribute('visible', 'false');
      // const event = new Event('enter');
      // this.raptorHead.dispatchEvent(event);
      this.phase = 'exit';
      return;
    }
    this.raptorMarker += this.raptorSpeed;
    this.object.position.copy(
      this.system.convertPosition(
        this.curve.getPointAt(this.raptorMarker),
        this.object.position.y
      )
    );
  },
  tock: function () {
    // Animation steps
    switch (this.phase) {
      case 'enter':
        this.enter();
        break;
    }
  },
});
