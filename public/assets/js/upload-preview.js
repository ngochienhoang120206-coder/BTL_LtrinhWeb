// upload-preview.js — Khung kéo-thả upload ảnh & xem trước cục bộ (dùng chung cho các trang Admin/Thành viên)
// Cách dùng:
//   <label class="upload-drop" data-upload-drop data-preview="idDanhSachXemTruoc" data-max-mb="2">
//     <input class="upload-drop__input" type="file" name="anh[]" accept="image/jpeg,image/png,image/webp" multiple>
//     ...
//   </label>
//   <ul id="idDanhSachXemTruoc" class="upload-previews"></ul>
// Kiểm tra phía client: đúng định dạng ảnh và không vượt quá dung lượng tối đa (mặc định 2 MB).
// Phía server (GĐ2) vẫn phải kiểm tra lại MIME + dung lượng trong app/core/Uploader.php.
(function () {
  'use strict';

  const ALLOWED = ['image/jpeg', 'image/png', 'image/webp'];

  function formatSize(bytes) {
    return bytes >= 1048576 ? (bytes / 1048576).toFixed(1) + ' MB' : Math.round(bytes / 1024) + ' KB';
  }

  function showError(drop, message) {
    let box = drop.parentNode.querySelector('.form-error[data-upload-error]');
    if (!message) {
      if (box) box.remove();
      return;
    }
    if (!box) {
      box = document.createElement('span');
      box.className = 'form-error';
      box.setAttribute('data-upload-error', '');
      box.setAttribute('role', 'alert');
      drop.insertAdjacentElement('afterend', box);
    }
    box.textContent = message;
  }

  function initDrop(drop) {
    const input = drop.querySelector('input[type="file"]');
    const list = document.getElementById(drop.dataset.preview);
    const maxBytes = (parseFloat(drop.dataset.maxMb) || 2) * 1048576;
    if (!input || !list) return;

    let files = [];

    // Gán lại danh sách file đã lọc vào input để form gửi đúng các file hợp lệ
    function syncInput() {
      if (typeof DataTransfer === 'undefined') return;
      const dt = new DataTransfer();
      files.forEach(function (file) { dt.items.add(file); });
      input.files = dt.files;
    }

    function render() {
      list.querySelectorAll('img[data-object-url]').forEach(function (img) {
        URL.revokeObjectURL(img.src);
      });
      list.innerHTML = '';
      files.forEach(function (file, index) {
        const li = document.createElement('li');
        li.className = 'upload-thumb';

        const img = document.createElement('img');
        img.src = URL.createObjectURL(file);
        img.dataset.objectUrl = '1';
        img.alt = 'Xem trước ảnh ' + file.name;

        const badge = document.createElement('span');
        badge.className = 'upload-thumb__badge';
        badge.textContent = 'Mới';

        const name = document.createElement('span');
        name.className = 'upload-thumb__name';
        name.textContent = file.name + ' · ' + formatSize(file.size);

        const remove = document.createElement('button');
        remove.type = 'button';
        remove.className = 'upload-thumb__remove';
        remove.setAttribute('aria-label', 'Bỏ ảnh ' + file.name);
        remove.textContent = '×';
        remove.addEventListener('click', function () {
          files.splice(index, 1);
          syncInput();
          render();
        });

        li.appendChild(img);
        li.appendChild(badge);
        li.appendChild(name);
        li.appendChild(remove);
        list.appendChild(li);
      });
    }

    function addFiles(fileList) {
      const rejected = [];
      Array.from(fileList).forEach(function (file) {
        if (ALLOWED.indexOf(file.type) === -1) {
          rejected.push(file.name + ' (sai định dạng)');
        } else if (file.size > maxBytes) {
          rejected.push(file.name + ' (lớn hơn ' + formatSize(maxBytes) + ')');
        } else if (input.multiple) {
          files.push(file);
        } else {
          files = [file];
        }
      });
      showError(drop, rejected.length ? 'Không nhận: ' + rejected.join(', ') + '. Chỉ chấp nhận JPG, PNG, WEBP.' : '');
      syncInput();
      render();
    }

    input.addEventListener('change', function () {
      addFiles(input.files);
    });

    ['dragenter', 'dragover'].forEach(function (type) {
      drop.addEventListener(type, function (event) {
        event.preventDefault();
        drop.classList.add('is-dragover');
      });
    });

    ['dragleave', 'dragend', 'drop'].forEach(function (type) {
      drop.addEventListener(type, function () {
        drop.classList.remove('is-dragover');
      });
    });

    drop.addEventListener('drop', function (event) {
      event.preventDefault();
      if (event.dataTransfer && event.dataTransfer.files.length) addFiles(event.dataTransfer.files);
    });

    const form = input.form;
    if (form) {
      form.addEventListener('reset', function () {
        files = [];
        setTimeout(function () {
          render();
          showError(drop, '');
        }, 0);
      });
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('[data-upload-drop]').forEach(initDrop);
  });
})();
