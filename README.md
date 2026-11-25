## 1. Hướng dẫn Cài đặt & Chạy dự án

### Cách 1: Chạy bằng Docker Compose (Khuyên dùng)

1. **Clone kho mã nguồn về máy:**
```bash
git clone [https://github.com/ngochienhoang120206-coder/BTL_LtrinhWeb.git](https://github.com/ngochienhoang120206-coder/BTL_LtrinhWeb.git)
cd BTL_LtrinhWeb
```

2. **Tạo tệp cấu hình biến môi trường ở thư mục gốc:**
```bash
cp .env.example .env
```

3. **Build và khởi chạy toàn bộ container (Apache + PHP 8.2, MySQL 8.0, phpMyAdmin):**
```bash
docker compose up --build -d
```
*(Lưu ý: Trong lần khởi chạy đầu tiên, container MySQL sẽ tự động nạp cấu trúc bảng từ `database/01_schema.sql` và dữ liệu mẫu từ `database/02_seed.sql`.)*

4. **Kiểm tra lại trạng thái nạp dữ liệu mẫu (chỉ chạy khi cần khởi tạo lại CSDL từ đầu):**
```bash
docker exec -i verde_sana_mysql mysql -u root -p"${DB_ROOT_PASS}" "${DB_NAME}" < database/01_schema.sql
docker exec -i verde_sana_mysql mysql -u root -p"${DB_ROOT_PASS}" "${DB_NAME}" < database/02_seed.sql
```

5. **Truy cập ứng dụng và công cụ quản trị CSDL:**
- Mở trình duyệt tại `http://localhost:8080` để truy cập website **Công ty TNHH Verde Sana**.
- Truy cập trang quản trị (Admin — Tailadmin) tại `http://localhost:8080/admin`.
- Truy cập **phpMyAdmin** tại `http://localhost:8081` để kiểm tra cơ sở dữ liệu MySQL.

6. **Dừng các container sau khi kết thúc phiên làm việc/demo:**
```bash
docker compose down
```

---

### Cách 2: Chạy thủ công trên máy cục bộ (XAMPP — Không dùng Docker)

- Đảm bảo đã cài đặt **XAMPP** có **PHP >= 7.0** (khuyến nghị PHP 8.1/8.2), **Apache** (đã bật `mod_rewrite`) và **MySQL/MariaDB**.
- Sao chép thư mục dự án `BTL_LtrinhWeb` vào thư mục gốc của web server (ví dụ: `C:\xampp\htdocs\BTL_LtrinhWeb`).

#### 1. Khởi tạo Cơ sở dữ liệu MySQL:
- Mở `http://localhost/phpmyadmin`, tạo cơ sở dữ liệu mới tên `verde_sana_db` (mã hóa `utf8mb4_unicode_ci`).
- Lần lượt Import tệp `database/01_schema.sql` và `database/02_seed.sql`.

#### 2. Cấu hình kết nối môi trường cục bộ:
```bash
cp .env.example .env
```
- Mở tệp `.env` và cập nhật thông số cục bộ (`DB_HOST=127.0.0.1`, `DB_NAME=verde_sana_db`, `DB_USER=root`, `DB_PASS=`, `BASE_URL=http://localhost/BTL_LtrinhWeb/public`).

#### 3. Khởi chạy và kiểm thử:
- Khởi động **Apache** và **MySQL** trong XAMPP Control Panel.
- Truy cập `http://localhost/BTL_LtrinhWeb/public` trên trình duyệt (Chrome, Edge, Firefox).
- Kiểm tra chuẩn HTML5/CSS3 bằng công cụ W3C Validator (`http://validator.w3.org`) và kiểm thử Responsive (Mobile / Tablet / Desktop) trên từng trang trước khi báo cáo.

---

## 2. Quy trình làm việc Git của nhóm

### 2.1. Cấu trúc tổ chức nhánh & Bảng tham chiếu công việc

Nhóm áp dụng mô hình phân tầng **3 cấp nhánh** gọn nhẹ (`main` ➔ `dev` ➔ 11 nhánh công việc con `feat/...`). Khung dự án `[C1]` (Docker + lõi MVC PHP thuần) đã được Trưởng nhóm khởi tạo sẵn trên `main`/`dev`:

