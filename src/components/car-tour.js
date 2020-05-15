AFRAME.registerComponent('car-tour', {
  schema: {
    carMarker: { default: 0 },
    carSpeed: { default: 0.0 },
  },
  init: function () {
    // Object shortcut
    this.object = this.el.object3D;
    this.system = document.querySelector('a-scene').systems['game'];
    // Tour Path
    this.curve = new THREE.SplineCurve([
      new THREE.Vector2(18.6, 85),
      new THREE.Vector2(4.6, 47),
      new THREE.Vector2(-4.7, 12.8),
      new THREE.Vector2(-4.7, -18),
      new THREE.Vector2(2.8, -41),
      new THREE.Vector2(30, -94),
    ]);
    this.rotation = this.el.getAttribute('rotation').y;

    this.updateRotation();
  },
  convertPosition: function (position2D) {
    return {
      x: position2D.x,
      y: this.object.position.y,
      z: position2D.y,
    };
  },
  updateRotation: function () {
    const nextMarkerForRotation = 0.0002;
    const newPosition = this.convertPosition(
      this.curve.getPointAt(this.data.carMarker + nextMarkerForRotation)
    );
    this.object.lookAt(newPosition.x, newPosition.y, newPosition.z);
    // Correct rotation with offset
    const rotation = this.el.getAttribute('rotation');
    rotation.y += 88;
    this.el.setAttribute('rotation', rotation);
  },
  tock: function () {
    this.system.log(this.el.getAttribute('rotation').y);

    // Curve movement
    // 0.90 marker is animation ending
    if (this.data.carMarker < 0.9) {
      this.data.carMarker += this.data.carSpeed;
      this.object.position.copy(
        this.convertPosition(this.curve.getPointAt(this.data.carMarker))
      );

      this.updateRotation();
    }
  },
});
