<?php

/*
|--------------------------------------------------------------------------
| Backend Routes
|--------------------------------------------------------------------------
|
| Here is where you can register Backend routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "Backend" middleware group. Now create something great!
|
*/

Route::group([
    'namespace'  => 'Backend'
], function(){
    Route::auth();

    Route::get('/', 'LoginController@login')->name('admin');
    
    Route::match(['get', 'post'], 'login', 'LoginController@login')->name('admin.login');
    // Route for users
    Route::match(['get', 'post'], 'register', 'AdminController@register')->name('admin.register');

    // after login
    Route::group([
        'middleware' => 'admin'
    ], function(){
        Route::get('logout', 'AdminController@logout')->name('admin.logout');
        
        Route::get('dashboard', 'HomeController@index')->name('admin.dashboard');

     

        Route::group([
            'middleware' => 'administrator'
        ], function(){
            Route::get('users', 'AdminController@index')->name('admin.users');

            Route::match(['get', 'post'], 'collaborator', 'AdminController@getCollaborator')->name('admin.collaborator');

            Route::post('colla', 'AdminController@collaboMonth')->name('admin.ajax.collabo');

            Route::get('cmt-manager', 'AdminController@manageComment')->name('admin.cmt-manager');

            Route::get('community-manager', 'AdminController@manageCommunity')->name('admin.community-manager');
            
            Route::get('community-comment-manager', 'AdminController@manageCommunityComment')->name('admin.community-comment-manager');

            Route::get('translate-manager', 'AdminController@manageTranslating')->name('admin.translate-manager');

            Route::get('trans-user-manager', 'AdminController@manageTransUser')->name('admin.trans-user-manager');

			Route::post( 'active-comment',[ 'as' => 'backend.ajax.comment', 'uses' => 'AdminController@activeComment' ] );
        
            // Route for ajax
            Route::post('active', 'AdminController@activeUser')->name('admin.active');
        
            Route::post('change-role', 'AdminController@changeRole')->name('admin.changeRole');
        
            Route::post('delete-user', 'AdminController@delete')->name('admin.deleteUser');
        });

        
        
        // Route for news
        Route::match(['get', 'post'], 'news', 'NewsController@index')->name('admin.news');
    
        Route::post('convert-furi', 'NewsController@toFuri')->name('admin.Furi');

        Route::post('convert-furi-edit', 'NewsController@toFuriEdit')->name('admin.Furi.Edit');
    
        Route::post('create-news', 'NewsController@createNews')->name('admin.create.news');

        Route::match(['get', 'post'], 'news-manager/{module}', 'NewsController@newsManager')->name('admin.news.manager');

        Route::post('get-news-des', 'NewsController@getDescription')->name('admin.news.getDes');

        Route::post('get-news-cont', 'NewsController@getContent')->name('admin.news.getContent');

        Route::post('change-news-status', 'NewsController@changeStatus')->name('admin.news.changeStatus');

        Route::post('change-news-order', 'NewsController@changeOrder')->name('admin.news.changeOrder');


        Route::match(['get', 'post'], 'news-edit/{id}', 'NewsController@editNews')->name('admin.news.editNews');

        
        Route::post('pubDate', 'NewsController@pubDate')->name('admin.ajax.pubDate');

        // Route::post('news-edit/{id}','NewsController@editNewsPost')->name('admin.news.editNewsPost');
        
        

    });

});