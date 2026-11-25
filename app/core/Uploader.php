<?php

declare(strict_types=1);

class Uploader
{
    private const ALLOWED_MIMES = [
        'image/jpeg' => 'jpg',
        'image/png'  => 'png',
        'image/webp' => 'webp',
    ];

    private const MAX_SIZE = 5 * 1024 * 1024; // 5MB

    /**
     * Trả về đường dẫn tương đối để lưu DB (ví dụ: uploads/products/abc123.jpg)
     */
    public static function uploadImage(array $file, string $subDir): string
    {
        if (($file['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) {
            throw new RuntimeException('Tải tệp lên thất bại.');
        }

        if (($file['size'] ?? 0) > self::MAX_SIZE) {
            throw new RuntimeException('Ảnh vượt quá dung lượng tối đa 5MB.');
        }

        $finfo = new finfo(FILEINFO_MIME_TYPE);
        $mime = $finfo->file($file['tmp_name']);
        if (!isset(self::ALLOWED_MIMES[$mime])) {
            throw new RuntimeException('Chỉ chấp nhận định dạng ảnh JPG, PNG hoặc WEBP.');
        }

        $safeSubDir = preg_replace('/[^a-z0-9_-]/i', '', $subDir);
        $targetDir = UPLOAD_PATH . '/' . $safeSubDir;
        if (!is_dir($targetDir)) {
            mkdir($targetDir, 0755, true);
        }

        $filename = date('Ymd_His') . '_' . bin2hex(random_bytes(6)) . '.' . self::ALLOWED_MIMES[$mime];
        $destination = $targetDir . '/' . $filename;

        if (!move_uploaded_file($file['tmp_name'], $destination)) {
            throw new RuntimeException('Không thể lưu tệp hình ảnh lên máy chủ.');
        }

        return 'uploads/' . $safeSubDir . '/' . $filename;
    }
}