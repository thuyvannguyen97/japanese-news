<?php namespace App\Core\News;

use App\Core\BaseRepository;
use Illuminate\Support\Facades\DB;
use App\Models\News;

class InnerNews extends BaseRepository{

    protected $model;

    public function __construct(){
        $this->model  = new News();
    }

    public function createNews($user_id, $news){
        if($this->checkNewsUnique($news['title'])){
            return false;
        }else{
            return $this->create([
                'user_id' => $user_id,
                'pubDate' => $news['pubDate'],
                'title'   => $news['title'],
                'description' => $news['description'],
                'image'   => $news['image'],
                'content' => $news['content'],
                'link'    => $news['link'],
                'video'   => $news['video'],
                'name_link'    => $news['name_link'],
                'kind'    => $news['kind'],
                'news_order'    => $news['news_order'],
                'created_at' => date('Y-m-d H:i:s')
            ]);
        }
    }

    public function checkNewsUnique($title){
        return $this->model->where('title', $title)->where('status', 0)->count() > 0;
    }

    public function getDescription($id){
        return $this->model->where('id', $id)->select('description')->first();
    }
    
    public function getContent($id){
        return $this->model->where('id', $id)->select('content')->first();
    }

    public function totalNewsForDate($date){
        return $this->model->where('pubDate', $date)->count();
    }
}

?>