AFRAME.registerComponent('raptor-head-animation', {
  schema: {},
  init: function () {
    // Objects shortcut
    this.object = this.el.object3D;
    this.system = document.querySelector('a-scene').systems['game'];
    this.raptorFull = document.querySelector('#raptor');
    this.phase = '';
    this.rotation;

    // Sound

    // Start tour listener
    this.el.addEventListener(
      'enter',
      () => {
        this.el.setAttribute('animation-mixer', {
          clip: 'Take 01',
          timeScale: 1,
        });
        setTimeout(() => {
          this.phase = 'enter';
        }, 2000);
      },
      false
    );
  },
  // --- Phase functions ---
  enter: function () {
    this.rotation = this.el.getAttribute('rotation');
    if (this.rotation.x < -2) {
      this.rotation.x += 0.5;
      this.el.setAttribute('rotation', this.rotation);
    } else if (this.rotation.x < 0) {
      this.rotation.x += 0.2;
      this.el.setAttribute('rotation', this.rotation);
    } else {
      const event = new Event('enter');
      this.raptorFull.dispatchEvent(event);
      this.phase = 'exit';
    }
  },
  tock: function () {
    // Animation steps
    switch (this.phase) {
      case 'enter':
        this.enter();
        break;
    }
  },
});
