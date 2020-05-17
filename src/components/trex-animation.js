AFRAME.registerComponent('trex-animation', {
  schema: {},
  init: function () {
    let self = this;

    // Sound
    this.soundMixing2SoundPlaying = false;
    this.roarSoundPlaying = false;
    this.soundMixing2Audio = document.getElementById('sound-mixing-2');
    this.roarAudio = document.getElementById('roar');

    // Start tour listener
    this.el.addEventListener(
      'enter',
      () => {
        self.soundMixing2Audio.play();
      },
      false
    );
  },
});
