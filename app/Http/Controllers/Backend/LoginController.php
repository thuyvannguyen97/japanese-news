<?php

namespace App\Http\Controllers\Backend;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Input;
use Illuminate\Foundation\Auth\AuthenticatesUsers;
use Redirect;
use Log;
use Session;

class LoginController extends Controller
{

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    use AuthenticatesUsers;

    protected $redirectTo = 'admin/dashboard';
    
    //hàm khởi tạo xác thực là guest của admin khi truy cập
    public function __construct()
    {
        $this->middleware('web', ['except' => 'logout']);
    }


    public function login(Request $request){
        if($request->isMethod('post')){
            $input = Input::all();
            $email = $input['email'];
            $password = $input['password'];
            if($this->checkLogin($email, $password)){
                return Redirect::route('admin.dashboard');
            }
            return view('backend.login.index')->with(['message' => "The email address or the password that you've entered is incorrect"]);
        }
        return view('backend.login.index');
    }

    public function checkLogin($email, $password){
        if (Auth::guard('admin')->attempt(['email' => $email, 'password' => $password, 'status' => 1], true)) { 
            return true;
        } else {
            return false;
        }
    }

}