```text
main                                    <-- Nhánh phát hành cuối cùng (chỉ Trưởng nhóm merge từ dev ở bước cuối)
└── dev                                 <-- Nhánh tích hợp chung duy nhất của cả nhóm (Default branch)
    ├── feat/tv1-c3-layout-tailadmin    <-- [C3] TV1: Template chung Client + Khung Admin Tailadmin & Dashboard
    ├── feat/tv1-r1-home-contact        <-- [R1] TV1: Trang chủ, Trang Liên hệ & Admin Cấu hình/Liên hệ
    ├── feat/tv2-c2-database-seed       <-- [C2] TV2: Thiết kế CSDL MySQL (01_schema.sql & 02_seed.sql)
    ├── feat/tv2-c6-admin-users         <-- [C6] TV2: Admin quản lý người dùng (xem, sửa, reset MK, khóa, xóa)
    ├── feat/tv2-r2-about-faq           <-- [R2] TV2: Trang Giới thiệu, Hỏi/đáp (FAQ) & Admin quản lý
    ├── feat/tv3-c4-auth-rbac           <-- [C4] TV3: Đăng ký, Đăng nhập & Phân quyền 3 vai trò
    ├── feat/tv3-r3-products-salad      <-- [R3] TV3: Thực đơn, Tự trộn Salad & Bảng giá, Chi tiết SP & Admin SP
    ├── feat/tv3-r3-cart-orders         <-- [R3] TV3: Giỏ hàng, Thanh toán, Lịch sử đơn & Admin Đơn hàng
    ├── feat/tv4-c5-member-profile      <-- [C5] TV4: Hồ sơ thành viên, đổi mật khẩu, upload avatar
    ├── feat/tv4-r4-news-seo            <-- [R4] TV4: Danh sách/Đọc Tin tức & Admin Tin tức/SEO
    └── feat/tv4-r4-comments            <-- [R4] TV4: Bình luận/Đánh giá & Admin kiểm duyệt bình luận
```

| Thành viên | Nhánh công việc (`feat/...`) | Phạm vi công việc thực hiện trên nhánh |
| :--- | :--- | :--- |
| **Thành viên 1** | `feat/tv1-c3-layout-tailadmin`<br>`feat/tv1-r1-home-contact` | `[C3]` Layout chung Client (`variables.css`), Tailadmin miễn phí, Dashboard<br>`[R1]` Trang chủ, Liên hệ, Admin cấu hình công ty & quản lý liên hệ |
| **Thành viên 2** | `feat/tv2-c2-database-seed`<br>`feat/tv2-c6-admin-users`<br>`feat/tv2-r2-about-faq` | `[C2]` Toàn bộ CSDL MySQL (`database/01_schema.sql`, `02_seed.sql`)<br>`[C6]` Admin quản lý người dùng (`UserModel`, `UserAdminController`)<br>`[R2]` Trang Giới thiệu, Trang Hỏi/đáp (FAQ) & Admin quản lý nội dung/FAQ |
| **Thành viên 3** | `feat/tv3-c4-auth-rbac`<br>`feat/tv3-r3-products-salad`<br>`feat/tv3-r3-cart-orders` | `[C4]` Đăng ký, Đăng nhập, `AuthMiddleware` phân quyền Khách/Thành viên/Admin<br>`[R3]` Thực đơn, Tự trộn Salad & Bảng giá, Chi tiết SP, Admin Sản phẩm/Nguyên liệu<br>`[R3]` Giỏ hàng, Thanh toán, Lịch sử đơn thành viên, Admin Giỏ hàng/Đơn hàng |
| **Thành viên 4** | `feat/tv4-c5-member-profile`<br>`feat/tv4-r4-news-seo`<br>`feat/tv4-r4-comments` | `[C5]` Hồ sơ cá nhân, đổi mật khẩu, upload avatar lên `public/uploads/avatars/`<br>`[R4]` Danh sách/Đọc Tin tức, Admin Tin tức (WYSIWYG + thẻ SEO), `robots.txt`, `sitemap.xml`<br>`[R4]` Bình luận/đánh giá sản phẩm & bài viết, Admin quản lý bình luận |

---

### 2.2. Hướng dẫn khởi tạo & Nhận nhánh làm việc (Thực hiện 1 lần lúc bắt đầu dự án)

#### Bước A — Trưởng nhóm khởi tạo nhánh `dev` từ `main` và tạo toàn bộ 11 nhánh con từ `dev`:
```bash
# 1. Đảm bảo đang ở nhánh main và đã cập nhật bản mới nhất
git checkout main
git pull origin main

# 2. Tạo nhánh dev từ main và đẩy lên GitHub (sau bước này chuyển Default branch trên GitHub sang dev)
git checkout -b dev
git push -u origin dev

# 3. Từ nhánh dev, tạo toàn bộ 11 nhánh công việc con
git checkout dev && git checkout -b feat/tv1-c3-layout-tailadmin
git checkout dev && git checkout -b feat/tv1-r1-home-contact

git checkout dev && git checkout -b feat/tv2-c2-database-seed
git checkout dev && git checkout -b feat/tv2-c6-admin-users
git checkout dev && git checkout -b feat/tv2-r2-about-faq

git checkout dev && git checkout -b feat/tv3-c4-auth-rbac
git checkout dev && git checkout -b feat/tv3-r3-products-salad
git checkout dev && git checkout -b feat/tv3-r3-cart-orders

git checkout dev && git checkout -b feat/tv4-c5-member-profile
git checkout dev && git checkout -b feat/tv4-r4-news-seo
git checkout dev && git checkout -b feat/tv4-r4-comments

# 4. Đẩy toàn bộ các nhánh vừa tạo lên GitHub và quay lại nhánh dev
git push -u origin --all
git checkout dev
```

