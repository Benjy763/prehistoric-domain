AFRAME.registerComponent('smoke-effect', {
  init: function () {
    // Basic setup
    this.clock = new THREE.Clock();
    this.smokeCloud = [];
    this.numParticles = 20;
    this.isBlowing = false;
    this.delta = 0;

    // Object
    const object = this.el.object3D;

    // Smoke Texture
    THREE.ImageUtils.crossOrigin = '';
    const smokeImages = '/assets/images/smoke-element.png';
    const smokeTexture = THREE.ImageUtils.loadTexture(smokeImages);
    const smokeMaterial = new THREE.MeshLambertMaterial({
      color: 0x8c2323,
      emissive: 0x000000,
      map: smokeTexture,
      transparent: true,
      opacity: 0.7,
      depthWrite: false,
      depthTest: true,
      // blending: THREE.CustomBlending,
    });

    // Smoke Particles
    const smokeGeo = new THREE.PlaneGeometry(1, 1);
    const bounds = { x: 1, y: 1, z: 1 };

    for (let p = 0; p < this.numParticles; p++) {
      const particle = new THREE.Mesh(smokeGeo, smokeMaterial);
      particle.position.set(
        Math.random() * bounds.x - bounds.x * 0.5,
        Math.random() * bounds.y - bounds.y * 0.5,
        Math.random() * bounds.z - bounds.z * 0.6
      );
      particle.rotation.z = Math.random() * 360;
      particle.renderOrder = p + 1;
      object.add(particle);
      this.smokeCloud.push(particle);
    }

    // setTimeout(() => {
    //   if (!this.isBlowing) {
    //     this.isBlowing = true;
    //   }
    // }, 15000);
  },

  tick: function () {
    this.delta = this.clock.getDelta();

    if (this.isBlowing) {
      this.el.object3D.position.x -= 0.005;
    }

    // Rotate Smoke
    for (let i = 0; i < this.numParticles; i++) {
      const smoke = this.smokeCloud[i];
      smoke.rotation.z -= this.delta * 0.4;
      if (this.isBlowing) {
        if (smoke.material.opacity > 0) {
          smoke.material.opacity -= 0.00005;
        }
      }
    }
  },
});
