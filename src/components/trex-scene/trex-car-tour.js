AFRAME.registerComponent('trex-car-tour', {
  schema: {
    carMarker: { default: 0 },
    carSpeed: { default: 0.0 },
    normalSpeed: { default: 0.00018 },
  },
  init: function () {
    this.tick = AFRAME.utils.throttleTick(this.tick, 20, this);
    // Objects shortcut
    this.object = this.el.object3D;
    this.system = document.querySelector('a-scene').systems['game'];
    this.console = document.querySelector('a-scene').systems['console'];
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
    this.maxDistance = 900;
    this.rotation = this.el.getAttribute('rotation').y;
    // Animation phase
    this.phase = 'start';
    this.sceneChanged = false;

    // Sound
    this.carDriveSoundPlaying = false;
    this.soundMixing1SoundPlaying = false;
    this.leaveSoundPlaying = false;
    this.carDriveAudio = document.getElementById('car-drive-asset');
    this.carStopAudio = document.getElementById('car-stop-asset');
    this.soundMixing1Audio = document.getElementById('sound-mixing-1');
    this.leaveAudio = document.getElementById('leave');

    // Register current tour in system
    this.console.registerCurrentTour(this);

    // Init ca rotation
    this.updateRotation();

    // Start tour listeners
    this.tourStarted = false;
    this.el.addEventListener(
      'start',
      () => {
        // Can't restart many times
        if (this.tourStarted) {
          return;
        }
        this.data.carSpeed = this.data.normalSpeed;
        this.carDriveAudio.play();
        this.carDriveSoundPlaying = true;
        document.getElementById('jungle-asset').play();
        this.tourStarted = true;
      },
      false
    );

    // Start tour listener
    this.el.addEventListener(
      'restart',
      () => {
        this.phase = 'restart';
      },
      false
    );
  },
  updateRotation: function () {
    const nextMarkerForRotation = !this.data.carSpeed
      ? this.data.normalSpeed
      : this.data.carSpeed;
    const newPosition = this.system.convertPosition(
      this.curve.getPointAt(this.data.carMarker + nextMarkerForRotation),
      this.object.position.y
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
    this.data.carSpeed -= 0.000005;
    if (this.data.carSpeed <= 0) {
      this.data.carSpeed = 0;
    }
  },
  startCar: function () {
    // Sound
    if (!this.carDriveSoundPlaying) {
      this.carDriveAudio.play();
      this.carDriveSoundPlaying = true;
    }

    // Animation
    this.data.carSpeed += 0.000005;
    if (this.data.carSpeed >= this.data.normalSpeed) {
      this.data.carSpeed = this.data.normalSpeed;
    }
  },
  driveCar: function () {
    if (this.data.carSpeed === 0) {
      return;
    }
    this.data.carMarker += this.data.carSpeed;
    this.object.position.copy(
      this.system.convertPosition(
        this.curve.getPointAt(this.data.carMarker),
        this.object.position.y
      )
    );
    if (this.system.truncMarker(this.data.carMarker) !== 0) {
      this.console.updateCarPosition(
        'trex',
        Math.round(
          (this.system.truncMarker(this.data.carMarker) / this.maxDistance) * 10
        )
      );
    }

    this.updateRotation();
  },
  // --- Phase functions ---
  start: function () {
    if (this.system.truncMarker(this.data.carMarker) === 560) {
      this.phase = 'stop';
    }
  },
  stop: function () {
    this.stopCar();
    if (this.data.carSpeed <= 0) {
      this.phase = 'stay';
    }
  },
  stay: function () {
    // if (!this.soundMixing1SoundPlaying) {
    //   const event = new Event('enter');
    //   self.trex.dispatchEvent(event);
    //   this.soundMixing1SoundPlaying = true;
    // }

    setTimeout(() => {
      if (!this.soundMixing1SoundPlaying) {
        this.soundMixing1Audio.play();
        this.soundMixing1SoundPlaying = true;
      }
      this.soundMixing1Audio.onended = () => {
        const event = new Event('enter');
        this.trex.dispatchEvent(event);
      };
    }, 8000);
  },
  restart: function () {
    this.startCar();
    if (this.data.carSpeed >= this.data.normalSpeed) {
      this.phase = 'finish';
    }
  },
  finish: function () {
    if (
      this.system.truncMarker(this.data.carMarker) === 800 &&
      !this.leaveSoundPlaying
    ) {
      this.leaveAudio.play();
      this.leaveSoundPlaying = true;
    }

    if (this.system.truncMarker(this.data.carMarker) > this.maxDistance) {
      this.stopCar();
      if (this.data.carSpeed <= 0) {
        this.phase = 'changeScene';
      }
    }
  },
  tick: function () {
    //this.system.log(this.data.carSpeed);
    this.driveCar();

    // Animation phases
    switch (this.phase) {
      case 'start':
        this.start();
        break;
      case 'stop':
        this.stop();
        break;
      case 'stay':
        this.stay();
        break;
      case 'restart':
        this.restart();
        break;
      case 'finish':
        this.finish();
        break;
      case 'changeScene':
        if (!this.sceneChanged) {
          // Destroy and detach all unecessary objets
          // Change scene
          this.system.changeScene('gate');
          this.sceneChanged = true;
        }
        break;
    }
  },
});
