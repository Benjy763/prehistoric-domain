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
});

$(document).scroll(function () {
  var y = $(this).scrollTop();
  if (y > 800) {
    $('.fixed-menu').fadeIn();
  } else {
    $('.fixed-menu').fadeOut();
  }
});
