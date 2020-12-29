<?php

namespace App\Http\Middleware;

use Closure;
use Auth;

class AdminRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next, $guard = 'admin')
    {
        // nếu là admintrator thì thực hiện các request
        if(Auth::guard($guard)->check()){
            $role = Auth::guard($guard)->user()->role;
            if($role == 1){
                return $next($request);
            }
            return $request->back();
        }
        return redirect()->route('admin.login');
    }
}
