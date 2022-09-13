AFRAME.registerComponent('custom-hand-control', {
  init: function () {
    this.system = document.querySelector('a-scene').systems['system'];
    this.movesManager =
      document.querySelector('a-scene').systems['movesManager'];

    this.el.addEventListener('abuttondown', () => {
      this.movesManager.fixRigPosition();
    });
  },
});
