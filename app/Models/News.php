<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class News extends Model
{
    //
    protected $table = 'news';

    protected $guarded  = ["id"];

    public $timestamps  = true;

    public function admins(){
        return $this->belongsTo('App\Models\Admin','user_id');
    }

    public function getTitle($type){
        $lists = News::select('id', 'title', 'view', 'description', 'kind', 'video', 'created_at')
        ->orderBy('created_at', 'DESC')
        ->paginate(10);
        return $lists;
    }

    public function nav(){
        $nav = News::select('id', 'title', 'view', 'description', 'kind', 'video')
        ->orderBy('created_at', 'DESC')
        ->limit(5)
        ->get();
        return $nav;
    }

    public function getDetailNews($id){
        $detail = News::select('title', 'description','video','content', 'name_link')
        ->where('id', $id)
        ->get();
        return $detail;
    }

    public function allNews(){
        $news = News::select('id', 'video')
        ->get();
        return $news;
    }

    public function post($timing){
        $new = News::select('id', 'pubDate')
        ->where('status', '=', 1)
        ->get();
        
        for ($i=0; $i < sizeof($new); $i++) { 
            if(($timing - strtotime($new[$i]->pubDate)) > 0){
                $post = News::where('id', $new[$i]->id)
                ->update(array(
                    'status' => 2
                ));
            }
        }
        
        return $new;
    }
}
