<?php
declare(strict_types=1);

class FaqController extends Controller
{
    public function index(): void
    {
        $this->render('client/home/index', ['title' => 'FaqController']);
    }
}

