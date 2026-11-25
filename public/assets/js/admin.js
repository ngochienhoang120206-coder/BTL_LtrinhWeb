(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    const sidebar = document.getElementById('adminSidebar');
    const overlay = document.getElementById('adminOverlay');
    const openBtn = document.getElementById('adminMenuToggle');
    const closeBtn = document.getElementById('adminSidebarClose');

    function setSidebarState(isOpen) {
      if (!sidebar || !overlay) return;
      sidebar.classList.toggle('is-open', isOpen);
      overlay.classList.toggle('is-open', isOpen);
      if (openBtn) {
        openBtn.setAttribute('aria-expanded', String(isOpen));
      }
    }

    if (openBtn) openBtn.addEventListener('click', function () { setSidebarState(true); });
    if (closeBtn) closeBtn.addEventListener('click', function () { setSidebarState(false); });
    if (overlay) overlay.addEventListener('click', function () { setSidebarState(false); });

    // Dropdown tài khoản Admin trên Topbar
    const userTrigger = document.getElementById('adminUserTrigger');
    const userDropdown = document.getElementById('adminUserDropdown');

    if (userTrigger && userDropdown) {
      userTrigger.addEventListener('click', function (event) {
        event.stopPropagation();
        const willOpen = !userDropdown.classList.contains('is-open');
        userDropdown.classList.toggle('is-open', willOpen);
        userTrigger.setAttribute('aria-expanded', String(willOpen));
      });

      document.addEventListener('click', function () {
        userDropdown.classList.remove('is-open');
        userTrigger.setAttribute('aria-expanded', 'false');
      });
    }

    // Xác nhận xóa chung cho các nút có thuộc tính data-confirm
    document.querySelectorAll('[data-confirm]').forEach(function (btn) {
      btn.addEventListener('click', function (event) {
        const msg = btn.getAttribute('data-confirm') || 'Bạn có chắc chắn muốn thực hiện thao tác này?';
        if (!window.confirm(msg)) {
          event.preventDefault();
        }
      });
    });
  });
})();