#### Bước B — Từng thành viên nhận nhánh công việc của mình từ GitHub:
*(Thay `feat/tv<x>-<ten-nhanh-con>` bằng đúng tên nhánh trong bảng Mục 2.1)*
```bash
# 1. Tải toàn bộ danh sách nhánh mới nhất từ GitHub
git fetch origin

# 2. Chuyển sang nhánh công việc được phân công và kéo code mới nhất
git checkout feat/tv<x>-<ten-nhanh-con>
git pull origin feat/tv<x>-<ten-nhanh-con>
```

---

### 2.3. Quy trình làm việc hằng ngày (Pull, Commit, Push & Pull Request)

> **Nguyên tắc bắt buộc:**
> - **TUYỆT ĐỐI KHÔNG** commit hoặc push trực tiếp lên nhánh `main` và nhánh `dev`.
> - Mọi thành viên chỉ code trên nhánh công việc con `feat/tv<x>-...`, sau đó tạo Pull Request gộp trực tiếp vào nhánh `dev`.
> - Chỉ **Trưởng nhóm** mới thực hiện merge `dev` vào `main` ở bước cuối cùng sau khi toàn bộ hệ thống trên `dev` chạy ổn định, không lỗi.

#### 1. Đồng bộ code mới nhất từ `dev` về nhánh công việc trước khi bắt đầu code:
```bash
# Bước 1: Cập nhật nhánh dev cục bộ
git checkout dev
git pull origin dev

# Bước 2: Chuyển sang nhánh công việc và cập nhật thay đổi mới nhất từ dev
git checkout feat/tv<x>-<ten-nhanh-con>
git pull origin feat/tv<x>-<ten-nhanh-con>
git merge dev
```
*(Nếu phát sinh xung đột khi chạy `git merge dev`, xử lý xong rồi commit lại trước khi tiếp tục code).*

#### 2. Commit các thay đổi trên nhánh công việc (có thể commit nhiều lần):
- Viết thông điệp commit ngắn gọn, rõ ràng (không đưa `Closes #<so-issue>` vào commit message và **không bao giờ** stage tệp `.env` hoặc ảnh rác):
```bash
git status
git add <duong-dan-file-thay-doi>
git commit -m "feat(tv<x>): <mô tả ngắn gọn nội dung thay đổi>"
```

#### 3. Đẩy nhánh công việc lên GitHub:
```bash
# Kéo lại nếu có thay đổi từ máy khác trước khi push
git pull origin feat/tv<x>-<ten-nhanh-con>
git push origin feat/tv<x>-<ten-nhanh-con>
```

#### 4. Tạo Pull Request (PR) từ nhánh công việc vào `dev`:
- Trước khi mở PR, kéo lại `dev` mới nhất vào `feat/tv<x>-<ten-nhanh-con>` (`git checkout dev && git pull origin dev`, sau đó `git checkout feat/tv<x>-<ten-nhanh-con> && git merge dev && git push origin feat/tv<x>-<ten-nhanh-con>`) để chắc chắn không có xung đột.
- Tự kiểm tra lỗi W3C, validate JS/PHP và chạy thử Docker không lỗi.
- Trên GitHub, bấm **Compare & pull request** để mở PR từ **`feat/tv<x>-<ten-nhanh-con>`** ➔ **`dev`** (kiểm tra kỹ Base branch là `dev`, tuyệt đối không trỏ vào `main`).
- Hoàn thành checklist trong mẫu PR và ghi `Closes #<so-issue>` **một lần duy nhất** ở phần mô tả PR để GitHub tự động chuyển Issue sang cột **Done** khi Trưởng nhóm duyệt và merge vào `dev`.

#### 5. Đóng gói phát hành cuối cùng — Merge `dev` vào `main` (Chỉ Trưởng nhóm thực hiện):
Chỉ thực hiện khi toàn bộ các trang giao diện (16 Client/Member + 10 Admin), CSDL MySQL, bảo mật, SEO và Docker Compose trên nhánh `dev` đã chạy hoàn hảo cho buổi Demo:
```bash
git checkout dev
git pull origin dev

git checkout main
git pull origin main
git merge --no-ff dev -m "release: hoàn thiện phiên bản báo cáo cuối kỳ Verde Sana"
git push origin main
```