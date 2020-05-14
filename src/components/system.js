AFRAME.registerSystem('game', {
  schema: {},
  init: function () {},
  log: function (text) {
    document
      .querySelector('#log')
      .setAttribute('text', { value: text, color: 'red', width: 0.5 });
  },
});
