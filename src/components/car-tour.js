AFRAME.registerComponent('car-tour', {
  schema: {
    carMarker: { default: 0 },
    carSpeed: { default: 0.0 },
    speedValue: { default: 0.0002 },
  },
  init: function () {
    // Object shortcut
    this.object = this.el.object3D;
    this.system = document.querySelector('a-scene').systems['game'];
    // Tour Path
    this.curve = new THREE.SplineCurve([
      new THREE.Vector2(18.6, 85),
      new THREE.Vector2(4.6, 47),
      new THREE.Vector2(-4.7, 12.8),
      new THREE.Vector2(-4.7, -18),
      new THREE.Vector2(2.8, -41),
      new THREE.Vector2(30, -94),
    ]);
    this.rotation = this.el.getAttribute('rotation').y;
    this.carState = 'started'; //stopped / started / stopping / starting
    this.carDriveSoundPlaying = false;

    this.updateRotation();
  },
  convertPosition: function (position2D) {
    return {
      x: position2D.x,
      y: this.object.position.y,
      z: position2D.y,
    };
  },
  updateRotation: function () {
    const nextMarkerForRotation = !this.data.carSpeed
      ? this.data.speedValue
      : this.data.carSpeed;
    const newPosition = this.convertPosition(
      this.curve.getPointAt(this.data.carMarker + nextMarkerForRotation)
    );
    this.object.lookAt(newPosition.x, newPosition.y, newPosition.z);
    // Correct rotation with offset
    const rotation = this.el.getAttribute('rotation');
    rotation.y += 88;
    this.el.setAttribute('rotation', rotation);
  },
  stopCar: function () {
    const newSpeed = this.data.carSpeed - 0.000005;
    if (newSpeed <= 0) {
      this.data.carSpeed = 0;
      // this.data.carSpeed = 0;
      this.carState = 'stopped';
      return;
    }
    this.carState = 'stopping';
    this.data.carSpeed = newSpeed;
  },
  startCar: function () {
    if (this.data.carSpeed >= this.data.speedValue) {
      this.carState = 'started';
      return;
    }
    this.carState = 'starting';
    this.data.carSpeed += 0.00001;
  },
  truncMarker: function (carMarker) {
    return Math.trunc(carMarker * 100);
  },
  tock: function () {
    this.system.log(this.data.carSpeed);

    // Curve movement
    // 0.90 marker is animation ending
    if (this.truncMarker(this.data.carMarker) < 90) {
      this.data.carMarker += this.data.carSpeed;
      this.object.position.copy(
        this.convertPosition(this.curve.getPointAt(this.data.carMarker))
      );

      this.updateRotation();
    }

    // 0.56 marker is a stop point
    if (
      (this.truncMarker(this.data.carMarker) === 56 &&
        this.carState === 'started') ||
      this.carState === 'stopping'
    ) {
      this.stopCar();
    }

    // Update state
    if (
      this.data.carSpeed > 0 &&
      this.carState !== 'stopping' &&
      this.carState !== 'starting'
    ) {
      this.carState = 'started';
    }
    if (this.data.carSpeed === 0) {
      this.carState = 'stopped';
    }

    // Sound control
    if (this.carState === 'started' && !this.carDriveSoundPlaying) {
      document
        .querySelector('[sound__cardrive]')
        .components['sound__cardrive'].stopSound();
      document
        .querySelector('[sound__cardrive]')
        .components['sound__cardrive'].playSound();
      this.carDriveSoundPlaying = true;
    }

    if (this.carState === 'stopped' && this.carDriveSoundPlaying) {
      document
        .querySelector('[sound__cardrive]')
        .components['sound__cardrive'].stopSound();
      this.carDriveSoundPlaying = false;
    }
  },
});
