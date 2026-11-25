<?php

declare(strict_types=1);

define('ROOT_PATH', dirname(__DIR__));
define('APP_PATH', ROOT_PATH . '/app');
define('PUBLIC_PATH', ROOT_PATH . '/public');
define('UPLOAD_PATH', PUBLIC_PATH . '/uploads');

/**
 * Đọc biến môi trường từ tệp .env bằng PHP thuần
 */
function loadEnv(string $filePath): void
{
    if (!is_readable($filePath)) {
        return;
    }

    $lines = file($filePath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        $line = trim($line);
        if ($line === '' || str_starts_with($line, '#') || !str_contains($line, '=')) {
            continue;
        }

        [$key, $value] = explode('=', $line, 2);
        $key = trim($key);
        $value = trim($value, " \t\n\r\0\x0B\"'");

        if (!array_key_exists($key, $_ENV) && getenv($key) === false) {
            $_ENV[$key] = $value;
            putenv("$key=$value");
        }
    }
}

loadEnv(ROOT_PATH . '/.env');

function env(string $key, string $default = ''): string
{
    $val = $_ENV[$key] ?? getenv($key);
    return ($val === false || $val === null) ? $default : (string) $val;
}

/**
 * Escape dữ liệu đầu ra HTML để phòng chống XSS
 */
function e(?string $value): string
{
    return htmlspecialchars((string) $value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

define('BASE_URL', rtrim(env('BASE_URL', 'http://localhost:8080'), '/'));
define('ITEMS_PER_PAGE', 10);