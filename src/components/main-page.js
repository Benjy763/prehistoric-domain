let $ = require('jquery');
const validValues = [9391];
let turnonAudio;
let runpcAudio;
let trexAudio;
let soundtrackAudio;
let statusInterval;
let models = {
  "trex-roar": "./build/sounds/trex/roar-2.mp3",
  "trex-foot-step": "./build/sounds/trex/foot-step-3.mp3",
  "trex-leave": "./build/sounds/trex/leave-2.mp3",
  "brachio-step": "./build/sounds/brachio/brachio-step.mp3",
  "brachio-roar": "./build/sounds/brachio/brachio-roar.mp3",
  "dilo-roar": "./build/sounds/dilo/dilo-roar.mp3",
  "goat-roar": "./build/sounds/goat/goat.mp3",
  "goat-elevator": "./build/sounds/goat/elevator.mp3",
  "raptor-benddown": "./build/sounds/raptor/benddown.mp3",
  "raptor-bendup": "./build/sounds/raptor/bendup.mp3",
  "raptor-body-roar": "./build/sounds/raptor/body-roar.mp3",
  "raptor-far-roar": "./build/sounds/raptor/far-roar.mp3",
  "raptor-head-animation": "./build/sounds/raptor/head-animation.mp3",
  "raptor-ambiant": "./build/sounds/raptor/ambiant.mp3",
  "trice-agressive": "./build/sounds/trice/agressive.mp3",
  "trice-roar1": "./build/sounds/trice/roar1.mp3",
  "trice-roar2": "./build/sounds/trice/roar2.mp3",
  "trice-run": "./build/sounds/trice/run.mp3",
  "trice-snoring": "./build/sounds/trice/snoring.mp3",
  "car-asset": "./build/models/objects/car/car.glb",
  "grass-asset": "./build/models/environment/grass/scene.gltf",
  "building-asset": "./build/models/environment/building/scene.gltf",
  "small-fence-asset": "./build/models/environment/small-fence/small-fence.glb",
  "spot-asset": "./build/models/environment/spot/spot.gltf",
  "gate-asset": "./build/models/environment/gate/gate.glb",
  "sign-asset": "./build/models/environment/sign/sign.glb",
  "hut-asset": "./build/models/environment/hut/hut.glb",
  "tunnel-asset": "./build/models/environment/tunnel/tunnel.gltf",
  "electric-fence-asset": "./build/models/environment/electric-fence/electric-fence.glb",
  "electric-fence-dilo-asset": "./build/models/environment/electric-fence/electric-fence-dilo.glb",
  "double-rock-asset": "./build/models/environment/double-rock/double-rock.gltf",
  "palms-asset": "./build/models/environment/palms/palms.gltf",
  "simple-plant-asset": "./build/models/environment/simple-plant/simple-plant.gltf",
  "tropical-plant-asset": "./build/models/environment/tropical-plant/tropical-plant.gltf",
  "goat-asset": "./build/models/dinosaurs/goat/scene.gltf",
  "trex-asset": "./build/models/dinosaurs/trex/trex.glb",
  "brachio-asset": "./build/models/dinosaurs/brachio/brachio.gltf",
  "raptor-head-asset": "./build/models/dinosaurs/raptor/head/scene.gltf",
  "raptor-asset": "./build/models/dinosaurs/raptor/full/scene.gltf",
  "trice-asset": "./build/models/dinosaurs/trice/scene.gltf"
}

$(document).ready(function () {
  $('.main-page-wrapper').scrollTop(0);
  // Get assets
  turnonAudio = document.getElementById('turnon-sound');
  runpcAudio = document.getElementById('runpc-sound');
  trexAudio = document.getElementById('trex-sound');
  soundtrackAudio = document.getElementById('soundtrack-sound');

  //debug();

  initLoadMecanisms();
  initScrollSmoothEffect();
  initTicketMecanisms();
  initLanguageMecanisms();
  initSectionsAnimations();

  statusInterval = setInterval(() => {
    checkVrStatus();
  }, 3000);
});

function lazyLoadModels() {
  Object.keys(models).forEach(id => {
    const d = new Date();
    $(`#${id}`).attr('src', models[id]+"?"+d.getTime());
  })
}

