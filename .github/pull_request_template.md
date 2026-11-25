## 📝 Mô tả Pull Request
<!-- Mô tả ngắn gọn tính năng đã hoàn thiện hoặc lỗi đã sửa trong PR này -->
- **Thành viên thực hiện:** TV...
- **Mã công việc (theo phân công):** `[C...]` / `[R...]`
- **Loại Pull Request (đánh dấu X vào 1 mục phù hợp):**
  - [ ] Gộp nhánh công việc con (`feat/tv<x>-...`) ➔ nhánh thành viên (`member/tv<x>`)
  - [ ] Gộp nhánh thành viên (`member/tv<x>`) ➔ nhánh tích hợp (`dev`)
- **Nội dung thay đổi chính:**
  - 

## 🔗 Liên kết Issue (Kanban Automation)
<!-- Chỉ điền số thứ tự Issue sau dấu # (ví dụ: Closes #4) khi tạo PR merge vào nhánh `dev` để tự động chuyển thẻ sang Done -->
Closes #

## 🌿 Checklist Quy trình Git & Nhánh (Theo README.md)
- [ ] Tạo nhánh con đúng quy ước `feat/tv<x>-<ten-nhanh-con>` từ `member/tv<x>` (không tạo từ `main` và không push trực tiếp lên `main` hoặc `dev`).
- [ ] Đã kéo và đồng bộ code mới nhất (`git pull` & `git merge`) từ `dev` và `member/tv<x>` trước khi mở PR để tránh xung đột (merge conflict).
- [ ] Đã chọn đúng nhánh đích (Base branch) là `member/tv<x>` hoặc `dev` (tuyệt đối không trỏ vào `main`).
- [ ] Đã kiểm tra tệp thay đổi bằng `git status` trước khi commit; commit message rõ ràng và không ghi `Closes #` trong commit message.
- [ ] **An toàn kho mã nguồn:** Không đính kèm tệp `.env`, thông tin mật khẩu CSDL cá nhân hoặc ảnh upload thử nghiệm trong `public/uploads/`.

## ✅ Checklist Tiêu chuẩn Đề tài & Bảo mật (Verde Sana)
- [ ] **Ngôn ngữ & Kiến trúc:** Chỉ dùng PHP thuần (>= 7.0) + MySQL + HTML5/CSS3/JS theo mô hình MVC tự viết; tuyệt đối không sử dụng PHP Framework, CMF hay CMS.
- [ ] **Giao diện & W3C:** Đã kiểm tra HTML5/CSS3 trên `http://validator.w3.org` (không còn lỗi Error), hiển thị tốt Responsive (Mobile/Tablet/Desktop) và trang Admin dùng đúng khung **Tailadmin** miễn phí.
- [ ] **Hình ảnh:** Toàn bộ ảnh động đều được upload trực tiếp lên thư mục nội bộ `public/uploads/...`, không sử dụng URL hình ảnh bên ngoài website.
- [ ] **Validation & Phân trang:** Đã kiểm tra dữ liệu đầu vào ở cả Javascript (Client) và PHP (Server) cho tất cả form; các danh sách dài và trang quản trị đã có phân trang (Pagination).
- [ ] **Bảo mật & SEO:** Truy vấn dùng PDO Prepared Statements (chống SQL Injection), escape dữ liệu hiển thị bằng `e()` / `htmlspecialchars()` (chống XSS), có CSRF token cho form POST, kiểm tra đúng phân quyền vai trò và đảm bảo thẻ meta/thuộc tính `alt` ảnh phục vụ SEO.
- [ ] **Kiểm thử chạy thật:** Đã chạy thử ổn định không lỗi trên Docker Compose (`http://localhost:8080`) hoặc XAMPP trước khi mở PR.

## 📸 Minh chứng Kiểm thử (Screenshots)
<!-- Dán ảnh chụp giao diện (Desktop & Mobile), ảnh kết quả kiểm tra W3C Validator hoặc ảnh minh chứng chức năng PHP/MySQL hoạt động vào bên dưới -->