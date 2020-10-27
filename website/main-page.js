let $ = require('jquery');
const validValues = [9392, 1235, 9658, 5132, 1125, 6589, 1456, 4574, 9257, 6398];
let turnonAudio;
let runpcAudio;
let trexAudio;
let soundtrackAudio;
let statusInterval;


$(document).ready(function () {
  $('.main-page-wrapper').scrollTop(0);
  // Get assets
  turnonAudio = document.getElementById('turnon-sound');
  runpcAudio = document.getElementById('runpc-sound');
  trexAudio = document.getElementById('trex-sound');
  soundtrackAudio = document.getElementById('soundtrack-sound');
  labAudio = document.getElementById('lab-sound');

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
    resetAnimations();
    $('.main-park-open').addClass('slide');
    $('.jp-icon-large').addClass('opacity');
    soundtrackAudio.play();
  });

  $('#jt-link').on('click', () => {
    resetAnimations();
    $('.jt-text').addClass('slide');
    $('.jt-preview').addClass('opacity');
    trexAudio.play();
  });

  $('#map-link').on('click', () => {
    resetAnimations();
    $('#map-section').addClass('screen');
    turnonAudio.play();
    runpcAudio.play();
  });

  $('#credits-link').on('click', () => {
    resetAnimations();
    labAudio.play();
  });
}

function resetAnimations() {
  // Animations
  $('.main-park-open').removeClass('slide');
  $('.jp-icon-large').removeClass('opacity');
  $('.jt-text.slide').removeClass('slide');
  $('.jt-preview').removeClass('opacity');
  $('#map-section').removeClass('screen');

  // Sounds
  labAudio.pause();
  turnonAudio.pause();
  runpcAudio.pause();
  trexAudio.pause();
  soundtrackAudio.pause();
  labAudio.currentTime = 0;
  turnonAudio.currentTime = 0;
  runpcAudio.currentTime = 0;
  trexAudio.currentTime = 0;
  soundtrackAudio.currentTime = 0;
}

function initTicketMecanisms() {
  // Add tickets mecanims
  $('#get-ticket').on('click', () => {
    const randomTicket = Math.floor(Math.random() * 9) + 0;
    window.open(`./images/ticket-${validValues[randomTicket]}.jpg`);
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
    localStorage.setItem('language', 'en');
    openGame();
  });

  $('#language-fr').on('click', () => {
    localStorage.setItem('language', 'fr');
    openGame();
  });
}

function openGame() {
  clearInterval(statusInterval);
  // Stop sounds
  turnonAudio.pause();
  runpcAudio.pause();
  trexAudio.pause();
  soundtrackAudio.pause();
  localStorage.setItem('from-index', true);
  window.location.href = 'https://' + window.location.host + "/experience/";
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
