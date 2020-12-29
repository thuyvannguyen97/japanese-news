<?php

namespace App\Http\Middleware;

use Closure;
use Session;
use App;
use Config;

class Locale
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        if (!Session::has('locale')) {
            $lang_browser = (isset($_SERVER['HTTP_ACCEPT_LANGUAGE'])) ? substr($_SERVER['HTTP_ACCEPT_LANGUAGE'], 0, 2) : '';
            
            if(in_array($lang_browser, ['ko', 'vi', 'cn'])){
                Session::put('locale', $lang_browser);
            } else {
                Session::put('locale', 'vi');
            }
        }

        App::setLocale(Session::get('locale'));
        
        $lang = Config::get('constants.lang');
        $curLang = [
            Session::get('locale') => $lang[Session::get('locale')]
        ];
        

        $lang = array_diff($lang, $curLang);
       
        \View::share('curLang', $curLang);
        \View::share('lang', $lang);

        return $next($request);
    }
}
