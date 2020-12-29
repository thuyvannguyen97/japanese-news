<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Response;

class Comment extends Model
{
    //
    protected $table = 'comment';

    protected $guarded  = ["id"];

    public $timestamps  = true;

    public function comment($id){
        $comment = Comment::select('comment.parent_id','comment.new_id', 'admins.name', 'comment.content', 'comment.id','comment.created_at', 'comment.updated_at', 'admins.image')
        ->join('admins', 'admins.id','=','comment.user_id')
        ->where('comment.new_id', $id)
        ->where('comment.active', 1)
        ->orderBy('comment.created_at', 'ASC')
        ->get();
        // dd($comment);
        return $comment;
    }

    public function repComment($id){
        $repComment = "SELECT comment.*, admins.name , admins.image FROM `comment`
        JOIN admins
        ON admins.id=comment.user_id
        WHERE new_id = '1' AND comment.id = comment.parent_id AND comment.active = '1'
        ORDER BY created_at DESC";
        return \DB::select($repComment);
    }

    public function addComment($data){
        $insert = Comment::insert($data);
        return $insert;
    }
    
    public function allCmt($new_id){
        $allCmt = Comment::select('comment.id', 'comment.content','comment.new_id', 'admins.name', 'comment.active', 'comment.created_at')
        ->join('admins', 'admins.id', '=', 'comment.user_id')
        ->where('comment.new_id', '=', $new_id)
        ->orderBy('created_at', 'DESC')
        ->paginate(20);
        return $allCmt;
    }
   
    public function changeFlag($id, $status){
        $query = DB::table('comment')
        ->where('id', $id)
        ->update(['active' => $status]);
        return 'ok';
    }

    
}
