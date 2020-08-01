AFRAME.registerComponent('trice-animation', {
  schema: {},
  init: function () {
    // Objects shortcut
    this.object = this.el.object3D;
    this.system = document.querySelector('a-scene').systems['game'];
    this.car = document.querySelector('#trice-car');
    this.phase = '';
    // trex run Path
    this.triceMarker = 0; // Position on the curve
    this.triceSpeed = 0.002; // Speed on the curve
    this.curve = new THREE.SplineCurve([
      new THREE.Vector2(9.127, -110.902),
      new THREE.Vector2(14.394, -133.172),
      new THREE.Vector2(21.466, -171.98),
    ]);

    // Sound
    this.snoringAudio;
    this.agressiveAudio;
    this.roar1Audio;
    this.roar2Audio;
    this.runAudio;

    // Start tour listener
    this.el.addEventListener(
      'enter',
      () => {
        this.snoringAudio = this.el.components['sound__snoring'];
        this.agressiveAudio = this.el.components['sound__agressive'];
        this.roar1Audio = this.el.components['sound__roar1'];
        this.roar2Audio = this.el.components['sound__roar2'];
        this.runAudio = this.el.components['sound__run'];
        this.phase = 'enter';
      },
      false
    );
  },
  // --- Phase functions ---
  enter: function () {
    this.snoringAudio.playSound();
    this.phase = 'waiting';
    this.el.addEventListener('sound-ended', (e) => {
      if (e.detail.id === 'snoring') {
        this.phase = 'roar1';
      }
    });
    // this.el.setAttribute('animation-mixer', {
    //   clip: 'gate-*',
    //   timeScale: 0.8,
    // });
  },
  roar1: function () {
    this.phase = 'waiting';
    setTimeout(() => {
      this.phase = 'agressive';
    }, 4000);
    this.el.setAttribute('animation-mixer', {
      clip: 'Triceratops_Idle_Break',
      timeScale: 1,
    });
    setTimeout(() => {
      this.roar1Audio.playSound();
    }, 1000);
  },
  agressive: function () {
    this.phase = 'waiting';
    setTimeout(() => {
      this.phase = 'roar2';
    }, 2000);
    this.agressiveAudio.playSound();
    this.el.setAttribute('animation-mixer', {
      clip: 'Triceratops_Aggressive_Idle_Break',
      timeScale: 1,
    });
  },
  roar2: function () {
    this.phase = 'waiting';
    setTimeout(() => {
      this.runAudio.playSound();
      this.el.setAttribute('animation-mixer', {
        clip: 'Triceratops_Aggressive_Run_InPlace',
        timeScale: 1,
      });
      this.phase = 'run';
    }, 4000);
    this.el.setAttribute('animation-mixer', {
      clip: 'Triceratops_Idle_Break',
      timeScale: 1,
    });
    setTimeout(() => {
      this.roar2Audio.playSound();
    }, 1000);
  },
  updateRotation: function () {
    const newPosition = this.system.convertPosition(
      this.curve.getPointAt(this.triceMarker + this.triceSpeed),
      this.object.position.y
    );
    this.object.lookAt(newPosition.x, newPosition.y, newPosition.z);
    // Correct rotation with offset
    const rotation = this.el.getAttribute('rotation');
    this.el.setAttribute('rotation', rotation);
  },
  run: function () {
    if (this.system.truncMarker(this.triceMarker) > 900) {
      setTimeout(() => {
        const event = new Event('restart');
        this.car.dispatchEvent(event);
      }, 3000);
      return;
    }
    this.triceMarker += this.triceSpeed;
    this.object.position.copy(
      this.system.convertPosition(
        this.curve.getPointAt(this.triceMarker),
        this.object.position.y
      )
    );
    this.updateRotation();
  },
  tock: function () {
    // Animation steps
    switch (this.phase) {
      case 'enter':
        this.enter();
        break;
      case 'roar1':
        this.roar1();
        break;
      case 'agressive':
        this.agressive();
        break;
      case 'roar2':
        this.roar2();
        break;
      case 'run':
        this.run();
        break;
    }
  },
});
