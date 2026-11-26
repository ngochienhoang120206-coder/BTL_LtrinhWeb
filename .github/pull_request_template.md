## 📝 Mô tả Pull Request
<!-- Mô tả ngắn gọn tính năng đã hoàn thiện hoặc lỗi đã sửa trong PR này -->
- **Thành viên thực hiện:** TV...
- **Nhánh thực hiện:** `feat/tv<x>-...`
- **Mã công việc (theo phân công):** `[C...]` / `[R...]`
- **Giai đoạn thực hiện (đánh dấu X vào mục phù hợp):**
  - [ ] Giai đoạn 1 — Giao diện tĩnh (HTML5/CSS3/JS) / Thiết kế CSDL MySQL
  - [ ] Giai đoạn 2 — Backend PHP/MySQL, Bảo mật & SEO
- **Nội dung thay đổi chính:**
  - 

## 🔗 Liên kết Issue (Kanban Automation)
<!-- Điền số thứ tự Issue ngay sau dấu # (ví dụ: Closes #1) để hệ thống tự động chuyển thẻ sang cột Done khi merge vào nhánh `dev` -->
Closes #

## 🌿 Checklist Quy trình Git & Nhánh (Theo README.md)
- [ ] Code trên đúng nhánh công việc `feat/tv<x>-<ten-nhanh-con>` được tách từ `dev` (tuyệt đối không commit/push trực tiếp lên `main` hoặc `dev`).
- [ ] Đã kéo và đồng bộ code mới nhất từ `dev` (`git checkout dev && git pull origin dev`, sau đó `git checkout feat/... && git merge dev`) và xử lý hết xung đột trước khi mở PR.
- [ ] Đã chọn đúng nhánh đích (**Base branch**) là **`dev`** (tuyệt đối không trỏ vào `main`).
- [ ] Đã kiểm tra tệp thay đổi bằng `git status` trước khi commit; commit message rõ ràng theo chuẩn `feat(tv<x>): ...` và không ghi `Closes #` trong commit message.
- [ ] **An toàn kho mã nguồn:** Không đính kèm tệp `.env`, thông tin mật khẩu CSDL cá nhân hoặc ảnh upload thử nghiệm trong `public/uploads/`.

## ✅ Checklist Tiêu chuẩn Đề tài & Bảo mật (Verde Sana)

### Tiêu chuẩn bắt buộc chung (Cả 2 giai đoạn)
- [ ] **Ngôn ngữ & Kiến trúc:** Chỉ dùng HTML5/CSS3/JS, PHP thuần (>= 7.0) và MySQL theo mô hình MVC tự viết; tuyệt đối không sử dụng PHP Framework, CMF hay CMS.
- [ ] **Hình ảnh nội bộ:** Toàn bộ ảnh đều sử dụng đường dẫn nội bộ (`public/assets/images/...` cho ảnh tĩnh hoặc `public/uploads/...` cho ảnh upload), không sử dụng URL hình ảnh bên ngoài website.

### Checklist Giai đoạn 1 (Giao diện tĩnh & CSDL)
- [ ] **Đúng phạm vi tệp:** Chỉ chỉnh sửa các tệp được quy định trong Issue (các nhánh Frontend tuyệt đối không sửa `app/`, `config/`, `database/` hoặc `public/index.php`).
- [ ] **Chuẩn W3C & Responsive:** Toàn bộ tệp HTML5/CSS3 đạt **0 lỗi Error** trên `https://validator.w3.org`, hiển thị tốt trên Mobile, Tablet, Desktop (đã kiểm thử trên Chrome, Edge và Firefox).
- [ ] **Admin Tailadmin:** Trang quản trị dùng đúng khung **Tailadmin** bản miễn phí đã chuẩn hóa (không chứa thuộc tính Alpine.js gây lỗi W3C) và có thanh phân trang.
- [ ] **Validation Client:** Tất cả biểu mẫu (form) đều đã gắn kiểm tra dữ liệu đầu vào phía Javascript (`validator.js`).

### Checklist Giai đoạn 2 (Đánh dấu khi PR thuộc Backend PHP/MySQL)
- [ ] **Validation Server & Phân trang:** Đã kiểm tra dữ liệu đầu vào phía PHP cho mọi form; phân trang động (Pagination) hoạt động chính xác với dữ liệu MySQL.
- [ ] **Upload ảnh lên server:** Ảnh động được tải trực tiếp vào `public/uploads/...` thông qua `app/core/Uploader.php` (kiểm tra MIME và dung lượng).
- [ ] **Bảo mật & SEO:** 100% truy vấn dùng PDO Prepared Statements (chống SQL Injection), escape dữ liệu hiển thị bằng `e()` / `htmlspecialchars()` (chống XSS), có CSRF token cho mọi form POST, kiểm tra đúng phân quyền vai trò (`AuthMiddleware`) và đầy đủ thẻ meta/thuộc tính `alt` ảnh phục vụ SEO.
- [ ] **Kiểm thử chạy thật:** Đã chạy thử ổn định không lỗi trên Docker Compose (`http://localhost:8080`) hoặc XAMPP trước khi mở PR.

## 📸 Minh chứng Kiểm thử (Screenshots)
<!-- Dán ảnh chụp giao diện (Desktop & Mobile), ảnh kết quả xanh từ W3C Validator (0 errors) hoặc ảnh minh chứng chức năng PHP/MySQL hoạt động vào bên dưới -->