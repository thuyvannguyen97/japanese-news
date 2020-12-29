<?php

namespace App\Http\Controllers\Backend;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class HomeController extends Controller
{
    //
    public function __construct(){
       
    }

    public function index(){
        return view('backend.index');
    }
}
