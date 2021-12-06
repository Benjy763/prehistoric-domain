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
        this.el.setAttribute('animation-mixer', {
          clip: 'Deinonychus_Jump_Jump',
          timeScale: 0.8,
        });
        setTimeout(() => {
          this.phase = 'jumpEnter';
        }, 1000);
      },
      false
    );
  },
  // --- Phase functions ---
  jumpEnter: function () {
    if (this.system.truncMarker(this.raptorMarker) > 250) {
      this.el.setAttribute('animation-mixer', {
        clip: 'Deinonychus_Jump_Air',
        timeScale: 0.8,
      });
    }
    if (this.system.truncMarker(this.raptorMarker) > 370) {
      this.el.setAttribute('animation-mixer', {
        clip: 'Deinonychus_Jump_Landing',
        timeScale: 0.8,
      });
    }
    if (this.system.truncMarker(this.raptorMarker) > 410) {
      this.el.setAttribute('animation-mixer', {
        clip: 'Deinonychus_Idle_Roar',
        timeScale: 0.8,
      });
      this.phase = 'roar';
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
      this.phase = 'jumpEnd';
    }, 8000);
    this.phase = 'roaring';
  },
  jumpEnd: function () {
    if (this.system.truncMarker(this.raptorMarker) > 580) {
      // this.el.setAttribute('animation-mixer', {
      //   clip: 'Deinonychus_Jump_Air',
      //   timeScale: 1,
      // });
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
