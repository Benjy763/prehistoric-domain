AFRAME.registerComponent('button-control', {
  init: function () {
    this.system = document.querySelector('a-scene').systems['game'];
    this.el.addEventListener('hover-start', () => {
      //console.log('test');
    });
  },
});
