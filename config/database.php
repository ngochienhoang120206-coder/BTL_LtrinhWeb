<?php
declare(strict_types=1);

return [
    'host' => getenv('DB_HOST') ?: '127.0.0.1',
    'port' => getenv('DB_PORT') ?: '3306',
    'name' => getenv('DB_NAME') ?: 'verde_sana',
    'user' => getenv('DB_USER') ?: 'verde_sana',
    'password' => getenv('DB_PASSWORD') ?: 'verde_sana',
    'charset' => 'utf8mb4',
];
