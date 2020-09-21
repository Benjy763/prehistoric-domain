AFRAME.registerComponent('raptor-animation', {
  schema: {},
  init: function () {
    this.tick = AFRAME.utils.throttleTick(this.tick, 25, this);
    // Objects shortcut
    this.object = this.el.object3D;
    this.system = document.querySelector('a-scene').systems['game'];
    this.raptorHead = document.querySelector('#raptor-head');
    this.phase = '';
    // raptor run Path
    this.raptorMarker = 0; // Position on the curve
    this.raptorSpeed = 0.008; // Speed on the curve
    this.curve = new THREE.SplineCurve([
      new THREE.Vector2(-9, 8.597),
      new THREE.Vector2(-9, 7.406),
    ]);

    // Sound
    this.bodyRoarAudio;

    // Start tour listener
    this.el.addEventListener(
      'enter',
      () => {
        this.bodyRoarAudio = this.el.components['sound__bodyroar'];
        this.el.setAttribute('visible', 'true');
        this.el.setAttribute('animation-mixer', {
          clip: 'ArmatureAction.001',
          timeScale: 1,
        });
        setTimeout(() => {
          this.phase = 'enter';
          this.bodyRoarAudio.playSound();
        }, 30000);
      },
      false
    );
  },
  // --- Phase functions ---
  enter: function () {
    if (this.system.truncMarker(this.raptorMarker) > 980) {
      setTimeout(() => {
        const event = new Event('enter');
        this.raptorHead.dispatchEvent(event);
      }, 6000);
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
  exit: function () {
    setTimeout(() => {
      if (this.system.truncMarker(this.raptorMarker) < 100) {
        this.phase = 'end';
        return;
      }
      this.raptorMarker -= this.raptorSpeed;
      this.object.position.copy(
        this.system.convertPosition(
          this.curve.getPointAt(this.raptorMarker),
          this.object.position.y
        )
      );
    }, 10000);
  },
  tick: function () {
    // Animation steps
    switch (this.phase) {
      case 'enter':
        this.enter();
        break;
      case 'exit':
        this.exit();
        break;
    }
  },
});
