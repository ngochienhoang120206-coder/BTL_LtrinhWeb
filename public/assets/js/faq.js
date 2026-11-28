// faq.js — [R2] TV2: JS riêng cho Trang Giới thiệu, Trang Hỏi/đáp và Admin Hỏi/đáp
// 1. Hiệu ứng xuất hiện khi cuộn cho các phần tử có [data-reveal] (about.html, faq.html)
// 2. Accordion FAQ: đóng/mở mượt, "Mở tất cả", lọc theo nhóm, tìm kiếm không dấu + tô sáng từ khóa
// 3. Admin FAQ: nút "Sửa" điền dữ liệu dòng vào form, "Ẩn/Hiện" đổi trạng thái, bộ đếm ký tự
(function () {
  'use strict';

  /* ---------- Tiện ích ---------- */
  // Chuẩn hóa 1 ký tự: chữ thường, bỏ dấu tiếng Việt (giữ nguyên độ dài để tô sáng đúng vị trí)
  function foldChar(ch) {
    const lower = ch.toLowerCase();
    if (lower === 'đ') return 'd';
    const base = lower.normalize('NFD').replace(/[̀-ͯ]/g, '');
    return base.length === 1 ? base : lower;
  }

  function fold(text) {
    let out = '';
    for (const ch of text) out += foldChar(ch);
    return out;
  }

  function escapeHtml(text) {
    return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  // Trả về HTML của text với các đoạn khớp từ khóa được bọc <mark>
  function highlight(text, foldedKeyword) {
    if (!foldedKeyword) return escapeHtml(text);
    const chars = Array.from(text);
    const folded = chars.map(foldChar).join('');
    let html = '';
    let i = 0;
    while (i < chars.length) {
      const at = folded.indexOf(foldedKeyword, i);
      if (at === -1) {
        html += escapeHtml(chars.slice(i).join(''));
        break;
      }
      html += escapeHtml(chars.slice(i, at).join(''));
      html += '<mark class="faq-hit">' + escapeHtml(chars.slice(at, at + foldedKeyword.length).join('')) + '</mark>';
      i = at + foldedKeyword.length;
    }
    return html;
  }

  /* ---------- 1. Hiệu ứng xuất hiện khi cuộn ---------- */
  function initReveal() {
    const items = document.querySelectorAll('[data-reveal]');
    if (!items.length || !('IntersectionObserver' in window)) return;
    document.documentElement.classList.add('js-ready');

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    items.forEach(function (item) { observer.observe(item); });

    // Dự phòng: nếu observer không kích hoạt (trình duyệt chạy ngầm, chế độ đọc...) thì
    // tự hiện các phần đang nằm trong khung nhìn; khi in trang thì hiện toàn bộ nội dung.
    function revealInView() {
      items.forEach(function (item) {
        if (item.classList.contains('is-visible')) return;
        const rect = item.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          item.classList.add('is-visible');
          observer.unobserve(item);
        }
      });
    }
    setTimeout(revealInView, 1200);
    let scrollTimer = null;
    window.addEventListener('scroll', function () {
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(revealInView, 700); // chỉ chạy 1 lần sau khi ngừng cuộn
    }, { passive: true });
    window.addEventListener('beforeprint', function () {
      items.forEach(function (item) { item.classList.add('is-visible'); });
    });
  }

  /* ---------- 2. Accordion FAQ ---------- */
  function setOpen(item, open, animate) {
    const btn = item.querySelector('.faq-item__btn');
    const panel = item.querySelector('.faq-item__panel');
    if (!btn || !panel) return;
    if ((btn.getAttribute('aria-expanded') === 'true') === open && animate) return;

    btn.setAttribute('aria-expanded', String(open));
    item.classList.toggle('is-open', open);

    if (!animate) {
      panel.hidden = !open;
      panel.style.height = open ? '' : '0px';
      return;
    }

    if (open) {
      panel.hidden = false;
      const target = panel.scrollHeight;
      panel.style.height = '0px';
      void panel.offsetHeight; // ép trình duyệt tính lại layout trước khi chạy transition
      panel.style.height = target + 'px';
    } else {
      panel.style.height = panel.scrollHeight + 'px';
      void panel.offsetHeight;
      panel.style.height = '0px';
    }

    // Dự phòng khi transitionend không xảy ra (tab ẩn, tắt hiệu ứng...): chốt trạng thái sau 350ms
    clearTimeout(panel._faqTimer);
    panel._faqTimer = setTimeout(function () { finishPanel(item); }, 350);
  }

  function finishPanel(item) {
    const panel = item.querySelector('.faq-item__panel');
    if (!panel) return;
    clearTimeout(panel._faqTimer);
    if (item.classList.contains('is-open')) {
      panel.style.height = '';
    } else {
      panel.hidden = true;
    }
  }

  function initFaq() {
    const items = Array.from(document.querySelectorAll('.faq-item'));
    if (!items.length) return;

    const groups = Array.from(document.querySelectorAll('.faq-group'));
    const catButtons = Array.from(document.querySelectorAll('.faq-cats__btn'));
    const keywordInput = document.getElementById('faqKeyword');
    const searchForm = document.getElementById('faqSearchForm');
    const resultText = document.getElementById('faqResult');
    const emptyText = document.getElementById('faqEmpty');
    const toggleAllBtn = document.getElementById('faqToggleAll');
    let currentFilter = 'all';

    // Lưu nội dung gốc để tìm kiếm và tô sáng
    items.forEach(function (item) {
      const label = item.querySelector('.faq-item__btn > span:first-child');
      const body = item.querySelector('.faq-item__body');
      item.dataset.question = label ? label.textContent : '';
      item.dataset.search = fold((label ? label.textContent : '') + ' ' + (body ? body.textContent : ''));

      const panel = item.querySelector('.faq-item__panel');
      panel.addEventListener('transitionend', function (event) {
        if (event.propertyName === 'height') finishPanel(item);
      });

      setOpen(item, false, false);
      item.querySelector('.faq-item__btn').addEventListener('click', function () {
        setOpen(item, !item.classList.contains('is-open'), true);
        syncToggleAll();
      });
    });

    // Cập nhật số câu hỏi của từng nhóm theo dữ liệu thực tế trên trang
    catButtons.forEach(function (btn) {
      const filter = btn.dataset.filter;
      const count = filter === 'all'
        ? items.length
        : document.querySelectorAll('.faq-group[data-group="' + filter + '"] .faq-item').length;
      const badge = btn.querySelector('.faq-cats__count');
      if (badge) badge.textContent = String(count);
    });

    function visibleItems() {
      return items.filter(function (item) { return !item.hidden && !item.closest('.faq-group').hidden; });
    }

    function syncToggleAll() {
      if (!toggleAllBtn) return;
      const shown = visibleItems();
      const allOpen = shown.length > 0 && shown.every(function (item) { return item.classList.contains('is-open'); });
      toggleAllBtn.textContent = allOpen ? 'Thu gọn tất cả' : 'Mở tất cả';
      toggleAllBtn.setAttribute('aria-pressed', String(allOpen));
    }

    function applyFilters() {
      const raw = keywordInput ? keywordInput.value.trim() : '';
      const keyword = fold(raw);
      let total = 0;

      groups.forEach(function (group) {
        const inCategory = currentFilter === 'all' || group.dataset.group === currentFilter;
        let groupCount = 0;

        group.querySelectorAll('.faq-item').forEach(function (item) {
          const match = inCategory && (keyword === '' || item.dataset.search.indexOf(keyword) !== -1);
          item.hidden = !match;
          const label = item.querySelector('.faq-item__btn > span:first-child');
          if (label) label.innerHTML = highlight(item.dataset.question, keyword);
          if (match) groupCount += 1;
        });

        group.hidden = groupCount === 0;
        total += groupCount;
      });

      if (resultText) {
        resultText.textContent = keyword
          ? 'Tìm thấy ' + total + ' câu hỏi cho “' + raw + '”'
          : 'Đang hiển thị ' + total + ' câu hỏi';
      }
      if (emptyText) emptyText.hidden = total !== 0;
      syncToggleAll();
    }

    catButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        currentFilter = btn.dataset.filter;
        catButtons.forEach(function (other) {
          const active = other === btn;
          other.classList.toggle('is-active', active);
          other.setAttribute('aria-pressed', String(active));
        });
        applyFilters();
      });
    });

    if (keywordInput) {
      let timer = null;
      keywordInput.addEventListener('input', function () {
        clearTimeout(timer);
        timer = setTimeout(applyFilters, 150);
      });
    }

    if (searchForm) {
      searchForm.addEventListener('submit', function (event) {
        event.preventDefault();
        applyFilters();
      });
    }

    if (toggleAllBtn) {
      toggleAllBtn.addEventListener('click', function () {
        const openAll = toggleAllBtn.getAttribute('aria-pressed') !== 'true';
        visibleItems().forEach(function (item) { setOpen(item, openAll, true); });
        syncToggleAll();
      });
    }

    // Mở sẵn câu hỏi nếu URL có #faq-a5 ... (dùng khi trang khác dẫn link tới)
    if (location.hash.length > 1) {
      const target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
      const item = target ? target.closest('.faq-item') : null;
      if (item) setOpen(item, true, false);
    }

    applyFilters();
  }

  /* ---------- 3. Admin Hỏi/đáp ---------- */
  function initAdminFaq() {
    const form = document.getElementById('faqForm');
    if (!form) return;

    const titleEl = document.getElementById('faqFormTitle');
    const submitBtn = document.getElementById('faqSubmit');
    const idField = form.querySelector('[name="ma_ch"]');

    function clearEditing() {
      document.querySelectorAll('.admin-table tr.is-editing').forEach(function (row) {
        row.classList.remove('is-editing');
      });
    }

    function resetForm() {
      clearEditing();
      if (titleEl) titleEl.textContent = 'Thêm câu hỏi mới';
      if (submitBtn) submitBtn.textContent = 'Lưu câu hỏi';
      if (idField) idField.value = '';
      form.querySelectorAll('.is-invalid').forEach(function (field) { field.classList.remove('is-invalid'); });
      form.querySelectorAll('.form-error, .admin-demo-note').forEach(function (msg) { msg.remove(); });
    }

    // Nút "Sửa": đọc data-* của dòng và điền vào form
    document.querySelectorAll('[data-faq-edit]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const row = btn.closest('tr');
        if (!row) return;
        resetForm();
        row.classList.add('is-editing');

        form.querySelector('[name="ma_ch"]').value = row.dataset.id;
        form.querySelector('[name="ma_nhom"]').value = row.dataset.group;
        form.querySelector('[name="cau_hoi"]').value = row.querySelector('.admin-faq-q').textContent.trim();
        form.querySelector('[name="tra_loi"]').value = row.dataset.answer;
        form.querySelector('[name="thu_tu"]').value = row.dataset.order;
        form.querySelector('[name="hien_thi"]').checked = row.dataset.visible === '1';

        if (titleEl) titleEl.textContent = 'Sửa câu hỏi ' + row.dataset.id;
        if (submitBtn) submitBtn.textContent = 'Cập nhật câu hỏi';
        form.scrollIntoView({ behavior: 'smooth', block: 'start' });
        form.querySelector('[name="cau_hoi"]').focus({ preventScroll: true });
      });
    });

    form.addEventListener('reset', function () {
      setTimeout(resetForm, 0);
    });

    // Nút "Ẩn/Hiện": đổi nhanh trạng thái hiển thị (giao diện tĩnh — GĐ2 sẽ gửi POST lên server)
    document.querySelectorAll('[data-faq-toggle]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const row = btn.closest('tr');
        const badge = row ? row.querySelector('.admin-badge') : null;
        if (!row || !badge) return;
        const nowVisible = row.dataset.visible !== '1';
        row.dataset.visible = nowVisible ? '1' : '0';
        badge.textContent = nowVisible ? 'Đang hiển thị' : 'Tạm ẩn';
        badge.className = 'admin-badge ' + (nowVisible ? 'admin-badge--success' : 'admin-badge--warning');
        btn.textContent = nowVisible ? 'Ẩn' : 'Hiện';
      });
    });
  }

  /* ---------- 4. Bộ đếm ký tự cho ô có data-counter (Admin Giới thiệu/FAQ) ---------- */
  function initCounters() {
    document.querySelectorAll('[data-counter]').forEach(function (field) {
      const output = document.getElementById(field.dataset.counter);
      const max = parseInt(field.getAttribute('maxlength'), 10) || 0;
      if (!output) return;
      function update() {
        const length = field.value.length;
        output.textContent = max ? length + '/' + max + ' ký tự' : length + ' ký tự';
        output.classList.toggle('is-over', max > 0 && length > max * 0.95);
      }
      field.addEventListener('input', update);
      update();
    });
  }

  /* ---------- 5. Admin Giới thiệu: gỡ ảnh hiện tại sau khi xác nhận (admin.js đã hỏi confirm) ---------- */
  function initThumbRemove() {
    document.querySelectorAll('.upload-thumb__remove[data-confirm]').forEach(function (btn) {
      btn.addEventListener('click', function (event) {
        if (event.defaultPrevented) return; // người dùng bấm "Hủy" ở hộp thoại xác nhận
        const item = btn.closest('.upload-thumb');
        if (item) item.remove();
      });
    });
  }

  /* ---------- 6. Form Admin ở giao diện tĩnh GĐ1: hợp lệ thì báo thành công thay vì gửi đi ---------- */
  // Form có data-static-demo: validator.js chặn khi sai; khi đúng thì hiện thông báo tại chỗ.
  // GĐ2 chỉ cần bỏ thuộc tính data-static-demo để form POST thật lên Controller PHP.
  function initStaticDemoForms() {
    document.querySelectorAll('form[data-static-demo]').forEach(function (form) {
      form.addEventListener('submit', function (event) {
        if (event.defaultPrevented) return; // validator.js đã chặn vì dữ liệu chưa hợp lệ
        event.preventDefault();
        let note = form.querySelector('.admin-demo-note');
        if (!note) {
          note = document.createElement('p');
          note.className = 'admin-demo-note';
          note.setAttribute('role', 'status');
          form.insertBefore(note, form.firstChild);
        }
        note.textContent = form.getAttribute('data-static-demo') || 'Dữ liệu hợp lệ. Ở Giai đoạn 2 thông tin sẽ được lưu vào CSDL.';
        note.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initStaticDemoForms();
    initThumbRemove();
    initReveal();
    initFaq();
    initAdminFaq();
    initCounters();
  });
})();
