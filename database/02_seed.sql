USE verde_sana;

INSERT INTO users (name, email, password_hash, role) VALUES
('Quản trị Verde Sana', 'admin@verdesana.local', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'admin');

INSERT INTO categories (name, slug) VALUES
('Salad', 'salad'),
('Cold-Pressed Juice', 'cold-pressed-juice'),
('Smoothie', 'smoothie'),
('Detox', 'detox');

INSERT INTO products (category_id, name, slug, description, price, kcal) VALUES
(1, 'Green Garden Salad', 'green-garden-salad', 'Salad rau xanh tươi với sốt đặc trưng.', 65000, 280),
(2, 'Green Detox Juice', 'green-detox-juice', 'Nước ép xanh ép lạnh không đường.', 75000, 150),
(3, 'Berry Power Smoothie', 'berry-power-smoothie', 'Smoothie berry giàu vitamin.', 79000, 220),
(4, '7-Day Detox Pack', '7-day-detox-pack', 'Gói thanh lọc cơ thể 7 ngày.', 490000, 900);

INSERT INTO posts (title, slug, content, meta_title, meta_description) VALUES
('Chào mừng đến Verde Sana', 'chao-mung-den-verde-sana',
 'Khám phá thực đơn salad và đồ uống lành mạnh.',
 'Verde Sana - Thức ăn xanh',
 'Thực đơn Salad, Juice, Smoothie và Detox lành mạnh.');

INSERT INTO settings (id, company_name, phone, email, address) VALUES
(1, 'Verde Sana', '0900000000', 'hello@verdesana.local', 'TP. Ho Chi Minh');

INSERT INTO about_content (id, title, content) VALUES
(1, 'Ve Verde Sana', 'Verde Sana mang den bua an xanh, tuoi va lanh manh moi ngay.');

INSERT INTO faqs (question, answer, sort_order) VALUES
('Verde Sana co giao hang khong?', 'Co. Cac khu vuc giao hang se duoc he thong cap nhat tai buoc thanh toan.', 1),
('Co the tu tron Salad khong?', 'Co. Ban co the chon day, nguyen lieu va sauce theo muc gia cong khai.', 2);

INSERT INTO salad_ingredients (name, type, price) VALUES
('Rau mix', 'base', 25000),
('Xa lach', 'base', 20000),
('Avocado', 'ingredient', 30000),
('Trung ga', 'ingredient', 15000),
('Mật ong lime', 'sauce', 10000);
