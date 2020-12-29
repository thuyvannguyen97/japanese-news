<?php
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

// Route::get('/', 'NewsController@index')->name('web.news');

// Route::get('news/{newsId?}', 'NewsController@getNews');

// Route::group(['prefix'=>'search'], function(){
// 	Route::get('/', 'DictController@index');
// 	Route::get('word/{query}-{from?}-{to?}', 'DictController@getWord');
// 	Route::get('kanji/{query}-{from}', 'DictController@getKanji');
// 	Route::get('sentence/{query}-{from?}', 'DictController@getSentence');
// });

// Route::get('api/news/{newsId}', 'NewsController@getDetailNewsApi');

// Route::get('api/gsearch/{query}/{from}/{to}', 'DictController@googleTranslateApi');

Route::get('/error', 'HomeController@error')->name('error');
Route::group([
	'namespace' => 'Frontend',
	'middleware' => 'web'
], function(){
	Route::get('/locale', 'NewsController@language')->name('lang');
	Route::post('/getDict','NewsController@getDictionary')->name('web.dict');
	Route::post('/searchData','NewsController@searchData')->name('web.searchData');
	
	Route::group([
		'prefix'=>'community'
	], function(){
		Route::get('/','NewsController@getCommunity')->name('web.community');
		Route::post('/addAnswer', 'NewsController@addAnswer')->name('addAnswer');
		Route::get('/contact', 'NewsController@contact')->name('contact');
		Route::get('/deleteFollow', 'NewsController@deleteFollow')->name('deleteFollow');
		Route::get('/oneQuest', 'NewsController@oneQuest')->name('oneQuest');
	});
	
	// news
	Route::get('/', 'NewsController@show')->name('web.home');
	// Route::get('/', 'NewsController@showNormal')->name('web.normal');

	Route::post('/addTranslate', 'NewsController@addTranslate')->name('addTranslate');

	Route::match(['get', 'post'], '/createComment', 'NewsController@createComment')->name('createComment');

	Route::get('/profile', 'NewsController@profile')->name('web.profile');

	Route::match(['get', 'post'], '/creatProfile', 'NewsController@editProfile')->name('creatProfile');
	

	Route::group([
		'prefix' => 'news'
	], function(){
		Route::get('/easy', 'NewsController@show')->name('web.easy.news');
		Route::get('/normal', 'NewsController@show')->name('web.normal.news');
		Route::get('/{id}', 'NewsController@showDetail')->name('web.detail');
		
		Route::get('translate/{id}','NewsController@translate')->name('web.translate');

		Route::group([
			'prefix' => 'ajax'
		], function(){
			Route::post('/get-head', 'NewsController@getTitleNews')->name('web.news.ajax.head');

			Route::get('/check-translate', 'NewsController@checkExistsTranslate')->name('web.news.ajax.translate');

			Route::post('/get-translate', 'NewsController@getTrans')->name('getTrans');

			Route::post('/add-comment', 'NewsController@addComment')->name('add-comment');


		});
	});

	// Dictionary
	Route::group([
		'prefix' => 'dictionary'
	], function(){
		Route::get('/','NewsController@getSearch')->name('web.search');
		
	});

});

Route::get('userLogout', 'HomeController@logout')->name('userLogout');
Route::get('/login', 'HomeController@login')->name('login');

Route::match(['get', 'post'],'checkLogin', 'HomeController@checkLogin')->name('checkLogin');

Route::get('/register', 'HomeController@register')->name('register');

Route::match(['get', 'post'],'addUser', 'HomeController@addUser')->name('addUser');
