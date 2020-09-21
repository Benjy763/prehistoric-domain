AFRAME.registerComponent('raptor-head-animation', {
  schema: {},
  init: function () {
    this.tick = AFRAME.utils.throttleTick(this.tick, 25, this);
    // Objects shortcut
    this.object = this.el.object3D;
    this.system = document.querySelector('a-scene').systems['game'];
    this.car = document.querySelector('#raptor-car');
    this.phase = '';
    this.rotation;

    // Sound
    this.bendupAudio;
    this.benddownAudio;
    this.headAnimationAudio;

    // Start tour listener
    this.el.addEventListener(
      'enter',
      () => {
        this.bendupAudio = this.el.components['sound__bendup'];
        this.benddownAudio = this.el.components['sound__benddown'];
        this.headAnimationAudio = this.el.components['sound__headanimation'];
        setTimeout(() => {
          this.el.setAttribute('animation-mixer', {
            clip: 'Take 01',
            timeScale: 1,
          });
          setTimeout(() => {
            this.el.setAttribute('animation-mixer', {
              clip: 'Take 01',
              timeScale: 0,
            });
          }, 500);
          this.phase = 'bendup';
          this.bendupAudio.playSound();
        }, 2000);
      },
      false
    );
  },
  // --- Phase functions ---
  bendup: function () {
    this.rotation = this.el.getAttribute('rotation');
    if (this.rotation.x < -2) {
      this.rotation.x += 0.5;
      this.el.setAttribute('rotation', this.rotation);
    } else if (this.rotation.x < 0) {
      this.rotation.x += 0.2;
      this.el.setAttribute('rotation', this.rotation);
    } else {
      this.el.setAttribute('animation-mixer', {
        clip: 'Take 01',
        timeScale: 1,
      });
      this.headAnimationAudio.playSound();
      this.phase = 'head';
      this.el.addEventListener('sound-ended', (e) => {
        if (e.detail.id === 'headanimation') {
          this.benddownAudio.playSound();
          this.phase = 'bendown';
        }
      });
    }
  },
  bendown: function () {
    this.rotation = this.el.getAttribute('rotation');
    if (this.rotation.x > 0) {
      this.rotation.x -= 0.2;
      this.el.setAttribute('rotation', this.rotation);
    } else if (this.rotation.x > -35) {
      this.rotation.x -= 0.5;
      this.el.setAttribute('rotation', this.rotation);
    } else {
      setTimeout(() => {
        const event = new Event('restart');
        this.car.dispatchEvent(event);
      }, 8000);
      this.phase = 'leave';
    }
  },
  tick: function () {
    // Animation steps
    switch (this.phase) {
      case 'bendup':
        this.bendup();
        break;
      case 'bendown':
        this.bendown();
        break;
    }
  },
});
