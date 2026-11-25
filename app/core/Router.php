<?php

declare(strict_types=1);

class Router
{
    private array $routes = [];

    public function get(string $path, callable|array $handler): void
    {
        $this->addRoute('GET', $path, $handler);
    }

    public function post(string $path, callable|array $handler): void
    {
        $this->addRoute('POST', $path, $handler);
    }

    private function addRoute(string $method, string $path, callable|array $handler): void
    {
        $pattern = preg_replace('#\{([a-zA-Z_][a-zA-Z0-9_]*)\}#', '(?P<$1>[^/]+)', trim($path, '/'));
        $this->routes[$method][] = [
            'regex'   => '#^' . $pattern . '$#',
            'handler' => $handler,
        ];
    }

    public function dispatch(string $method, string $requestUri): void
    {
        $uriPath = parse_url($requestUri, PHP_URL_PATH) ?? '/';

        // Tự động cắt phần thư mục gốc nếu chạy trong subfolder trên XAMPP
        $scriptDir = rtrim(str_replace('\\', '/', dirname($_SERVER['SCRIPT_NAME'])), '/');
        if ($scriptDir !== '' && str_starts_with($uriPath, $scriptDir)) {
            $uriPath = substr($uriPath, strlen($scriptDir));
        }

        $uriPath = trim($uriPath, '/');

        foreach ($this->routes[$method] ?? [] as $route) {
            if (preg_match($route['regex'], $uriPath, $matches)) {
                $params = array_filter($matches, 'is_string', ARRAY_FILTER_USE_KEY);
                $handler = $route['handler'];

                if (is_callable($handler)) {
                    call_user_func_array($handler, array_values($params));
                    return;
                }

                [$controllerClass, $action] = $handler;
                $controller = new $controllerClass();
                call_user_func_array([$controller, $action], array_values($params));
                return;
            }
        }

        http_response_code(404);
        echo '<h1>404 - Không tìm thấy trang</h1>';
    }
}