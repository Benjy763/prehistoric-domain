AFRAME.registerComponent('car-tour', {
  init: function () {
    this.object = this.el.object3D;
    this.system = document.querySelector('a-scene').systems['game'];
    this.yrotation = 0;
    // When
    this.rotationMarker = -23;
    this.carSpeed = 0.02;
    this.cameraPositionOffset = {
      x: -0.7,
      z: -0.35,
    };
  },
  tick: function () {
    // Camera repositioning
    document.querySelector('#rig').setAttribute('position', {
      x: this.el.object3D.position.x + this.cameraPositionOffset.x,
      y: 0.2,
      z: this.el.object3D.position.z + this.cameraPositionOffset.z,
    });

    //this.system.log(this.object.position.z);
  },
});
