AFRAME.registerComponent('turn-control', {
  schema: {
    // the id of the element with constroller listener component attached
    controllerListenerId: { type: 'string', default: '#controller-data' },
    // the id of the element with raycaster attached, for teleport movement
    motionEnabled: { type: 'boolean', default: false }
  },

  init: function () {
    this.clock = new THREE.Clock();
    this.controllerData = document.querySelector(
      this.data.controllerListenerId
    ).components['controller-listener'];

    // create a vector to store camera direction
    this.cameraDirection = new THREE.Vector3();

    // quick turns
    this.turnReady = true;
    this.startAngle = 0;
    this.endAngle = 0;
    this.turnInProgress = false;
    this.turnAngle = 45;
    this.turnDuration = 0.1;
    this.turnTime = 0;

    this.scene = document.querySelector('a-scene');

    // other components may set this value to enable/disable this component
    this.enabled = true;
  },

  lerp: function (startValue, endValue, percent) {
    return startValue + (endValue - startValue) * percent;
  },

  tick: function () {
    // always update deltaTime!
    this.deltaTime = this.clock.getDelta();

    if (!this.enabled || !this.controllerData) return;
    // =====================================================================
    // turning in horizontal (XZ) plane
    // =====================================================================

    // while pressing left grip, press left joystick left/right to turn left/right by N degrees;
    // -or- just press right joystick left/right to turn left/right by N degrees.
    //  joystick must return to rest/center position before turning again
    this.leftX = this.controllerData.leftAxisX;
    this.rightX = this.controllerData.rightAxisX;

    if (Math.abs(this.leftX) < 0.1 && Math.abs(this.rightX) < 0.1) {
      console.log(this.controllerData.leftGrip.pressing);

      this.turnReady = true;
    }

    if (
      this.data.motionEnabled &&
      this.turnReady &&
      ((this.controllerData.leftGrip.pressing && Math.abs(this.leftX) > 0.9) ||
        Math.abs(this.rightX) > 0.9)
    ) {
      this.startAngle = this.el.getAttribute('rotation').y;

      if (this.leftX > 0.9 || this.rightX > 0.9)
        this.endAngle = this.startAngle - this.turnAngle;
      if (this.leftX < -0.9 || this.rightX < -0.9)
        this.endAngle = this.startAngle + this.turnAngle;

      this.turnInProgress = true;
      this.turnTime = 0;
      this.turnReady = false;
    }

    if (this.turnInProgress) {
      this.turnTime += this.deltaTime;
      this.rot = this.el.getAttribute('rotation');
      this.rot.y = this.lerp(
        this.startAngle,
        this.endAngle,
        this.turnTime / this.turnDuration
      );
      this.el.setAttribute('rotation', this.rot);

      if (this.turnTime >= this.turnDuration) this.turnInProgress = false;
    }
  }
});
