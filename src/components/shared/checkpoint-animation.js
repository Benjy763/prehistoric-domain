AFRAME.registerComponent('checkpoint-animation', {
  schema: {},
  init: function () {
    this.tick = AFRAME.utils.throttleTick(this.tick, 25, this);

    // Objects shortcut
    this.object = this.el.object3D;
    this.rotation = 0;
    this.rotationSpeed = 2;
  },
  tick: function () {
    this.rotation += this.rotationSpeed;
    this.el.setAttribute('rotation', {
      y: this.object.rotation.y + this.rotation,
      ...this.object.rotation,
    });
  },
});
