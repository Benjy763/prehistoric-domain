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
    this.system = document.querySelector('a-scene').systems['system'];
    this.movesManager =
      document.querySelector('a-scene').systems['movesManager'];

    // Share car reference
    this.system.registerCar(this);

    // Sounds
    this.carDriveSoundPlaying = false;
    this.carDriveAudio = document.getElementById('car-drive-asset');
    this.carStopAudio = document.getElementById('car-stop-asset');
  },
  initParams: function (curve, maxDistance, speed = 0.00018) {
    this.curve = curve;
    this.maxDistance = maxDistance;
    this.defaultSpeed = speed;
  },
  stopTrackingCar: function () {
    this.drivingState = 'stopped';
  },
  changeCurve(curve, maxDistance, speed) {
    this.initParams(curve, maxDistance, speed);
    this.carMarker = 0;
    this.carSpeed = speed;
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
    this.carMarker = this.movesManager.moveOnCurve(
      this.object,
      this.curve,
      this.carMarker,
      this.carSpeed
    );
  },
  changeDrivingState(state) {
    // Manage linked changes
    switch (state) {
      case 'starting':
        this.carDriveAudio.play();
        break;
      case 'stopping':
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
