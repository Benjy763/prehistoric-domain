AFRAME.registerComponent('car-controls', {
  init: function () {
    // Main params
    this.object = this.el.object3D;
    this.carMarker = 0;
    this.carSpeed = 0;
    this.defaultSpeed = 0.00018;
    this.curve;
    this.maxDistance = 900;
    this.drivingState = 'stopped'; // stopped, starting, driving, stopping
    this.rotation = this.el.getAttribute('rotation').y;
    this.tick = AFRAME.utils.throttleTick(this.tick, 20, this);
    this.system = document.querySelector('a-scene').systems['game'];
    this.console = document.querySelector('a-scene').systems['console'];

    // Share car reference
    this.system.registerCar(this);

    // Sounds
    this.carDriveSoundPlaying = false;
    this.carDriveAudio = document.getElementById('car-drive-asset');
    this.carStopAudio = document.getElementById('car-stop-asset');
  },
  initParams: function (curve, maxDistance) {
    this.curve = curve;
    this.maxDistance = maxDistance;

    this.updateRotation();
  },
  updateRotation: function () {
    const nextMarkerForRotation = !this.carSpeed
      ? this.defaultSpeed
      : this.carSpeed;
    const newPosition = this.system.convertPosition(
      this.curve.getPointAt(this.carMarker + nextMarkerForRotation),
      this.object.position.y
    );
    this.object.lookAt(newPosition.x, newPosition.y, newPosition.z);
    // Correct rotation with offset
    const rotation = this.el.getAttribute('rotation');
    rotation.y += 88;
    this.el.setAttribute('rotation', rotation);
  },
  stopTrackingCar: function () {
    this.drivingState = 'stopped';
  },
  stopCar: function () {
    // Animation
    this.carSpeed -= 0.000005;
    if (this.carSpeed <= 0) {
      this.carSpeed = 0;
      this.drivingState = 'stopped';
    }
  },
  startCar: function () {
    // Animation
    this.carSpeed += 0.000005;
    if (this.carSpeed >= this.defaultSpeed) {
      this.carSpeed = this.defaultSpeed;
      this.drivingState = 'driving';
    }
  },
  driveCar: function () {
    if (this.carSpeed === 0) {
      return;
    }
    this.carMarker += this.carSpeed;
    this.object.position.copy(
      this.system.convertPosition(
        this.curve.getPointAt(this.carMarker),
        this.object.position.y
      )
    );
    if (this.system.truncMarker(this.carMarker) !== 0) {
      this.console.updateCarPosition(
        Math.round(
          (this.system.truncMarker(this.carMarker) / this.maxDistance) * 10
        ),
        null
      );
    }
    this.updateRotation();
  },
  changeDrivingState(state) {
    // Manage linked changes
    switch (state) {
      case 'starting':
        this.console.startCar();
        this.carDriveAudio.play();
        break;
      case 'stopping':
        this.console.stopCar();
        this.carStopAudio.play();
        this.carDriveAudio.currentTime = 0;
        this.carDriveAudio.pause();
        break;
    }
    this.drivingState = state;
  },
  tick: function () {
    // car driving states
    switch (this.drivingState) {
      case 'starting':
        this.startCar();
        break;
      case 'driving':
        this.driveCar();
        break;
      case 'stopping':
        this.stopCar();
        break;
    }
  },
});
