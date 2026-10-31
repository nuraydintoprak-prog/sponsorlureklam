// Rezervasyon takvimi ve formu. Site CSP'si satır içi betiğe ve innerHTML'e izin vermediği için ayrı dosyada, DOM ile kurulur.
(function () {
  var STORAGE_KEY = 'sponsorlu_rezervasyon_v3';
  var DAILY_CAP = 3;
  var DAYS_TO_SHOW = 14;
  var TR_DAYS = ['Pazar','P.tesi','Salı','Çar','Per','Cuma','C.tesi'];
  var TR_MONTHS = ['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'];

  function pad(n) { return n < 10 ? '0' + n : '' + n; }
  function dateKey(d) { return d.getFullYear() + '-' + pad(d.getMonth()+1) + '-' + pad(d.getDate()); }

  function loadBookings() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; }
    catch (e) { return {}; }
  }
  function saveBookings(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  function preFilledCount(dateStr) {
    var h = 0;
    for (var i = 0; i < dateStr.length; i++) h = (h * 31 + dateStr.charCodeAt(i)) | 0;
    return (Math.abs(h) % 2) + 1;
  }
  function realCount(dateStr) {
    var b = loadBookings();
    return (b[dateStr] || []).length;
  }
  function totalCount(dateStr) {
    return preFilledCount(dateStr) + realCount(dateStr);
  }
  function remainingFor(dateStr) {
    var r = DAILY_CAP - totalCount(dateStr);
    return r < 0 ? 0 : r;
  }

  function parca(etiket, sinif, metin) {
    var el = document.createElement(etiket);
    el.className = sinif;
    el.textContent = metin;
    return el;
  }

  function buildGrid() {
    var grid = document.getElementById('dayGrid');
    grid.textContent = '';
    var today = new Date(); today.setHours(0,0,0,0);

    for (var i = 0; i < DAYS_TO_SHOW; i++) {
      var d = new Date(today);
      d.setDate(today.getDate() + i);
      var key = dateKey(d);
      var remaining = remainingFor(key);

      var card = document.createElement('div');
      card.className = 'day-card';
      card.setAttribute('data-date', key);
      card.setAttribute('data-display', d.getDate() + ' ' + TR_MONTHS[d.getMonth()] + ' ' + d.getFullYear() + ' ' + TR_DAYS[d.getDay()]);

      var slotsClass = 'slots';
      var slotsText = 'Kalan: ' + remaining;
      if (remaining <= 0) {
        card.classList.add('full');
        slotsClass = 'slots full-tag';
        slotsText = 'Doldu';
      } else if (remaining === 1) {
        slotsClass = 'slots warn';
        slotsText = 'Kalan: 1';
      }

      card.appendChild(parca('div', 'day-name', TR_DAYS[d.getDay()]));
      card.appendChild(parca('div', 'day-num', d.getDate()));
      card.appendChild(parca('div', 'day-month', TR_MONTHS[d.getMonth()]));
      card.appendChild(parca('span', slotsClass, slotsText));

      if (remaining > 0) {
        card.addEventListener('click', onDayClick);
      }
      grid.appendChild(card);
    }
  }

  function onDayClick(e) {
    var card = e.currentTarget;
    var key = card.getAttribute('data-date');
    var display = card.getAttribute('data-display');

    document.querySelectorAll('.day-card.selected').forEach(function (c) { c.classList.remove('selected'); });
    card.classList.add('selected');

    document.getElementById('rezDate').value = key;
    document.getElementById('selectedDateBig').textContent = display;

    var wrap = document.getElementById('formWrap');
    wrap.classList.add('active');
    document.getElementById('rezSuccess').style.display = 'none';

    setTimeout(function () {
      wrap.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 150);
  }

  document.getElementById('rezForm').addEventListener('submit', function (e) {
    e.preventDefault();
    var dateStr = document.getElementById('rezDate').value;
    var name = document.getElementById('rezName').value.trim();
    var phone = document.getElementById('rezPhone').value.trim();
    var website = document.getElementById('rezWebsite').value.trim();
    var message = document.getElementById('rezMessage').value.trim();

    if (!dateStr) {
      alert('Lütfen önce bir gün seçin.');
      return;
    }
    if (remainingFor(dateStr) <= 0) {
      alert('Bu güne ait kontenjan tükendi. Lütfen başka bir gün seçin.');
      buildGrid();
      return;
    }

    var tarih = document.getElementById('selectedDateBig').textContent;
    var text = 'Merhaba, ücretsiz görüşme rezervasyonu yapmak istiyorum.'
      + '\nTarih: ' + tarih
      + '\nAd Soyad: ' + name
      + '\nTelefon: ' + phone
      + (website ? '\nWeb sitesi: ' + website : '')
      + (message ? '\nSorular ve istekler: ' + message : '');
    var url = 'https://wa.me/905468445576?text=' + encodeURIComponent(text);

    var bookings = loadBookings();
    if (!bookings[dateStr]) bookings[dateStr] = [];
    bookings[dateStr].push({
      name: name,
      phone: phone,
      website: website,
      message: message,
      createdAt: new Date().toISOString()
    });
    saveBookings(bookings);

    document.getElementById('formWrap').classList.remove('active');
    document.getElementById('successText').textContent =
      ' Sayın ' + name + ', ' + tarih + ' tarihi için mesajınız hazır; WhatsApp\'ta gönder tuşuna basmanız yeterli. Mesajınız bize ulaşınca ' + phone + ' numaralı telefondan sizi arayarak görüşme saatini netleştireceğiz. Bu görüşme için sizden hiçbir ücret talep edilmeyecektir.';
    document.getElementById('rezSuccess').style.display = 'block';

    this.reset();
    buildGrid();
    if (!window.open(url, '_blank')) window.location.href = url;
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildGrid);
  } else {
    buildGrid();
  }
})();
