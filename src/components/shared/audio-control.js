AFRAME.registerSystem('audioControl', {
  init: function () {},
  fade({ audio }) {
    if (audio.volume > 0.005) {
      audio.volume -= 0.005;
      fadeTimer = setTimeout(aud_fade, 5);
    } else {
      audio.volume = 0;
      audio.stopSound();
      audio.currentTime = 0;
    }
  },
});
