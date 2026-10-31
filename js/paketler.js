// Paketler sayfası. Site CSP'si satır içi betiğe izin vermediği için ayrı dosyada.
(function () {
  var paketSel = document.getElementById('sPaket');
  var uyari = document.getElementById('kontrolUyari');
  var onayBox = document.getElementById('kontrolOnay');

  function updatePrice() {
    var opt = paketSel.options[paketSel.selectedIndex];
    var warn = opt && opt.getAttribute('data-warn');
    if (warn === '1') {
      uyari.style.display = 'block';
    } else {
      uyari.style.display = 'none';
      if (onayBox) onayBox.checked = false;
    }
  }

  function prefillPaket(paketAdi) {
    if (!paketSel) return;
    for (var i = 0; i < paketSel.options.length; i++) {
      if (paketSel.options[i].value === paketAdi) {
        paketSel.selectedIndex = i;
        updatePrice();
        break;
      }
    }
  }

  document.getElementById('siparisForm').addEventListener('submit', function (e) {
    e.preventDefault();
    var paket = paketSel.value;
    var opt = paketSel.options[paketSel.selectedIndex];
    var isKontrol = opt && opt.getAttribute('data-warn') === '1';

    if (isKontrol && !document.getElementById('kontrolOnay').checked) {
      alert('Tek Defalık Kontrol için kırmızı kutudaki şartları onaylamanız gerekir.');
      return;
    }

    var name = document.getElementById('sName').value.trim();
    var phone = document.getElementById('sPhone').value.trim();
    var email = document.getElementById('sEmail').value.trim();
    var website = document.getElementById('sWebsite').value.trim();
    var note = document.getElementById('sNote').value.trim();

    var text = 'Merhaba, fiyat teklifi almak istiyorum.'
      + '\nHizmet: ' + paket
      + '\nAd Soyad / Firma: ' + name
      + '\nTelefon: ' + phone
      + '\nE-posta: ' + email
      + (website ? '\nWeb sitesi: ' + website : '')
      + (note ? '\nNot: ' + note : '')
      + (isKontrol ? '\nTek Defalık Kontrol şartlarını onayladım.' : '');
    var url = 'https://wa.me/905468445576?text=' + encodeURIComponent(text);

    this.style.display = 'none';
    var successEl = document.getElementById('siparisSuccess');
    document.getElementById('siparisSuccessText').textContent =
      ' Sayın ' + name + ', ' + paket + ' talebiniz hazır; WhatsApp\'ta gönder tuşuna basmanız yeterli.';
    successEl.style.display = 'block';
    if (!window.open(url, '_blank')) window.location.href = url;
  });

  function copyIban(btn) {
    var text = 'TR98 0004 6003 3288 8000 3208 88';
    var original = btn.textContent;
    var done = function () {
      btn.textContent = 'Kopyalandı ✓';
      btn.style.background = 'var(--success)';
      btn.style.color = 'var(--white)';
      setTimeout(function () {
        btn.textContent = original;
        btn.style.background = 'var(--gold)';
        btn.style.color = 'var(--navy)';
      }, 2000);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, function () { fallback(); done(); });
    } else {
      fallback(); done();
    }
    function fallback() {
      var ta = document.createElement('textarea');
      ta.value = text; document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); } catch (e) {}
      document.body.removeChild(ta);
    }
  }

  paketSel.addEventListener('change', updatePrice);
  document.querySelectorAll('[data-paket]').forEach(function (a) {
    a.addEventListener('click', function () { prefillPaket(a.getAttribute('data-paket')); });
  });
  document.getElementById('ibanKopyala').addEventListener('click', function () { copyIban(this); });
})();
