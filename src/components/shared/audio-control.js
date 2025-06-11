AFRAME.registerSystem('audioControl', {
  init: function () {},
  fade({ audio }) {
    const fadeOut = () => {
      if (audio.data.volume > 0.1) {
        audio.data.volume -= 0.1;
        setTimeout(fadeOut, 5);
      } else {
        audio.data.volume = 0;
        audio.stopSound();
        audio.currentTime = 0;
      }
    };
    fadeOut();
  }
});
