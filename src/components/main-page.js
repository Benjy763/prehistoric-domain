let $ = require('jquery');
const validValues = [6971, 6972, 6973, 6974, 6975];
let turnonAudio;
let runpcAudio;
let trexAudio;
let soundtrackAudio;

$(document).ready(function () {
  // Get assets
  turnonAudio = document.getElementById('turnon-sound');
  runpcAudio = document.getElementById('runpc-sound');
  trexAudio = document.getElementById('trex-sound');
  soundtrackAudio = document.getElementById('soundtrack-sound');

  initLoadMecanisms();
  initScrollSmoothEffect();
  initTicketMecanisms();
  initLanguageMecanisms();
  initSectionsAnimations();
});

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
    const randomTicket = Math.floor(Math.random() * 5) + 6971;
    window.open(`./build/images/ticket-${randomTicket}.jpg`);
  });

  $('#use-ticket').on('click', () => {
    if (validValues.includes(Number($('#ticket-value').val()))) {
      $('.main-choices').css('display', 'none');
      $('.language-wrapper').css('display', 'block');
      initLanguageMecanisms();
    } else {
      $('#ticket-error').css('display', 'block');
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

function initLoadMecanisms() {
  $('.main-page-wrapper').scrollTop(0);
  // Debug
  // $('.loading-website').css('display', 'none');
  // $('#main-page').css('display', 'none');
  // $('#static-loading').css('display', 'flex');
  // $('#main-scene-wrapper').css('display', 'block');

  // Loading mecanisms
  $('.loading-website .title').css('opacity', '1');
  // setTimeout(() => {
  //   $('.loading-website .subtitle').css('opacity', '1');
  // }, 1500);
  setTimeout(() => {
    $('.loading-website .title').css('opacity', '0');
    // $('.loading-website .subtitle').css('opacity', '0');
  }, 3000);
  setTimeout(() => {
    $('.loading-website').css('display', 'none');
    $('#main-section').css('display', 'flex');
    soundtrackAudio.play();
  }, 4000);
}
