<?php
declare(strict_types=1);

class ContactController extends Controller
{
    public function index(): void
    {
        $this->render('client/home/index', ['title' => 'ContactController']);
    }
}

