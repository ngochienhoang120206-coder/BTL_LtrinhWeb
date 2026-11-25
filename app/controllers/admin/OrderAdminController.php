<?php
declare(strict_types=1);

class OrderAdminController extends Controller
{
    public function index(): void
    {
        $this->render('admin/dashboard/index', ['title' => 'OrderAdminController']);
    }
}

