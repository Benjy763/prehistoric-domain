import { Water } from 'three/examples/jsm/objects/Water2.js';

AFRAME.registerComponent('water', {
  schema: { scale: { default: 1 }, flowspeed: { default: 0.01 } },
  init: function () {
    this.el.addEventListener('loaded', () => {
      const loader = new THREE.TextureLoader();
      const mesh = this.el.getObject3D('mesh');
      if (!mesh || !mesh.geometry) return;

      const waterObj = new Water(
        new THREE.BufferGeometry().copy(mesh.geometry),
        {
          color: '#aaa',
          scale: this.data.scale,
          flowDirection: new THREE.Vector2(-1, 0),
          flowSpeed: this.data.flowspeed,
          textureWidth: 1024,
          textureHeight: 1024,
          reflectivity: 0.001,
          normalMap0: loader.load('/assets/images/water-texture-1.jpg'),
          normalMap1: loader.load('/assets/images/water-texture-2.jpg')
        }
      );

      mesh.visible = false;

      // 👉 ONE-LINER FIX: Clear real reflection map after creation
      waterObj.material.uniforms.tReflectionMap.value =
        waterObj.material.uniforms.tReflectionMap.value.clone();

      waterObj.position.copy(mesh.position);
      waterObj.rotation.copy(mesh.rotation);
      waterObj.scale.copy(mesh.scale);
      this.el.object3D.add(waterObj);
    });
  }
});
