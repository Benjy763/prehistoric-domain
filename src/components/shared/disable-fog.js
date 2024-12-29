AFRAME.registerComponent('disable-fog', {
  init: function () {
    this.el.addEventListener('model-loaded', () => {
      const object3D = this.el.getObject3D('mesh');
      if (object3D) {
        object3D.traverse((node) => {
          if (node.isMesh) {
            node.material.fog = false; // Disable fog on the material
          }
        });
      }
    });
  }
});
