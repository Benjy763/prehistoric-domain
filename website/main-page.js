let $ = require('jquery');
const validValues = [9391];
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
  window.location.href = window.location.href + "experience/vr.html";
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
