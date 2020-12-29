<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

Route::group([
    'namespace' => 'Api'
], function(){
    // news
    Route::group([
        'prefix' => 'news'
    ], function(){
        Route::get('{page}/{limit}', 'NewsController@newsWithPage');
    });
    // crawler

    Route::group([
        'prefix' => 'crawler'
    ], function(){
        Route::get('matcha', 'MatchaController@crawler');
    });

    Route::group([
        'prefix' => 'code'
    ], function(){
        Route::post('active', 'CodeController@active');

        Route::get('/', 'CodeController@getCode');
    });

    // version
    Route::group([
        'prefix' => 'version'
    ], function(){
        Route::get('current/{name}', 'VersionController@getCurrent');
    });
});
