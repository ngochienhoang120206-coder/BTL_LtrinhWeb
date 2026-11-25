<?php

declare(strict_types=1);

session_set_cookie_params([
    'httponly' => true,
    'samesite' => 'Lax',
]);
session_start();

require_once dirname(__DIR__) . '/config/config.php';

// Autoloader PHP thuần cho các thư mục trong app/
spl_autoload_register(function (string $className): void {
    $directories = [
        APP_PATH . '/core/',
        APP_PATH . '/models/',
        APP_PATH . '/controllers/',
        APP_PATH . '/controllers/admin/',
    ];

    foreach ($directories as $dir) {
        $file = $dir . $className . '.php';
        if (file_exists($file)) {
            require_once $file;
            return;
        }
    }
});

$router = new Router();

// Route kiểm tra nhanh sau khi chạy Docker (khi có HomeController thì thay bằng [HomeController::class, 'index'])
$router->get('/', function (): void {
    echo '<h1>Công ty TNHH Verde Sana — Khung MVC PHP thuần đã sẵn sàng!</h1>';
    echo '<p>Kiểm tra kết nối MySQL tại <a href="' . e(BASE_URL) . '/health">/health</a></p>';
});

$router->get('/health', function (): void {
    header('Content-Type: application/json; charset=utf-8');
    try {
        $pdo = Database::getConnection();
        $version = $pdo->query('SELECT VERSION()')->fetchColumn();
        echo json_encode([
            'status'        => 'ok',
            'php_version'   => PHP_VERSION,
            'mysql_version' => $version,
        ], JSON_UNESCAPED_UNICODE);
    } catch (Throwable $e) {
        http_response_code(500);
        echo json_encode([
            'status'  => 'error',
            'message' => $e->getMessage(),
        ], JSON_UNESCAPED_UNICODE);
    }
});

/*
 * Nơi đăng ký các route chính của 4 thành viên sau khi có Controller:
 * $router->get('/', [HomeController::class, 'index']);
 * $router->get('/san-pham', [ProductController::class, 'index']);
 * $router->get('/san-pham/{slug}', [ProductController::class, 'detail']);
 * $router->get('/tu-tron-salad', [SaladBuilderController::class, 'index']);
 */

$router->dispatch($_SERVER['REQUEST_METHOD'], $_SERVER['REQUEST_URI']);