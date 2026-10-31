// Site CSP'si Trusted Types istiyor; html2canvas ve imza bloğu HTML yazdığı için bu sayfada varsayılan ilke gerekir.
if (window.trustedTypes && trustedTypes.createPolicy) {
  trustedTypes.createPolicy('default', { createHTML: function (s) { return s; } });
}
