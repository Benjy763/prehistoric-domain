AFRAME.registerComponent('car-tour', {
  schema: {
    carMarker: { default: 0 },
    carSpeed: { default: 0.0 },
    normalSpeed: { default: 0.0002 },
  },
  init: function () {
    let self = this;

    // Objects shortcut
    this.object = this.el.object3D;
    this.system = document.querySelector('a-scene').systems['game'];
    this.trex = document.querySelector('#trex');

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
    this.soundMixing1SoundPlaying = false;
    this.leaveSoundPlaying = false;
    this.carDriveAudio = document.getElementById('car-drive-asset');
    this.carStopAudio = document.getElementById('car-stop-asset');
    this.soundMixing1Audio = document.getElementById('sound-mixing-1');
    this.leaveAudio = document.getElementById('leave');

    this.updateRotation();

    // Start tour listeners
    this.tourStarted = false;
    this.el.addEventListener(
      'start',
      () => {
        setTimeout(() => {
          // Can't restart many times
          if (self.tourStarted) {
            return;
          }
          self.data.carSpeed = self.data.normalSpeed;
          self.carDriveAudio.play();
          self.carDriveSoundPlaying = true;
          document.getElementById('jungle-asset').play();
          self.tourStarted = true;
        }, 4000);
      },
      false
    );

    // Start tour listener
    this.el.addEventListener(
      'restart',
      () => {
        self.phase = 'restart';
      },
      false
    );
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
      ? this.data.normalSpeed
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
    // Sound
    if (this.carDriveSoundPlaying) {
      this.carStopAudio.play();
      this.carDriveAudio.currentTime = 0;
      this.carDriveAudio.pause();
      this.carDriveSoundPlaying = false;
    }

    // Animation
    if (this.data.carSpeed <= 0) {
      this.data.carSpeed = 0;
      this.phase = 'stay';
      return;
    }
    this.phase = 'stop';
    this.data.carSpeed -= 0.000005;
  },
  startCar: function () {
    // Sound
    if (!this.carDriveSoundPlaying) {
      this.carDriveAudio.play();
      this.carDriveSoundPlaying = true;
    }

    // Animation
    if (this.data.carSpeed >= this.data.normalSpeed) {
      console.log('coucou');

      this.data.carSpeed = this.data.normalSpeed;
      this.phase = 'finish';
      return;
    }

    this.phase = 'restart';
    this.data.carSpeed += 0.000005;
  },
  truncMarker: function (carMarker) {
    return Math.trunc(carMarker * 1000);
  },
  driveCar: function (carMarker) {
    this.data.carMarker += this.data.carSpeed;
    this.object.position.copy(
      this.convertPosition(this.curve.getPointAt(this.data.carMarker))
    );

    this.updateRotation();
  },
  tock: function () {
    const self = this;
    this.system.log(this.data.carSpeed);
    this.driveCar();

    // Animation phases
    switch (this.phase) {
      case 'start':
        if (this.truncMarker(this.data.carMarker) === 560) {
          this.phase = 'stop';
        }
        break;
      case 'stop':
        this.stopCar();
        break;
      case 'stay':
        // if (!this.soundMixing1SoundPlaying) {
        //   const event = new Event('enter');
        //   self.trex.dispatchEvent(event);
        //   this.soundMixing1SoundPlaying = true;
        // }

        setTimeout(() => {
          if (!this.soundMixing1SoundPlaying) {
            self.soundMixing1Audio.play();
            this.soundMixing1SoundPlaying = true;
          }
          self.soundMixing1Audio.onended = function () {
            const event = new Event('enter');
            self.trex.dispatchEvent(event);
          };
        }, 3000);
        break;
      case 'restart':
        this.startCar();
        break;
      case 'finish':
        if (
          this.truncMarker(this.data.carMarker) === 700 &&
          !this.leaveSoundPlaying
        ) {
          this.leaveAudio.play();
          this.leaveSoundPlaying = true;
        }

        if (this.truncMarker(this.data.carMarker) === 900) {
          this.stopCar();
        }
        break;
    }
  },
});
