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
    } else {
      $('#ticket-error').css('display', 'block');
    }
  });
});
