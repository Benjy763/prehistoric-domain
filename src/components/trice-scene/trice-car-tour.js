AFRAME.registerComponent('trice-car-tour', {
  init: function () {
    this.scene = 'trice';
    this.tick = AFRAME.utils.throttleTick(this.tick, 25, this);

    this.system = document.querySelector('a-scene').systems['system'];
    this.movesManager =
      document.querySelector('a-scene').systems['movesManager'];
    this.gate = document.querySelector('#trice-gate-back');
    this.trice = document.querySelector('#trice');
    this.carAlarmSound = document.getElementById('car-alarm-sound');
    this.endingSound = document.getElementById('soundtrack-ending-sound');
    this.voicePhase = 'trice1';
    this.bigDoor = document.getElementById('trice-big-door');
    this.screenDefault = document.getElementById('trice-screen-default-2');
    this.screenBrachio = document.getElementById('trice-screen-brachio-2');
    this.screenTrice = document.getElementById('trice-screen-trice-2');
    this.screenGalli = document.getElementById('trice-screen-galli-2');
    this.screenAlarm = document.getElementById('trice-screen-alarm');
    this.screenPhase = 'galli';
    this.carControls;
    this.animationsStatuses = {
      gateOpen: false,
      gateClosed: false,
    };
    // Tour Path
    const curve = new THREE.SplineCurve([
      new THREE.Vector2(9.7, -174.7),
      new THREE.Vector2(7.988, 81.899),
    ]);

    // Animation phase
    this.sceneChanged = false;

    // Sound
    this.endingSoundPlayed = false;
    this.soundMixing1SoundPlaying = false;
    this.carTurnOn = document.getElementById('car-turn-on');
    this.gateSound = document.querySelector('#trice-big-door');
    this.gateSoundPhase = 'open';

    // Init car (when reference is registered in the system) with tour data
    this.el.addEventListener('carRegistered', () => {
      // Get car reference
      this.carControls = this.system.carReference;
      // Init tour path for the car
      this.carControls.initParams(curve, 800);
    });

    // Start tour listeners
    this.el.addEventListener(
      'start',
      () => {
        this.voiceTrice1Sound = this.system.getVoice('trice1');
        this.voiceTrice2Sound = this.system.getVoice('trice2');
        this.phase = 'start';
        this.carControls.changeDrivingState('starting');
      },
      false
    );

    // Restart tour listener, trigger by trice controler
    this.el.addEventListener(
      'restart',
      () => {
        this.phase = 'restart';
      },
      false
    );
  },
  // --- Phase functions ---
  gateSounds: function () {
    if (
      this.movesManager.truncMarker(this.carControls.carMarker) > 650 &&
      this.gateSoundPhase === 'open'
    ) {
      this.gateSound.components['sound__gateopen'].playSound();
      this.gateSoundPhase = 'close';
    }
    if (
      this.movesManager.truncMarker(this.carControls.carMarker) > 745 &&
      this.gateSoundPhase === 'close'
    ) {
      this.gateSound.components['sound__gateclose'].playSound();
      this.gateSoundPhase = 'exit';
    }
  },
  start: function () {
    if (this.movesManager.truncMarker(this.carControls.carMarker) > 310) {
      this.phase = 'stop';
    }
  },
  stop: function () {
    this.carControls.changeDrivingState('stopping');
    this.phase = 'stay';
  },
  stay: function () {
    this.screenPhase = 'alarm';
    this.carAlarmSound.play();
    const event = new Event('enter');
    // Trigger trice animation
    this.trice.dispatchEvent(event);
    this.phase = 'animation';
  },
  restart: function () {
    this.screenPhase = 'default';
    this.carAlarmSound.pause();
    this.carControls.changeDrivingState('starting');
    this.phase = 'finish';
  },
  finish: function () {
    const bigDoorPosition = this.bigDoor.getAttribute('position');
    if (
      this.movesManager.truncMarker(this.carControls.carMarker) > 660 &&
      this.movesManager.truncMarker(this.carControls.carMarker) < 750 &&
      bigDoorPosition.y < 20
    ) {
      bigDoorPosition.y += 0.04;
      this.bigDoor.setAttribute('position', bigDoorPosition);
    }

    if (
      this.movesManager.truncMarker(this.carControls.carMarker) > 750 &&
      bigDoorPosition.y > 10
    ) {
      bigDoorPosition.y -= 0.04;
      this.bigDoor.setAttribute('position', bigDoorPosition);
    }

    if (this.movesManager.truncMarker(this.carControls.carMarker) > 850) {
      this.carControls.changeDrivingState('stopping');
      if (this.carControls.carSpeed <= 0) {
        this.phase = 'changeScene';
      }
    }
  },
  tick: function () {
    if (!this.carControls) {
      return;
    }
    // Screen phases
    switch (this.screenPhase) {
      case 'galli':
        if (this.movesManager.truncMarker(this.carControls.carMarker) > 0) {
          this.screenDefault.setAttribute('visible', 'false');
          this.screenGalli.setAttribute('visible', 'true');
          this.screenPhase = 'trice';
        }
        break;
      case 'trice':
        if (this.movesManager.truncMarker(this.carControls.carMarker) > 200) {
          this.screenGalli.setAttribute('visible', 'false');
          this.screenTrice.setAttribute('visible', 'true');
          this.screenPhase = 'other';
        }
        break;
      case 'alarm':
        this.screenTrice.setAttribute('visible', 'false');
        this.screenAlarm.setAttribute('visible', 'true');
        this.screenPhase = 'other';
        break;
      case 'default':
        this.screenAlarm.setAttribute('visible', 'false');
        this.screenDefault.setAttribute('visible', 'true');
        this.screenPhase = 'end';
        break;
    }
    // Voice phases
    switch (this.voicePhase) {
      case 'trice1':
        if (this.movesManager.truncMarker(this.carControls.carMarker) > 30) {
          this.voiceTrice1Sound.play();
          this.voicePhase = 'trice2';
        }
        break;
      case 'trice2':
        if (this.movesManager.truncMarker(this.carControls.carMarker) > 550) {
          this.voiceTrice2Sound.play();
          this.voicePhase = 'end';
        }
        break;
    }
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
        this.gateSounds();
        this.finish();
        break;
      case 'changeScene':
        if (!this.sceneChanged) {
          // Destroy and detach all unecessary objets
          // Change scene
          setTimeout(() => {
            window.location.href = 'https://map.prehistoricdomain.com/';
          }, 8000);
          this.system.changeScene('ending', false);
          this.sceneChanged = true;
        }
        break;
    }
  },
});
