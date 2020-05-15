AFRAME.registerComponent('car-tour', {
  schema: {
    carMarker: { default: 0 },
    carSpeed: { default: 0.0 },
    speedValue: { default: 0.0002 },
  },
  init: function () {
    let self = this;

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

    // Animation phase
    this.phase = 'start';

    // Sound
    this.carDriveSoundPlaying = false;
    this.carDriveAudio = document.getElementById('car-drive-asset');
    this.carStopAudio = document.getElementById('car-stop-asset');

    this.updateRotation();

    // Start tour listener
    this.tourStarted = false;
    this.el.addEventListener(
      'start',
      () => {
        // Can't restart many times
        if (self.tourStarted) {
          return;
        }
        self.data.carSpeed = self.data.speedValue;
        self.carDriveAudio.play();
        self.carDriveSoundPlaying = true;
        document.getElementById('jungle-asset').play();
        this.tourStarted = true;
      },
      false
    );
  },
  startTour: function () {
    this.rotation = this.el.getAttribute('rotation').y;
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
      this.phase = 'stay';
      return;
    }
    this.phase = 'stop';
    this.data.carSpeed = newSpeed;
  },
  startCar: function () {
    if (this.data.carSpeed >= this.data.speedValue) {
      this.phase = 'finish';
      return;
    }
    this.phase = 'restart';
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

    // Change animation phases
    if (this.truncMarker(this.data.carMarker) === 56) {
      this.phase = 'stop';
    }

    // Animation phases
    switch (this.phase) {
      case 'stop':
        this.stopCar();
        if (this.carDriveSoundPlaying) {
          //this.carDriveAudio.volume = 1;
          this.carStopAudio.play();
          this.carDriveAudio.pause();
          this.carDriveSoundPlaying = false;
        }
        break;
      case 'stay':
        break;
      case 'restart':
        break;
      case 'finish':
        break;
    }
  },
});
