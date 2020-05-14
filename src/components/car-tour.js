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
  },
  tock: function () {
    this.system.log(this.data.carMarker);

    // Curve movement
    // 0.90 marker is animation ending
    if (this.data.carMarker < 0.9) {
      this.data.carMarker += this.data.carSpeed;
      this.object.position.x = this.curve.getPointAt(this.data.carMarker).x;
      this.object.position.z = this.curve.getPointAt(this.data.carMarker).y;
    }

    // Car rotation points
    if (this.data.carMarker > 0.33 && this.data.carMarker < 0.35) {
      this.rotation -= 0.06;
      this.el.setAttribute('rotation', { x: 0, y: this.rotation, z: 0 });
    }

    if (this.data.carMarker > 0.46 && this.data.carMarker < 0.48) {
      this.rotation -= 0.08;
      this.el.setAttribute('rotation', { x: 0, y: this.rotation, z: 0 });
    }

    if (this.data.carMarker > 0.57 && this.data.carMarker < 0.63) {
      this.rotation -= 0.08;
      this.el.setAttribute('rotation', { x: 0, y: this.rotation, z: 0 });
    }

    if (this.data.carMarker > 0.7 && this.data.carMarker < 0.73) {
      this.rotation -= 0.035;
      this.el.setAttribute('rotation', { x: 0, y: this.rotation, z: 0 });
    }
  },
});
