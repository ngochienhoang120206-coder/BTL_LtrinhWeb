// main.js
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    const header = document.getElementById('siteHeader');
    const toggleBtn = document.getElementById('mobileMenuToggle');
    const mainNav = document.getElementById('mainNav');

    // Bật/tắt menu di động
    if (toggleBtn && mainNav) {
      toggleBtn.addEventListener('click', function () {
        const isOpen = mainNav.classList.toggle('is-open');
        toggleBtn.setAttribute('aria-expanded', String(isOpen));
      });

      // Tự đóng menu khi chọn liên kết trên màn hình nhỏ
      mainNav.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () {
          mainNav.classList.remove('is-open');
          toggleBtn.setAttribute('aria-expanded', 'false');
        });
      });
    }

    // Hiệu ứng đổ bóng Header khi cuộn trang
    if (header) {
      window.addEventListener('scroll', function () {
        header.classList.toggle('is-scrolled', window.scrollY > 10);
      }, { passive: true });
    }
  });
})();