// validator.js
(function () {
  'use strict';

  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const PHONE_REGEX = /^(0|\+84)[0-9]{9}$/;

  function clearError(field) {
    field.classList.remove('is-invalid');
    const next = field.nextElementSibling;
    if (next && next.classList.contains('form-error')) {
      next.remove();
    }
  }

  function showError(field, message) {
    clearError(field);
    field.classList.add('is-invalid');
    const span = document.createElement('span');
    span.className = 'form-error';
    span.textContent = message;
    field.insertAdjacentElement('afterend', span);
  }

  function validateField(field) {
    const value = field.value.trim();

    if (field.hasAttribute('required') && value === '') {
      showError(field, field.getAttribute('data-msg-required') || 'Trường này không được để trống.');
      return false;
    }

    if (value !== '' && field.type === 'email' && !EMAIL_REGEX.test(value)) {
      showError(field, 'Định dạng email không hợp lệ.');
      return false;
    }

    if (value !== '' && field.getAttribute('data-rule') === 'phone' && !PHONE_REGEX.test(value)) {
      showError(field, 'Số điện thoại Việt Nam phải gồm 10 chữ số (bắt đầu bằng 0 hoặc +84).');
      return false;
    }

    const minLength = field.getAttribute('minlength');
    if (value !== '' && minLength && value.length < parseInt(minLength, 10)) {
      showError(field, 'Vui lòng nhập tối thiểu ' + minLength + ' ký tự.');
      return false;
    }

    const matchSelector = field.getAttribute('data-match');
    if (matchSelector) {
      const target = document.querySelector(matchSelector);
      if (target && field.value !== target.value) {
        showError(field, 'Giá trị xác nhận không khớp.');
        return false;
      }
    }

    clearError(field);
    return true;
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('form[data-validate="true"]').forEach(function (form) {
      form.setAttribute('novalidate', 'novalidate');

      const fields = form.querySelectorAll('input, textarea, select');
      fields.forEach(function (field) {
        field.addEventListener('blur', function () {
          validateField(field);
        });
      });

      form.addEventListener('submit', function (event) {
        let isFormValid = true;
        fields.forEach(function (field) {
          if (!validateField(field)) {
            isFormValid = false;
          }
        });
        if (!isFormValid) {
          event.preventDefault();
          const firstInvalid = form.querySelector('.is-invalid');
          if (firstInvalid) firstInvalid.focus();
        }
      });
    });
  });
})();