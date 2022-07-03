AFRAME.registerComponent('water', {
  init: function () {
    let mesh;
    let waterObj;
    this.el.addEventListener('loaded', (evt) => {
      const textureLoader = new THREE.TextureLoader();
      const mesh = this.el.getObject3D('mesh');
      waterObj = new THREE.Water(
        new THREE.BufferGeometry().copy(mesh.geometry),
        {
          color: '#ccc',
          scale: 1,
          flowDirection: new THREE.Vector2(-1, 0),
          flowSpeed: 0.01,
          textureWidth: 1024,
          textureHeight: 1024,
          reflectivity: 0.001,
          normalMap0: textureLoader.load('/assets/images/water-texture-1.jpg'),
          normalMap1: textureLoader.load('/assets/images/water-texture-2.jpg'),
        }
      );
      mesh.visible = false;
      // attach just for the sake of attaching, it could be 'add' as well
      waterObj.position.copy(this.el.object3D.position);
      waterObj.rotation.copy(this.el.object3D.rotation);
      this.el.object3D.attach(waterObj);
    });
  },
});
