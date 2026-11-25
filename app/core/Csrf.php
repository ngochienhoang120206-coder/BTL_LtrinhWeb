<?php

declare(strict_types=1);

class Csrf
{
    public static function token(): string
    {
        if (empty($_SESSION['csrf_token'])) {
            $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
        }
        return $_SESSION['csrf_token'];
    }

    public static function field(): string
    {
        return '<input type="hidden" name="csrf_token" value="' . e(self::token()) . '">';
    }

    public static function verify(?string $submittedToken): bool
    {
        if (empty($_SESSION['csrf_token']) || empty($submittedToken)) {
            return false;
        }
        return hash_equals($_SESSION['csrf_token'], $submittedToken);
    }
}