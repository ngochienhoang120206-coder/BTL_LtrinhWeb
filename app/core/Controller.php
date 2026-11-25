<?php

declare(strict_types=1);

class Controller
{
    protected function view(string $viewPath, array $data = [], ?string $layout = 'client_layout'): void
    {
        extract($data, EXTR_SKIP);

        $viewFile = APP_PATH . '/views/' . ltrim($viewPath, '/') . '.php';
        if (!file_exists($viewFile)) {
            http_response_code(500);
            echo "Không tìm thấy view: " . e($viewPath);
            return;
        }

        ob_start();
        require $viewFile;
        $content = ob_get_clean();

        if ($layout === null) {
            echo $content;
            return;
        }

        $layoutFile = APP_PATH . '/views/layouts/' . $layout . '.php';
        if (!file_exists($layoutFile)) {
            echo $content;
            return;
        }

        require $layoutFile;
    }

    protected function redirect(string $path): void
    {
        header('Location: ' . BASE_URL . '/' . ltrim($path, '/'));
        exit;
    }
}