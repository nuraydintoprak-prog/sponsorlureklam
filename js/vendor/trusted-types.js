// Site CSP'si Trusted Types istiyor; html2canvas ve imza bloğu HTML yazdığı için bu sayfada ilke gerekir.
// html2canvas iframe'e yazdığı için orada varsayılan ilke çalışmaz: kopyasında write çağrısı __ttHtml'den geçirildi.
var __tt = window.trustedTypes && trustedTypes.createPolicy
  ? trustedTypes.createPolicy('default', { createHTML: function (s) { return s; } })
  : null;
window.__ttHtml = function (s) { return __tt ? __tt.createHTML(s) : s; };
