<?php
declare(strict_types=1);

class NewsAdminController extends Controller
{
    public function index(): void
    {
        $this->render('admin/dashboard/index', ['title' => 'NewsAdminController']);
    }
}

