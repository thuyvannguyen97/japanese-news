<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Input;
use Redirect;
use Response;
use Session;
use App\Models\Admin;

class HomeController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        // $this->middleware('auth');
    }

    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return view('home');
    }

    public function error(){
        return view('error');
    }

    public function login(){
        return view('frontend.login.login');
    }

    public function checkLogin(Request $request){
        $input = Input::all();
            $email = $input['email'];
            $password = $input['password'];
            if($this->checkUser($email, $password)){
                return Redirect::route('web.home', compact('email'));
            }
            else{
                view('frontend.login.login');
            }
    }

    public function checkUser($email, $password){
        if (Auth::guard('admin')->attempt(['email' => $email, 'password' => $password], true)) { 
            return true;
        } else {
            return false;
        }
    }
    public function register(){
        return view('frontend.login.register');
    }
    
    public function addUser(Request $request){
        $input = Input::all();
        
        $name = $input['name'];
        $email = $input['email'];
        $password = $input['password'];
        $checkExit = Admin::where('email', $email)->first();
        if ($checkExit === null) {
            $add =  Admin::create([
                'name'  => $name,
                'email' => $email,
                'password' => bcrypt($password)
            ]);
            return view('frontend.login.login');
        } else {
            $mess = " Tài khoản đã tồn tại. ";
            return view('frontend.login.register', compact('mess'));
        } 
    }

    public function logout(){
        Auth::guard('admin')->logout();
        if (!Auth::check() && !Auth::guard('admin')->check()) {
            Session::flush();
            Session::regenerate();
        }
        return redirect()->route('login');
    }

}
