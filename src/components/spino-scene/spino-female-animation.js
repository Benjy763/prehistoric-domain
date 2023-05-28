AFRAME.registerComponent('spino-female-animation', {
  schema: {},
  init: function () {
    this.tick = AFRAME.utils.throttleTick(this.tick, 25, this);

    // Objects shortcut
    this.object = this.el.object3D;
    this.system = document.querySelector('a-scene').systems['system'];
    this.movesManager =
      document.querySelector('a-scene').systems['movesManager'];
    this.car = document.querySelector('#spino-car');
    this.mainScene = document.getElementById('main-scene');
    this.spinoMale = document.querySelector('#spino-male');
    this.spinoCar = document.querySelector('#spino-car');
    this.phase = '';
    this.fish = document.querySelector('#spino-fish');
    this.sawFish = document.querySelector('#spino-saw-fish');
    this.sawFishDead = document.querySelector('#spino-saw-fish-dead');

    // Sound markers
    this.heavyWaterPlayed = false;
    this.lightWaterPlayed = false;
    this.attackWaterPlayed = false;

    // Spino run Path
    this.spinoMarker = 0; // Position on the curve
    this.spinoWalkSpeed = 0.0008; // Speed on the curve
    this.spinoSwimSpeed = 0.0022; // Speed on the curve
    this.spinoSwimSpeed2 = 0.0035; // Speed on the curve
    this.walkCurve1 = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-28.408, 0, -40.973),
      new THREE.Vector3(-24.678, 0, -10.058),
      new THREE.Vector3(-21.574, 0, 0.238),
      new THREE.Vector3(-3.314, 0, 31.921),
    ]);
    this.walkCurve2 = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-23.791, 0, -11.48),
      new THREE.Vector3(-23.791, 0, -7),
      new THREE.Vector3(-20, 0, 1),
      new THREE.Vector3(2.66, 0, 38),
    ]);
    this.swimCurve1 = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-44.111, 0, 40.486),
      new THREE.Vector3(-33.35, 0, 29.313),
      new THREE.Vector3(-22.73, 0, 13.792),
      new THREE.Vector3(-21.9, 0, -3.527),
      new THREE.Vector3(-15, 0, -45.775),
    ]);
    this.swimCurve2 = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-41.057, 0, -28.491),
      new THREE.Vector3(-38.471, 0, -18.809),
      new THREE.Vector3(-35.549, 0, -3.511),
      new THREE.Vector3(-35.549, 0, 10.424),
      new THREE.Vector3(-40, 0, 44.26),
    ]);

    // Fish Path
    this.fishMarker = 0; // Position on the curve
    this.fishSpeed = 0.0008; // Speed on the curve
    this.fishCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-10.508, 0, -9.171),
      new THREE.Vector3(-19.703, 0, -3.136),
      new THREE.Vector3(-20.977, 0, 3.892),
      new THREE.Vector3(-24.716, 0, 6.492),
      new THREE.Vector3(-32.015, 0, 6.218),
      new THREE.Vector3(-76.883, 0, 3.19),
    ]);

    //Saw Fish Path
    this.sawFishMarker = 0; // Position on the curve
    this.sawFishSpeed = 0.0015; // Speed on the curve
    this.sawFishCurve1 = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-17.728, 0, -26.941),
      new THREE.Vector3(-21.238, 0, -16.459),
      new THREE.Vector3(-20.378, 0, -1.195),
      new THREE.Vector3(-5.596, 0, 33.163),
    ]);
    this.sawFishCurve2 = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-50.525, 0, 32.801),
      new THREE.Vector3(-39.857, 0, 16.569),
      new THREE.Vector3(-28.62, 0, 5.253),
      new THREE.Vector3(-3.602, 0, -22.739),
    ]);

    // Sound

    // Start tour listener
    this.el.addEventListener(
      'enterWalk',
      () => {
        // Load sounds
        this.spinoAttackwaterAudio = this.el.components['sound__attackwater'];
        this.spinoHeavywaterAudio = this.el.components['sound__heavywater'];
        this.spinoLightwaterAudio =
          document.getElementById('spino-saw-fish').components[
            'sound__lightwater'
          ];
        this.spinoDrinkAudio = this.el.components['sound__spino2drink'];
        this.spinoRoarAudio = this.el.components['sound__spino2roar'];
        this.spinoWalkAudio = this.el.components['sound__walk'];
        this.spinoWatermoveAudio = this.el.components['sound__watermove'];

        setTimeout(() => {
          this.spinoWalkAudio.playSound();
        }, 2500);
        this.phase = 'enterWalk';
        this.el.setAttribute('animation-mixer', {
          clip: 'Spinosaurus_Walk_InPlace',
          loop: true,
          crossFadeDuration: 0.4,
          timeScale: 0.7,
        });
      },
      false
    );
    this.el.addEventListener(
      'roar',
      () => {
        this.phase = 'roar';
      },
      false
    );
    this.el.addEventListener(
      'fishHunt',
      () => {
        this.object.position.y = -13.102;
        this.spinoMarker = 0;
        this.phase = 'fishHunt';
      },
      false
    );
  },
  // --- Phase functions ---
  enterWalk: function () {
    if (this.movesManager.truncMarker(this.spinoMarker) > 400) {
      this.spinoWatermoveAudio.playSound();
      this.spinoDrinkAudio.playSound();
      setTimeout(() => {
        this.spinoWalkAudio.stopSound();
      }, 500);
      this.el.setAttribute('animation-mixer', {
        clip: 'Spinosaurus_Idle_Break2',
        loop: true,
        crossFadeDuration: 0.4,
        timeScale: 1,
      });
      setTimeout(() => {
        this.el.setAttribute('animation-mixer', {
          clip: 'Spinosaurus_Idle_Break1',
          loop: true,
          crossFadeDuration: 2,
          timeScale: 0.6,
        });
        this.phase = 'drink';
      }, 5000);
      this.phase = 'exit';
    }
    this.spinoMarker = this.movesManager.moveOnCurve(
      this,
      this.object,
      this.walkCurve1,
      this.spinoMarker,
      this.spinoWalkSpeed
    );
  },
  drink: function () {
    setTimeout(() => {
      // Trigger Spino animation
      const event = new Event('roar');
      this.spinoMale.dispatchEvent(event);
      this.el.setAttribute('animation-mixer', {
        clip: 'Spinosaurus_Drink',
        loop: true,
        crossFadeDuration: 0.4,
        timeScale: 0.8,
      });
    }, 5000);
    this.phase = 'exit';
  },
  roar: function () {
    setTimeout(() => {
      this.spinoRoarAudio.playSound();
      this.el.setAttribute('animation-mixer', {
        clip: 'Spinosaurus_Roar',
        loop: true,
        crossFadeDuration: 0.4,
        timeScale: 0.8,
      });
    }, 1000);
    setTimeout(() => {
      // Trigger Spino animation
      this.el.setAttribute('animation-mixer', {
        clip: 'Spinosaurus_Walk_InPlace',
        loop: true,
        crossFadeDuration: 0.4,
        timeScale: 0.7,
      });
      this.spinoWalkAudio.playSound();
      this.phase = 'leave';
    }, 5000);
    this.phase = 'exit';
  },
  leave: function () {
    if (this.movesManager.truncMarker(this.spinoMarker) > 950) {
      this.object.position.x = -300;
      this.object.position.y = -13.102;
      const event = new Event('dive');
      this.spinoCar.dispatchEvent(event);
      this.el.setAttribute('animation-mixer', {
        clip: 'Spinosaurus_Swim_InPlace',
        loop: true,
        crossFadeDuration: 0.4,
        timeScale: 0.7,
      });
      this.spinoWatermoveAudio.playSound();
      setTimeout(() => {
        this.spinoWalkAudio.stopSound();
      }, 500);
      this.phase = 'exit';
      return;
    }
    this.spinoMarker = this.movesManager.moveOnCurve(
      this,
      this.object,
      this.walkCurve1,
      this.spinoMarker,
      this.spinoWalkSpeed
    );
  },
  fishHunt: function () {
    this.fishMarker = this.movesManager.moveOnCurve(
      this,
      this.fish.object3D,
      this.fishCurve,
      this.fishMarker,
      this.fishSpeed
    );
    if (
      this.movesManager.truncMarker(this.sawFishMarker) > 400 &&
      !this.lightWaterPlayed
    ) {
      this.spinoLightwaterAudio.playSound();
      this.lightWaterPlayed = true;
    }
    if (this.movesManager.truncMarker(this.sawFishMarker) < 950) {
      this.sawFishMarker = this.movesManager.moveOnCurve(
        this,
        this.sawFish.object3D,
        this.sawFishCurve1,
        this.sawFishMarker,
        this.sawFishSpeed
      );
    }
    if (this.movesManager.truncMarker(this.fishMarker) > 800) {
      this.sawFishMarker = 0;
      this.phase = 'spinoHunt';
    }
  },
  spinoHunt: function () {
    if (this.movesManager.truncMarker(this.sawFishMarker) < 950) {
      this.sawFishMarker = this.movesManager.moveOnCurve(
        this,
        this.sawFish.object3D,
        this.sawFishCurve2,
        this.sawFishMarker,
        this.sawFishSpeed
      );
    }
    if (this.movesManager.truncMarker(this.sawFishMarker) > 700) {
      this.spinoMarker = this.movesManager.moveOnCurve(
        this,
        this.object,
        this.swimCurve1,
        this.spinoMarker,
        this.spinoSwimSpeed
      );
    }
    if (
      this.movesManager.truncMarker(this.spinoMarker) > 300 &&
      !this.heavyWaterPlayed
    ) {
      this.spinoHeavywaterAudio.playSound();
      this.heavyWaterPlayed = true;
    }
    if (
      this.movesManager.truncMarker(this.spinoMarker) > 800 &&
      !this.attackWaterPlayed
    ) {
      this.spinoAttackwaterAudio.playSound();
      this.attackWaterPlayed = true;
    }
    if (this.movesManager.truncMarker(this.spinoMarker) > 950) {
      this.spinoMarker = 0;
      this.sawFishDead.setAttribute('visible', true);
      setTimeout(() => {
        this.phase = 'spinoEat';
      }, 8000);
      this.phase = 'exit';
    }
  },
  spinoEat: function () {
    this.spinoMarker = this.movesManager.moveOnCurve(
      this,
      this.object,
      this.swimCurve2,
      this.spinoMarker,
      this.spinoSwimSpeed2
    );
    if (this.movesManager.truncMarker(this.spinoMarker) > 950) {
      this.sawFishDead.setAttribute('visible', false);
      this.el.setAttribute('visible', false);
      setTimeout(() => {
        this.spinoMale.setAttribute('animation-mixer', {
          clip: 'Spinosaurus_Fishing_Idle',
          loop: true,
          crossFadeDuration: 0.4,
          timeScale: 1,
        });
        this.spinoMale.object3D.position.x = -51.189;
        this.spinoMale.object3D.position.y = -1.235;
        this.spinoMale.object3D.position.z = 6.278;
        this.spinoMale.object3D.rotation.y = 90.0;
        const event = new Event('surface');
        this.spinoCar.dispatchEvent(event);
      }, 3000);
      this.phase = 'exit';
    }
  },
  tick: function () {
    // Animation steps
    switch (this.phase) {
      case 'enterWalk':
        this.enterWalk();
        break;
      case 'drink':
        this.drink();
        break;
      case 'roar':
        this.roar();
        break;
      case 'leave':
        this.leave();
        break;
      case 'fishHunt':
        this.fishHunt();
        break;
      case 'spinoHunt':
        this.spinoHunt();
        break;
      case 'spinoEat':
        this.spinoEat();
        break;
    }
  },
});
