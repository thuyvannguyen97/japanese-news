<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Auth;
use Session;

class AdminAuthenticate
{
    // nếu chưa đăng nhập bên admin thì trả về route có tên admin.login
    // đã đăng nhâp thì thực hiện yêu cầu request
    public function handle($request, Closure $next, $guard = 'admin')
    {
        if (!Auth::guard($guard)->check()) {
            return redirect('/admin');
        }
        
        return $next($request);
    }
}
