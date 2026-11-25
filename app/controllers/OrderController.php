<?php
declare(strict_types=1);

class OrderController extends Controller
{
    public function index(): void
    {
        $this->render('client/home/index', ['title' => 'OrderController']);
    }
}

