AFRAME.registerComponent('button-control', {
  init: function () {
    this.system = document.querySelector('a-scene').systems['game'];
    this.el.addEventListener('hover-start', function () {
      console.log('test');
      this.system.log('coucou');
    });
    this.el.addEventListener('hover-start', function () {
      this.system.log('');
    });
  },
});
