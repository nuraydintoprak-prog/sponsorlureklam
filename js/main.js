// Sponsorlu Reklam — main.js

// Mobil menü
document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      nav.classList.toggle('is-open');
    });
  }

  // FAQ akordeon
  document.querySelectorAll('.faq-q').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var ans = btn.nextElementSibling;
      btn.classList.toggle('open');
      if (ans) ans.classList.toggle('open');
    });
  });

  // Aktif nav linki
  var path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav a').forEach(function (a) {
    var href = a.getAttribute('href');
    if (!href) return;
    var hrefFile = href.split('/').pop();
    if (hrefFile === path) a.classList.add('active');
  });

  // Yıl bilgisi (footer)
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});
