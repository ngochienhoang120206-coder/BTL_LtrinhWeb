// mini-editor.js — Trình soạn thảo WYSIWYG gọn nhẹ (JS thuần, không phụ thuộc thư viện ngoài)
// Cách dùng:
//   <div class="mini-editor" data-mini-editor="noiDung">  ...  </div>
//   <textarea id="noiDung" name="noi_dung" class="mini-editor__source" required></textarea>
// Thanh công cụ và vùng soạn thảo được tạo tự động; nội dung HTML luôn được đồng bộ vào <textarea>
// trước khi validator.js kiểm tra form, nên PHP (GĐ2) chỉ cần đọc $_POST['noi_dung'].
(function () {
  'use strict';

  const TOOLS = [
    { cmd: 'bold', label: 'B', title: 'In đậm (Ctrl+B)' },
    { cmd: 'italic', label: 'I', title: 'In nghiêng (Ctrl+I)' },
    { cmd: 'underline', label: 'U', title: 'Gạch chân (Ctrl+U)' },
    { sep: true },
    { cmd: 'formatBlock', value: 'h2', label: 'H2', title: 'Tiêu đề mục' },
    { cmd: 'formatBlock', value: 'h3', label: 'H3', title: 'Tiêu đề phụ' },
    { cmd: 'formatBlock', value: 'p', label: '¶', title: 'Đoạn văn' },
    { cmd: 'formatBlock', value: 'blockquote', label: '❝', title: 'Trích dẫn' },
    { sep: true },
    { cmd: 'insertUnorderedList', label: '• Danh sách', title: 'Danh sách dấu chấm' },
    { cmd: 'insertOrderedList', label: '1. Danh sách', title: 'Danh sách đánh số' },
    { sep: true },
    { cmd: 'createLink', label: 'Liên kết', title: 'Chèn liên kết' },
    { cmd: 'unlink', label: 'Bỏ liên kết', title: 'Bỏ liên kết' },
    { sep: true },
    { cmd: 'undo', label: '↶', title: 'Hoàn tác (Ctrl+Z)' },
    { cmd: 'redo', label: '↷', title: 'Làm lại (Ctrl+Y)' },
    { cmd: 'removeFormat', label: 'Xóa định dạng', title: 'Xóa định dạng' }
  ];

  const STATE_CMDS = ['bold', 'italic', 'underline', 'insertUnorderedList', 'insertOrderedList'];

  function plainText(html) {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return (tmp.textContent || '').replace(/\s+/g, ' ').trim();
  }

  function createEditor(wrapper) {
    const source = document.getElementById(wrapper.dataset.miniEditor);
    if (!source) return;

    const toolbar = document.createElement('div');
    toolbar.className = 'mini-editor__toolbar';
    toolbar.setAttribute('role', 'toolbar');
    toolbar.setAttribute('aria-label', 'Định dạng nội dung');

    TOOLS.forEach(function (tool) {
      if (tool.sep) {
        const sep = document.createElement('span');
        sep.className = 'mini-editor__sep';
        sep.setAttribute('aria-hidden', 'true');
        toolbar.appendChild(sep);
        return;
      }
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'mini-editor__btn';
      btn.textContent = tool.label;
      btn.title = tool.title;
      btn.setAttribute('aria-label', tool.title);
      btn.dataset.cmd = tool.cmd;
      if (tool.value) btn.dataset.value = tool.value;
      toolbar.appendChild(btn);
    });

    const area = document.createElement('div');
    area.className = 'mini-editor__area';
    area.contentEditable = 'true';
    area.setAttribute('role', 'textbox');
    area.setAttribute('aria-multiline', 'true');
    area.setAttribute('aria-label', wrapper.dataset.label || 'Nội dung');
    area.dataset.placeholder = source.getAttribute('placeholder') || 'Nhập nội dung...';
    area.innerHTML = source.value.trim();

    const status = document.createElement('div');
    status.className = 'mini-editor__status';

    wrapper.appendChild(toolbar);
    wrapper.appendChild(area);
    wrapper.appendChild(status);

    try { document.execCommand('defaultParagraphSeparator', false, 'p'); } catch (e) { /* trình duyệt cũ */ }

    function sync() {
      const html = area.innerHTML.trim();
      source.value = plainText(html) === '' ? '' : html;
      const words = plainText(html).split(' ').filter(Boolean).length;
      status.textContent = words + ' từ';
      wrapper.classList.toggle('is-invalid', source.classList.contains('is-invalid'));
    }

    function refreshState() {
      toolbar.querySelectorAll('.mini-editor__btn').forEach(function (btn) {
        if (STATE_CMDS.indexOf(btn.dataset.cmd) === -1) return;
        let active = false;
        try { active = document.queryCommandState(btn.dataset.cmd); } catch (e) { active = false; }
        btn.classList.toggle('is-active', active);
      });
    }

    toolbar.addEventListener('mousedown', function (event) {
      if (event.target.closest('.mini-editor__btn')) event.preventDefault(); // giữ vùng chọn trong editor
    });

    toolbar.addEventListener('click', function (event) {
      const btn = event.target.closest('.mini-editor__btn');
      if (!btn) return;
      area.focus();
      let value = btn.dataset.value || null;
      if (btn.dataset.cmd === 'createLink') {
        value = window.prompt('Nhập đường dẫn liên kết (ví dụ: salad-builder.html hoặc https://...)', 'https://');
        if (!value || value === 'https://') return;
        if (/^\s*javascript:/i.test(value)) return; // chặn liên kết javascript:
      }
      if (btn.dataset.cmd === 'formatBlock') value = '<' + value + '>';
      document.execCommand(btn.dataset.cmd, false, value);
      sync();
      refreshState();
    });

    // Dán nội dung dạng văn bản thuần để tránh mang theo style lạ từ Word/web khác
    area.addEventListener('paste', function (event) {
      if (!event.clipboardData) return;
      event.preventDefault();
      const text = event.clipboardData.getData('text/plain');
      document.execCommand('insertText', false, text);
    });

    area.addEventListener('input', sync);
    area.addEventListener('keyup', refreshState);
    area.addEventListener('mouseup', refreshState);
    area.addEventListener('blur', function () {
      sync();
      source.dispatchEvent(new Event('blur')); // để validator.js kiểm tra ngay khi rời editor
      sync();
    });

    // Đồng bộ trước khi validator.js kiểm tra (capture chạy trước listener submit thông thường)
    const form = source.form;
    if (form) {
      form.addEventListener('submit', sync, true);
      form.addEventListener('submit', function () { setTimeout(sync, 0); });
      form.addEventListener('reset', function () {
        setTimeout(function () {
          area.innerHTML = source.defaultValue.trim();
          sync();
        }, 0);
      });
    }

    sync();
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('[data-mini-editor]').forEach(createEditor);
  });
})();
