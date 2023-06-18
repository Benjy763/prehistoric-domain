AFRAME.registerComponent('custom-hand-control', {
  init: function () {
    this.system = document.querySelector('a-scene').systems['system'];
    this.movesManager =
      document.querySelector('a-scene').systems['movesManager'];

    document.addEventListener('keyup', (e) => {
      if (e.key === 'Enter' || e.keyCode === 13) {
        this.manageChangingScene();
      }
    });

    this.el.addEventListener('triggerdown', () => {
      this.manageChangingScene();
    });

    this.el.addEventListener('abuttondown', () => {
      this.movesManager.fixRigPosition();
    });
  },
  clearCache: function () {
    const disposeList = document.querySelectorAll('.dispose');
    const disposeArray = [...disposeList];
    disposeArray.forEach((el) => this.disposeObject3D(el.getObject3D('mesh')));
    AFRAME.scenes[0].systems.material.clearTextureCache();
    AFRAME.scenes[0].systems.geometry.clearCache();
  },
  disposeObject3D: function (object) {
    if (!object) {
      return;
    }
    object.traverse((obj) => {
      if (obj.material) {
        obj.material.dispose();
        if (obj.material.map) {
          obj.material.map.dispose();
        }
        if (obj.material.lightMap) {
          obj.material.lightMap.dispose();
        }
        if (obj.material.aoMap) {
          obj.material.aoMap.dispose();
        }
        if (obj.material.emissiveMap) {
          obj.material.emissiveMap.dispose();
        }
        if (obj.material.bumpMap) {
          obj.material.bumpMap.dispose();
        }
        if (obj.material.normalMap) {
          obj.material.normalMap.dispose();
        }
        if (obj.material.displacementMap) {
          obj.material.displacementMap.dispose();
        }
        if (obj.material.roughnessMap) {
          obj.material.roughnessMap.dispose();
        }
        if (obj.material.metalnessMap) {
          obj.material.metalnessMap.dispose();
        }
        if (obj.material.alphaMap) {
          obj.material.alphaMap.dispose();
        }
      }
      if (obj.geometry) {
        obj.geometry.dispose();
      }
    });
  },
  manageChangingScene() {
    if (this.movesManager.nextScene) {
      if (this.system.actuelScene === 'home') {
        this.movesManager.savedPosition = {
          scene: this.system.actuelScene,
          x: this.movesManager.getRigPosition().x,
          y: this.movesManager.getRigPosition().y,
        };
      }
      if (this.movesManager.nextScene === 'shopmd') {
        window.location.href = 'https://www.mysterydino.com/';
        return;
      }

      if (this.movesManager.nextScene === 'ending') {
        this.system.changeEndingScene();
        this.movesManager.nextScene = null;
        return;
      }
      this.clearCache();
      this.system.changeScene(this.movesManager.nextScene);
      this.movesManager.nextScene = null;
    }
  },
});
