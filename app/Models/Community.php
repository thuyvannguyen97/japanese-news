<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Response;

class Community extends Model
{
    //
    protected $table = 'community';

    protected $guarded  = ["id"];

    public $timestamps  = true;

    public function follow_quest(){
        return $this->hasMany('App\Models\Follow','community_id');
    }

    public function allAnswer(){
        $allAnswer = Community::select('community.title','community.content','admins.name','community.topic_id', 'community.id', 'admins.image')
        ->join('admins', 'admins.id','=','community.user_id')
        // ->where('community.active', '=', 1)
        ->orderBy('community.created_at', 'DESC')
        ->with('follow_quest')
        // ->get();
        ->paginate(6);
        return $allAnswer;
    }

    public function answer($topic){
        
        $answer = Community::select('community.title','community.content','admins.name','community.topic_id', 'community.id', 'admins.image')
        ->join('admins', 'admins.id','=','community.user_id')
        ->where('community.topic_id', '=', $topic)
        ->where('community.active', '=', 1)
        ->orderBy('community.created_at', 'DESC')
        ->with('follow_quest')
        ->paginate(6);
        // dd($answer);
        return $answer;
    }

    public function oneQuest($id){
        $answer = Community::select('community.title','community.content','admins.name','community.topic_id', 'community.id', 'admins.image')
        ->join('admins', 'admins.id','=','community.user_id')
        ->where('community.id', '=', $id)
        ->orderBy('community.created_at', 'DESC')
        ->with('follow_quest')
        ->paginate(6);
        
        return $answer;
    }

    public function addAnswer($data){
        $insert = Community::insert($data);
        return $insert;
    }

    public function comment($community_id){
        $comment = DB::table('comment_community as cc')
        ->select('cc.community_id','cc.id', 'cc.content', 'cc.parent_id', 'cc.created_at', 'cc.updated_at', 'admins.name', 'admins.image')
        ->join('admins', 'admins.id','=','cc.user_id')
        ->where('cc.community_id', $community_id)
        ->where('cc.parent_id', '=', 0)
        ->orderBy('cc.created_at', 'DESC')
        ->get();
        return $comment;
    }
    
    public function repComment(){
        $comment = DB::table('comment_community as cc')
        ->select('cc.community_id','cc.id', 'cc.content', 'cc.parent_id', 'cc.created_at', 'cc.updated_at', 'admins.name', 'admins.image')
        ->join('admins', 'admins.id','=','cc.user_id')
        ->where('cc.parent_id', '!=', 0)
        ->orderBy('cc.created_at', 'DESC')
        ->get();
        return $comment;
    }

    public function createComment($data){
        $add = DB::table('comment_community')
        ->insert($data);
        return $add;
    }
   

    public function checkFollow($community_id, $user_id){
        $checkFollow = DB::table('follow_community')->where('community_id', '=', $community_id)->where('user_id', '=', $user_id)->first();
        $data = [
            "user_id"    => $user_id,
            "community_id"   => $community_id
        ];
        if ($checkFollow === null) {
            $contact = DB::table('follow_community')
            ->insert($data);
            return 1;
        } else {
            $contact = DB::table('follow_community')
            ->where('user_id', $user_id)
            ->where('community_id', $community_id)
            ->delete();
            return 0;
        }
    }
  

    public function createLike($data){
        $contact = DB::table('like_community')
        ->insert($data);
        return $contact;
    }

    public function countFollow(){
        $follow = "SELECT COUNT(user_id) as c, community_id 
        FROM follow_community
        GROUP BY community_id";
        return \DB::select($follow);
    }

    public function countComment(){
        $count = "SELECT COUNT(id) as c, community_id
        FROM `comment_community`
        GROUP BY community_id";
        return \DB::select($count);
    }

    public function allQuest(){
        $allQuest = Community::select('community.id', 'community.title', 'community.content', 'community.created_at','community.active', 'admins.name', 'topic.name as name_topic')
        ->join('admins', 'admins.id', '=', 'community.user_id')
        ->join('topic', 'topic.id', '=', 'community.topic_id')
        ->orderBy('community.created_at', 'DESC')
        ->paginate(20);
        return $allQuest;
    }

    public function changeFlag($id, $status){
        $query = DB::table('community')
        ->where('id', $id)
        ->update(['active' => $status]);
        return 'ok';
    }

    public function changeFlagCmt($id, $status){
        $query = DB::table('comment_community')
        ->where('id', $id)
        ->update(['active' => $status]);
        return 'ok';
    }

    public function allCmt($community_id){
        $allCmt = DB::table('comment_community')
        ->select('comment_community.id', 'comment_community.content', 'admins.name', 'comment_community.active', 'comment_community.created_at')
        ->join('admins', 'admins.id', '=', 'comment_community.user_id')
        ->where('comment_community.community_id', '=', $community_id)
        ->orderBy('created_at', 'DESC')
        ->paginate(20);
        return $allCmt;
    }

    public function allTopic(){
        $allTopic = DB::table('topic')
        ->select('name', 'id')
        ->get();
        return $allTopic;
    }

    public function questTopic($cate){
        $questTopic = Community::select('community.id', 'community.title', 'community.content', 'community.created_at','community.active', 'admins.name', 'topic.name as name_topic')
        ->join('admins', 'admins.id', '=', 'community.user_id')
        ->join('topic', 'topic.id', '=', 'community.topic_id')
        ->where('community.topic_id', '=', $cate)
        ->orderBy('community.created_at', 'DESC')
        ->paginate(20);
        return $questTopic;
    }

    public function follow($user){
        $follow = Community::select( 'follow_community.community_id', 'community.title', 'admins.name', 'admins.image')
        ->join('follow_community', 'community.id', '=', 'follow_community.community_id')
        ->join('admins', 'admins.id','=','follow_community.user_id')
        ->where('follow_community.user_id', $user)
        ->get();
        return $follow;
    }

}
