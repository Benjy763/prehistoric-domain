AFRAME.registerComponent('force-transparent', {
  init: function () {
    this.el.addEventListener('model-loaded', () => {
      // Only apply in VR mode
      if (!AFRAME.utils.device.checkHeadsetConnected()) return;

      const mesh = this.el.getObject3D('mesh');
      if (!mesh) return;

      mesh.traverse((node) => {
        if (!node.isMesh) return;

        if (node.material) {
          node.material.transparent = true;
          node.material.depthWrite = false; // ⚠️ keys to fix artifacts
          node.renderOrder = 999; // Be sure to be the last
          node.material.needsUpdate = true;
        }
      });
    });
  }
});
