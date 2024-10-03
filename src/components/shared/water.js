import { Water } from 'three/examples/jsm/objects/Water2.js'; // Ensure you import the Water class

AFRAME.registerComponent('water', {
  schema: {
    scale: { default: 1 },
    flowspeed: { default: 0.01 }
  },
  init: function () {
    let mesh;
    let waterObj;
    this.el.addEventListener('loaded', (evt) => {
      const textureLoader = new THREE.TextureLoader();
      const mesh = this.el.getObject3D('mesh');
      waterObj = new Water(new THREE.BufferGeometry().copy(mesh.geometry), {
        color: '#aaa',
        scale: this.data.scale,
        flowDirection: new THREE.Vector3(-1, 0),
        flowSpeed: this.data.flowspeed,
        textureWidth: 1024,
        textureHeight: 1024,
        reflectivity: 0.001,
        normalMap0: textureLoader.load('/assets/images/water-texture-1.jpg'),
        normalMap1: textureLoader.load('/assets/images/water-texture-2.jpg')
      });
      mesh.visible = false;
      // attach just for the sake of attaching, it could be 'add' as well
      waterObj.position.copy(this.el.object3D.position);
      waterObj.rotation.copy(this.el.object3D.rotation);
      this.el.object3D.attach(waterObj);
    });
  }
});
