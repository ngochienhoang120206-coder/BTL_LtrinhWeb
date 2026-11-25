<?php
declare(strict_types=1);

class AboutAdminController extends Controller
{
    public function index(): void
    {
        $this->render('admin/dashboard/index', ['title' => 'AboutAdminController']);
    }
}

