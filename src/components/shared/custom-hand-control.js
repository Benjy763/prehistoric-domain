AFRAME.registerComponent('custom-hand-control', {
  init: function () {
    this.system = document.querySelector('a-scene').systems['system'];
    this.movesManager =
      document.querySelector('a-scene').systems['movesManager'];

    document.addEventListener('keyup', (e) => {
      if (e.key === 'Enter' || e.keyCode === 13) {
        if (this.movesManager.nextScene) {
          console.log(this.movesManager.nextScene);
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
