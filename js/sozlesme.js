// Online sözleşme imzalama. Site CSP'si satır içi betiğe ve dış betiğe izin vermediği için kütüphaneler js/vendor altında.
(function () {
  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }
  ready(function () {
    var canvas = document.getElementById('sigPad');
    if (!canvas || typeof SignaturePad === 'undefined') return;

    var sigPadWrap = document.getElementById('sigPadWrap');
    var sigClearBtn = document.getElementById('sigClearBtn');
    var form = document.getElementById('signForm');
    var statusEl = document.getElementById('signStatus');
    var successEl = document.getElementById('signSuccess');
    var submitBtn = document.getElementById('signSubmit');
    var waBtn = document.getElementById('waSendBtn');
    var signAgainBtn = document.getElementById('signAgainBtn');
    var pdfRender = document.getElementById('pdfRender');

    var signaturePad = new SignaturePad(canvas, {
      penColor: '#0a2540',
      backgroundColor: 'rgba(255,255,255,0)',
      minWidth: 0.7,
      maxWidth: 2.2
    });

    function resizeCanvas() {
      var ratio = Math.max(window.devicePixelRatio || 1, 1);
      var data = signaturePad.toData();
      canvas.width = canvas.offsetWidth * ratio;
      canvas.height = canvas.offsetHeight * ratio;
      canvas.getContext('2d').scale(ratio, ratio);
      signaturePad.clear();
      if (data && data.length) signaturePad.fromData(data);
      else sigPadWrap.classList.remove('has-ink');
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    signaturePad.addEventListener('beginStroke', function () {
      sigPadWrap.classList.add('has-ink');
    });

    sigClearBtn.addEventListener('click', function () {
      signaturePad.clear();
      sigPadWrap.classList.remove('has-ink');
    });

    function showStatus(msg, type) {
      statusEl.className = 'sign-status is-' + type;
      statusEl.textContent = msg;
    }
    function clearStatus() {
      statusEl.className = 'sign-status';
      statusEl.textContent = '';
    }

    function fetchIp() {
      return new Promise(function (resolve) {
        var done = false;
        var t = setTimeout(function () { if (!done) { done = true; resolve('Belirlenemedi'); } }, 2500);
        fetch('/cdn-cgi/trace')
          .then(function (r) { return r.text(); })
          .then(function (s) {
            var m = s.match(/^ip=(.+)$/m);
            if (!done) { done = true; clearTimeout(t); resolve(m ? m[1] : 'Belirlenemedi'); }
          })
          .catch(function () { if (!done) { done = true; clearTimeout(t); resolve('Belirlenemedi'); } });
      });
    }

    function buildSozNo() {
      var d = new Date();
      var pad = function (n) { return n < 10 ? '0' + n : '' + n; };
      var rand = Math.floor(Math.random() * 9000) + 1000;
      return 'SR-' + d.getFullYear() + pad(d.getMonth() + 1) + pad(d.getDate()) + '-' + rand;
    }

    function fmtDate(d) {
      var pad = function (n) { return n < 10 ? '0' + n : '' + n; };
      return pad(d.getDate()) + '.' + pad(d.getMonth() + 1) + '.' + d.getFullYear() + ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes());
    }

    function escapeHtml(s) {
      return String(s).replace(/[&<>"']/g, function (c) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
      });
    }

    function buildPdfHtml(data) {
      var source = document.querySelector('.article-content');
      var clone = source.cloneNode(true);

      // Replace customer signature block with filled-in version
      var sigBlock = clone.querySelector('.signature-block');
      if (sigBlock) {
        sigBlock.innerHTML =
          '<div class="sig">' +
            '<h4>HİZMET SAĞLAYICI</h4>' +
            '<p><strong>Sponsorlu Reklam</strong><br>' +
            'Mimar Sinan Mah. 2341 Sk. No:4<br>' +
            'Efeler / Aydın</p>' +
            '<div style="margin-top:50px;border-bottom:1px solid #999;"></div>' +
            '<small>Kaşe / İmza</small>' +
          '</div>' +
          '<div class="sig">' +
            '<h4>MÜŞTERİ</h4>' +
            '<p><strong>' + escapeHtml(data.firma) + '</strong><br>' +
            'Yetkili: ' + escapeHtml(data.yetkili) + '<br>' +
            'E-posta: ' + escapeHtml(data.eposta) + '<br>' +
            'Telefon: ' + escapeHtml(data.telefon) + '</p>' +
            '<img src="' + data.sigImg + '" alt="İmza" style="max-width:100%;max-height:90px;display:block;margin-top:6px;">' +
            '<small>Dijital imza — ' + escapeHtml(data.tarih) + '</small>' +
          '</div>';
      }

      var header =
        '<div style="text-align:center;margin-bottom:18px;">' +
          '<h1 style="font-size:20px;margin:0 0 4px;color:#0a2540;">AYLIK YÖNETİM SÖZLEŞMESİ</h1>' +
          '<div style="font-size:11px;color:#555;">Sözleşme No: ' + escapeHtml(data.sozNo) + ' &nbsp;|&nbsp; Tarih: ' + escapeHtml(data.tarih) + '</div>' +
        '</div>' +
        '<div style="background:#f7f7f9;border-left:3px solid #c9a14a;padding:10px 14px;margin-bottom:18px;font-size:11.5px;line-height:1.6;">' +
          '<div><strong>Müşteri:</strong> ' + escapeHtml(data.firma) + '</div>' +
          '<div><strong>Yetkili:</strong> ' + escapeHtml(data.yetkili) + '</div>' +
          '<div><strong>İletişim:</strong> ' + escapeHtml(data.eposta) + ' &nbsp;•&nbsp; ' + escapeHtml(data.telefon) + '</div>' +
          '<div><strong>Seçilen Paket:</strong> ' + escapeHtml(data.paket) + '</div>' +
        '</div>';

      var footer =
        '<div style="margin-top:24px;padding-top:10px;border-top:1px dashed #ccc;font-size:9.5px;color:#666;text-align:center;line-height:1.6;">' +
          'Bu sözleşme ' + escapeHtml(data.tarih) + ' tarihinde dijital olarak imzalanmıştır.<br>' +
          'IP Adresi: ' + escapeHtml(data.ip) + ' &nbsp;•&nbsp; Sözleşme No: ' + escapeHtml(data.sozNo) + '<br>' +
          'sponsorlureklam.com.tr — info@sponsorlureklam.com.tr — 0546 844 55 76' +
        '</div>';

      pdfRender.innerHTML = '';
      pdfRender.insertAdjacentHTML('beforeend', header);
      pdfRender.appendChild(clone);
      pdfRender.insertAdjacentHTML('beforeend', footer);
    }

    function generatePdf(data) {
      buildPdfHtml(data);
      return html2canvas(pdfRender, {
        scale: 2,
        backgroundColor: '#ffffff',
        useCORS: true,
        logging: false
      }).then(function (canvasEl) {
        var imgData = canvasEl.toDataURL('image/jpeg', 0.92);
        var jsPDFCtor = (window.jspdf && window.jspdf.jsPDF) || window.jsPDF;
        var pdf = new jsPDFCtor({ unit: 'mm', format: 'a4', orientation: 'portrait' });
        var pdfW = pdf.internal.pageSize.getWidth();
        var pdfH = pdf.internal.pageSize.getHeight();
        var imgW = pdfW;
        var imgH = (canvasEl.height * pdfW) / canvasEl.width;
        var heightLeft = imgH;
        var position = 0;
        pdf.addImage(imgData, 'JPEG', 0, position, imgW, imgH);
        heightLeft -= pdfH;
        while (heightLeft > 0) {
          position = heightLeft - imgH;
          pdf.addPage();
          pdf.addImage(imgData, 'JPEG', 0, position, imgW, imgH);
          heightLeft -= pdfH;
        }
        var safeFirma = (data.firma || 'sozlesme').replace(/[^a-zA-Z0-9çğıöşüÇĞİÖŞÜ_-]+/g, '_').slice(0, 40);
        pdf.save('Aylik-Yonetim-Sozlesmesi_' + safeFirma + '_' + data.sozNo + '.pdf');
        pdfRender.innerHTML = '';
      });
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      clearStatus();

      var firma = document.getElementById('oFirma').value.trim();
      var yetkili = document.getElementById('oYetkili').value.trim();
      var eposta = document.getElementById('oEposta').value.trim();
      var telefon = document.getElementById('oTel').value.trim();
      var paket = document.getElementById('oPaket').value;
      var okudum = document.getElementById('oOkudum').checked;
      var kvkk = document.getElementById('oKvkk').checked;

      if (!firma || !yetkili || !eposta || !telefon || !paket) {
        showStatus('Lütfen tüm zorunlu alanları doldurun.', 'error');
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(eposta)) {
        showStatus('Geçerli bir e-posta adresi girin.', 'error');
        return;
      }
      if (!okudum || !kvkk) {
        showStatus('Devam etmek için her iki onay kutusunu da işaretlemeniz gerekir.', 'error');
        return;
      }
      if (signaturePad.isEmpty()) {
        showStatus('Lütfen imza alanına imzanızı atın.', 'error');
        sigPadWrap.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }
      if (typeof html2canvas === 'undefined' || !(window.jspdf || window.jsPDF)) {
        showStatus('PDF kütüphaneleri yüklenemedi. Sayfayı yenileyip tekrar deneyin.', 'error');
        return;
      }

      submitBtn.disabled = true;
      showStatus('Sözleşmeniz hazırlanıyor, lütfen bekleyin…', 'loading');

      fetchIp().then(function (ip) {
        var data = {
          firma: firma,
          yetkili: yetkili,
          eposta: eposta,
          telefon: telefon,
          paket: paket,
          ip: ip,
          tarih: fmtDate(new Date()),
          sozNo: buildSozNo(),
          sigImg: signaturePad.toDataURL('image/png')
        };
        return generatePdf(data).then(function () {
          var msg =
            'Merhaba, ' + data.firma + ' olarak "' + data.paket + '" için Aylık Yönetim Sözleşmesi\'ni dijital olarak imzaladım.\n\n' +
            'Sözleşme No: ' + data.sozNo + '\n' +
            'Tarih: ' + data.tarih + '\n' +
            'Yetkili: ' + data.yetkili + '\n' +
            'E-posta: ' + data.eposta + '\n' +
            'Telefon: ' + data.telefon + '\n\n' +
            'İmzalı PDF dosyasını bu mesaja ekleyerek gönderiyorum.';
          waBtn.href = 'https://wa.me/905468445576?text=' + encodeURIComponent(msg);
          form.style.display = 'none';
          clearStatus();
          successEl.style.display = 'block';
          successEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
      }).catch(function (err) {
        console.error(err);
        showStatus('Sözleşme oluşturulurken bir hata oluştu. Lütfen tekrar deneyin veya WhatsApp\'tan iletişime geçin.', 'error');
      }).then(function () {
        submitBtn.disabled = false;
      });
    });

    signAgainBtn.addEventListener('click', function () {
      successEl.style.display = 'none';
      form.style.display = '';
      signaturePad.clear();
      sigPadWrap.classList.remove('has-ink');
      form.reset();
      clearStatus();
      document.getElementById('onlineSign').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
})();
