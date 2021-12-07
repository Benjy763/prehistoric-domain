AFRAME.registerComponent('raptor-animation', {
  schema: {},
  init: function () {
    this.tick = AFRAME.utils.throttleTick(this.tick, 25, this);
    // Objects shortcut
    this.object = this.el.object3D;
    this.system = document.querySelector('a-scene').systems['game'];
    this.phase = '';
    this.car = document.querySelector('#raptor-car');

    // raptor run Path
    this.raptorMarker = 0; // Position on the curve
    this.raptorSpeed = 0.016; // Speed on the curve
    this.jumpcurve = new THREE.SplineCurve([
      new THREE.Vector2(-0.5, -3.208),
      new THREE.Vector2(0.974, -3.656),
      new THREE.Vector2(2.2, -4.487),
      new THREE.Vector2(2.4, -6.011),
      new THREE.Vector2(1.8, -6.974),
      new THREE.Vector2(2.717, -8.101),
      new THREE.Vector2(2.275, -9.477),
      new THREE.Vector2(-1.2, -13.351),
    ]);

    // Sound
    //this.bodyRoarAudio = this.el.components['sound__bodyroar'];

    // Start tour listener
    this.el.addEventListener(
      'enter',
      () => {
        // Load sounds
        this.raptorIntroAudio = this.el.components['sound__intro'];
        this.raptorJumpStartAudio = this.el.components['sound__jumpstart'];
        this.raptorRoarAudio = this.el.components['sound__roar'];
        this.RaptorJumpEndAudio = this.el.components['sound__jumpend'];

        this.el.setAttribute('animation-mixer', {
          clip: 'Deinonychus_Jump_Jump',
          timeScale: 0.5,
        });
        this.phase = 'hidden';
      },
      false
    );
  },
  // --- Phase functions ---
  hidden: function () {
    this.raptorIntroAudio.playSound();
    this.phase = 'exit';
    setTimeout(() => {
      this.raptorJumpStartAudio.playSound();
      this.phase = 'jumpEnter';
    }, 19000);
  },
  jumpEnter: function () {
    if (this.system.truncMarker(this.raptorMarker) > 300) {
      this.el.setAttribute('animation-mixer', {
        clip: 'Deinonychus_Jump_Landing',
        timeScale: 0.8,
      });
    }
    if (this.system.truncMarker(this.raptorMarker) > 410) {
      setTimeout(() => {
        this.el.setAttribute('animation-mixer', {
          clip: 'Deinonychus_Idle_Roar',
          timeScale: 0.9,
        });
        this.raptorRoarAudio.playSound();
        this.phase = 'roar';
      }, 400);
      this.phase = 'exit';
    }
    this.raptorMarker = this.system.moveOnCurve(
      this.object,
      this.jumpcurve,
      this.raptorMarker,
      this.raptorSpeed,
      'yz'
    );
  },
  roar: function () {
    setTimeout(() => {
      this.el.setAttribute('animation-mixer', {
        clip: 'Deinonychus_Jump_Jump',
        timeScale: 0.8,
      });
      this.RaptorJumpEndAudio.playSound();
      this.phase = 'jumpEnd';
    }, 7000);
    this.phase = 'roaring';
  },
  jumpEnd: function () {
    if (this.system.truncMarker(this.raptorMarker) > 580) {
      this.phase = 'end';
    }
    this.raptorMarker = this.system.moveOnCurve(
      this.object,
      this.jumpcurve,
      this.raptorMarker,
      this.raptorSpeed,
      'yz'
    );
  },
  end: function () {
    if (this.system.truncMarker(this.raptorMarker) > 950) {
      setTimeout(() => {
        const event = new Event('turnOnLight');
        this.car.dispatchEvent(event);
      }, 5000);
      this.phase = 'exit';
    }
    this.raptorMarker = this.system.moveOnCurve(
      this.object,
      this.jumpcurve,
      this.raptorMarker,
      this.raptorSpeed,
      'yz'
    );
  },
  tick: function () {
    // Animation steps
    switch (this.phase) {
      case 'hidden':
        this.hidden();
        break;
      case 'jumpEnter':
        this.jumpEnter();
        break;
      case 'roar':
        this.roar();
        break;
      case 'jumpEnd':
        this.jumpEnd();
        break;
      case 'end':
        this.end();
        break;
    }
  },
});
