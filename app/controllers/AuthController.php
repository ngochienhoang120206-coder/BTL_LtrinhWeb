<?php
declare(strict_types=1);

class AuthController extends Controller
{
    public function index(): void
    {
        $this->render('client/home/index', ['title' => 'AuthController']);
    }
}

