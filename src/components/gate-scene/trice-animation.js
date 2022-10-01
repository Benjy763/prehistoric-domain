AFRAME.registerComponent('trice-animation', {
  schema: {},
  init: function () {
    this.tick = AFRAME.utils.throttleTick(this.tick, 25, this);

    // Objects shortcut
    this.object = this.el.object3D;
    this.system = document.querySelector('a-scene').systems['system'];
    this.movesManager =
      document.querySelector('a-scene').systems['movesManager'];
    this.car = document.querySelector('#gate-car');
    this.trice2 = document.querySelector('#trice-5');
    this.phase = '';
    this.triceWalkSpeed = 0;
    this.isTrice2Stopped = false;
    // Trice run Path
    this.triceMarker = 0; // Position on the curve
    this.triceSpeed = 0.001; // Speed on the curve
    this.curve = new THREE.SplineCurve([
      new THREE.Vector2(-20.091, -96.075),
      new THREE.Vector2(-23.278, -95),
      new THREE.Vector2(-35.73, -89.99),
      new THREE.Vector2(-65.463, -84.939),
    ]);

    // Sound
    this.trice4Sound = document.querySelector('#trice-4');
    this.trice5Sound = document.querySelector('#trice-5');

    // Start tour listener
    this.el.addEventListener(
      'enter',
      () => {
        this.el.setAttribute('animation-mixer', {
          clip: 'Triceratops_Idle_Break',
          loop: true,
          crossFadeDuration: 0.4,
          timeScale: 0.6,
        });

        setTimeout(() => {
          this.trice4Sound.components['sound__roar'].playSound();
        }, 2000);
        this.phase = 'roar';
      },
      false
    );
  },
  // --- Phase functions ---
  roar: function () {
    setTimeout(() => {
      this.el.setAttribute('animation-mixer', {
        clip: 'Triceratops_Attack',
        loop: true,
        crossFadeDuration: 0.4,
        timeScale: 0.6,
      });
      this.trice4Sound.components['sound__run'].playSound();
      this.phase = 'attack';
    }, 3500);
    this.phase = 'exit';
  },
  attack: function () {
    if (this.el.object3D.position.x > -11) {
      this.trice2.setAttribute('animation-mixer', {
        clip: 'Triceratops_Hit_Left',
        loop: true,
        crossFadeDuration: 0.4,
        timeScale: 0.3,
      });
      this.trice4Sound.components['sound__impact'].playSound();
      this.trice4Sound.components['sound__run'].stopSound();
      this.phase = 'receive';
    }
    this.el.object3D.position.x += 0.3;
  },
  receive: function () {
    if (this.trice2.object3D.position.x > 3) {
      setTimeout(() => {
        this.trice2.setAttribute('animation-mixer', {
          clip: 'Triceratops_Idle_Break',
          loop: true,
          crossFadeDuration: 0.4,
          timeScale: 0.5,
        });
      }, 1);
      setTimeout(() => {
        this.el.setAttribute('animation-mixer', {
          clip: 'Triceratops_Idle_Break',
          loop: true,
          crossFadeDuration: 0.4,
          timeScale: 0.5,
        });
      }, 1.5);
      this.phase = 'boathRoar';
    }
    this.trice2.object3D.position.x += 0.08;
  },
  boathRoar: function () {
    setTimeout(() => {
      this.el.setAttribute('animation-mixer', {
        clip: 'Triceratops_Aggressive_Walk_Back_InPlace',
        loop: true,
        crossFadeDuration: 0.8,
        timeScale: 0.6,
      });
      this.trice2.setAttribute('animation-mixer', {
        clip: 'Triceratops_Aggressive_Walk_InPlace',
        loop: true,
        crossFadeDuration: 0.8,
        timeScale: 0.6,
      });
      this.trice4Sound.components['sound__walk'].playSound();
      setTimeout(() => {
        this.trice5Sound.components['sound__walk'].playSound();
      }, 500);
      this.phase = 'stepBack';
    }, 3000);
    this.phase = 'exit';
  },
  stepBack: function () {
    const triceWalkSpeedMax = 0.06;
    if (this.triceWalkSpeed < triceWalkSpeedMax) {
      this.triceWalkSpeed += 0.001;
    }
    if (this.el.object3D.position.x < -41) {
      this.el.setAttribute('animation-mixer', {
        clip: 'Triceratops_Drink',
        loop: true,
        crossFadeDuration: 0.8,
        timeScale: 0.6,
      });
      this.trice2.setAttribute('animation-mixer', {
        clip: 'Triceratops_Walk_InPlace',
        loop: true,
        crossFadeDuration: 0.4,
        timeScale: 0.6,
      });
      this.trice5Sound.components['sound__walk'].stopSound();
      this.phase = 'finish';
    }
    if (this.trice2.object3D.position.x > -20) {
      this.trice2.object3D.position.x -= this.triceWalkSpeed;
      this.trice2.object3D.rotation.y += 0.0005;
    } else if (!this.isTrice2Stopped) {
      this.isTrice2Stopped = true;
      this.trice2.setAttribute('animation-mixer', {
        clip: 'Triceratops_Aggressive_Idle',
        loop: true,
        crossFadeDuration: 0.4,
        timeScale: 0.6,
      });
    }
    this.el.object3D.position.x -= this.triceWalkSpeed;
  },
  finish: function () {
    if (this.movesManager.truncMarker(this.triceMarker) > 950) {
      this.trice4Sound.components['sound__walk'].stopSound();
      this.phase = 'exit';
    }

    this.triceMarker = this.movesManager.moveOnCurve(
      this.trice2.object3D,
      this.curve,
      this.triceMarker,
      this.triceSpeed
    );
  },
  tick: function () {
    // Animation steps
    switch (this.phase) {
      case 'roar':
        this.roar();
        break;
      case 'attack':
        this.attack();
        break;
      case 'receive':
        this.receive();
        break;
      case 'boathRoar':
        this.boathRoar();
        break;
      case 'stepBack':
        this.stepBack();
        break;
      case 'finish':
        this.finish();
        break;
    }
  },
});
