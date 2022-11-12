AFRAME.registerComponent('custom-hand-control', {
  init: function () {
    this.system = document.querySelector('a-scene').systems['system'];
    this.movesManager =
      document.querySelector('a-scene').systems['movesManager'];

    document.addEventListener('keyup', (e) => {
      if (e.key === 'Enter' || e.keyCode === 13) {
        if (this.movesManager.nextScene) {
          if (this.system.actuelScene === 'home') {
            this.movesManager.savedPosition = {
              scene: this.system.actuelScene,
              x: this.movesManager.getRigPosition().x,
              y: this.movesManager.getRigPosition().y,
            };
          }
          this.system.changeScene(this.movesManager.nextScene);
          this.movesManager.nextScene = null;
        }
      }
    });

    this.el.addEventListener('abuttondown', () => {
      this.movesManager.fixRigPosition();
    });
  },
});
