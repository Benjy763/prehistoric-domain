let $ = require('jquery');
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
});
