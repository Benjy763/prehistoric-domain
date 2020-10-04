let $ = require('jquery');
const validValues = [6971, 6972, 6973, 6974, 6975];
$(document).ready(function () {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();

      document.querySelector(this.getAttribute('href')).scrollIntoView({
        behavior: 'smooth',
      });
    });
  });

  $('#get-ticket').on('click', () => {
    const randomTicket = Math.floor(Math.random() * 5) + 6971;
    window.open(`./build/images/ticket-${randomTicket}.jpg`);
  });

  $('#use-ticket').on('click', () => {
    if (validValues.includes(Number($('#ticket-value').val()))) {
      $('#ticket-error').css('display', 'none');
      $('#main-page').css('display', 'none');
      $('#static-loading').css('display', 'flex');
      $('#main-scene-wrapper').css('display', 'block');
    } else {
      $('#ticket-error').css('display', 'block');
    }
  });

  $('#main-link').on('click', () => {
    $('.jt-text.slide').removeClass('slide');
    $('.jt-preview.opacity').removeClass('opacity');

    $('.main-park-open').addClass('slide');
    $('.jp-icon-large').addClass('opacity');
  });

  $('#jt-link').on('click', () => {
    $('.main-park-open.slide').removeClass('slide');
    $('.jp-icon-large.opacity').removeClass('opacity');

    $('.jt-text').addClass('slide');
    $('.jt-preview').addClass('opacity');
  });

  $('#map-link').on('click', () => {
    $('.main-park-open.slide').removeClass('slide');
    $('.jp-icon-large.opacity').removeClass('opacity');
    $('.jt-text.slide').removeClass('slide');
    $('.jt-preview.opacity').removeClass('opacity');
  });
});
