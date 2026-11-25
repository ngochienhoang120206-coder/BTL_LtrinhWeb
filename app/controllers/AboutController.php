<?php
declare(strict_types=1);

class AboutController extends Controller
{
    public function index(): void
    {
        $this->render('client/home/index', ['title' => 'AboutController']);
    }
}

