// İletişim formu: mesajı hazırlayıp WhatsApp'ı açar. Site CSP'si satır içi betiğe izin vermediği için ayrı dosyada.
document.getElementById('contactForm').addEventListener('submit', function (e) {
  e.preventDefault();
  var email = document.getElementById('cEmail').value.trim();
  var text = 'Merhaba, iletişim formundan yazıyorum.'
    + '\nAd Soyad: ' + document.getElementById('cName').value.trim()
    + '\nTelefon: ' + document.getElementById('cPhone').value.trim()
    + (email ? '\nE-posta: ' + email : '')
    + '\nKonu: ' + document.getElementById('cSubject').value
    + '\nMesaj: ' + document.getElementById('cMessage').value.trim();
  var url = 'https://wa.me/905468445576?text=' + encodeURIComponent(text);

  this.style.display = 'none';
  document.getElementById('contactSuccess').style.display = 'block';
  if (!window.open(url, '_blank')) window.location.href = url;
});