function checkVrStatus() {
  const status = AFRAME.utils.device.checkHeadsetConnected();
  if (status) {
    $('.vr-off').css('display', 'none');
    $('.vr-on').css('display', 'flex');
  } else {
    $('.vr-on').css('display', 'none');
    $('.vr-off').css('display', 'flex');
  }
}

function initSectionsAnimations() {
  $('#main-link').on('click', () => {
    // Animations
    $('.jt-text').removeClass('slide');
    $('.jt-preview').removeClass('opacity');
    $('#map-section').removeClass('screen');

    $('.main-park-open').addClass('slide');
    $('.jp-icon-large').addClass('opacity');

    // Sounds
    turnonAudio.pause();
    runpcAudio.pause();
    trexAudio.pause();
    turnonAudio.currentTime = 0;
    runpcAudio.currentTime = 0;
    trexAudio.currentTime = 0;

    soundtrackAudio.play();
  });

  $('#jt-link').on('click', () => {
    // Animations
    $('.main-park-open').removeClass('slide');
    $('.jp-icon-large').removeClass('opacity');
    $('#map-section').removeClass('screen');

    $('.jt-text').addClass('slide');
    $('.jt-preview').addClass('opacity');

    // Sounds
    turnonAudio.pause();
    runpcAudio.pause();
    soundtrackAudio.pause();
    turnonAudio.currentTime = 0;
    runpcAudio.currentTime = 0;
    soundtrackAudio.currentTime = 0;

    trexAudio.play();
  });

  $('#map-link').on('click', () => {
    // Animations
    $('.main-park-open').removeClass('slide');
    $('.jp-icon-large').removeClass('opacity');
    $('.jt-text.slide').removeClass('slide');
    $('.jt-preview').removeClass('opacity');

    $('#map-section').addClass('screen');

    // Sounds
    trexAudio.pause();
    soundtrackAudio.pause();
    trexAudio.currentTime = 0;
    soundtrackAudio.currentTime = 0;

    turnonAudio.play();
    runpcAudio.play();
  });
}

function initTicketMecanisms() {
  // Add tickets mecanims
  $('#get-ticket').on('click', () => {
    const randomTicket = Math.floor(Math.random() * 5) + 9391;
    window.open(`./build/images/ticket-${randomTicket}.jpg`);
  });

  $('#use-ticket').on('click', () => {
    const status = AFRAME.utils.device.checkHeadsetConnected();
    if (status && validValues.includes(Number($('#ticket-value').val()))) {
      $('.main-choices').css('display', 'none');
      $('.language-wrapper').css('display', 'block');
      initLanguageMecanisms();
    } else {
      if (status) {
        $('#vr-error').css('display', 'none');
        $('#ticket-error').css('display', 'block');
      } else {
        $('#ticket-error').css('display', 'none');
        $('#vr-error').css('display', 'block');
      }
    }
  });
}

function initLanguageMecanisms() {
  // Add Languages mecanims
  $('#language-en').on('click', () => {
    window.language = 'en';
    openGame();
  });

  $('#language-fr').on('click', () => {
    window.language = 'fr';
    openGame();
  });
}

function openGame() {
  lazyLoadModels();
  clearInterval(statusInterval);
  $('#main-page').css('display', 'none');
  $('#static-loading').css('display', 'flex');
  $('#main-scene-wrapper').css('display', 'block');
  // Stop sounds
  turnonAudio.pause();
  runpcAudio.pause();
  trexAudio.pause();
  soundtrackAudio.pause();
}

function initScrollSmoothEffect() {
  // Add scroll smooth effect
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();

      document.querySelector(this.getAttribute('href')).scrollIntoView({
        behavior: 'smooth',
      });
    });
  });
}

function debug() {
  // Debug
  $('.loading-website').css('display', 'none');
  $('#main-page').css('display', 'none');
  $('#static-loading').css('display', 'flex');
  $('#main-scene-wrapper').css('display', 'block');
}

function initLoadMecanisms() {
  $('#enter-xp').on('click', () => {
    soundtrackAudio.play();
    $('.loading-website').css('display', 'none');
    $('#main-section').css('display', 'flex');
  });
}
