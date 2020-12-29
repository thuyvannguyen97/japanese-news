<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Response;

class Sentence extends Model
{
    //
    protected $table = 'sentence_translate';

    protected $guarded  = ["id"];

    public $timestamps  = true;




    public function addSent($all, $user_id){
        // dd($all['id']);
        for ($i=1; $i < sizeof($all)-1; $i++) { 
            
            $add = Sentence::insert(array(
                'new_id'=>$all['id'],
                'content'=>$all['trans-input-'.$i],
                'user_id'=>$user_id,
                'sentence_id'=>$i
            ));
        }
   
    }

    public function listTrans($new_id){
        $detail = Sentence::select('admins.name', 'admins.id', 'sentence_translate.new_id')
        ->join('admins', 'admins.id','=','sentence_translate.user_id')
        ->groupBy('sentence_translate.user_id')
        ->where('new_id', $new_id)
        ->get();
        // dd($detail);
        return $detail;
    }

    public function getTrans($user, $new){
        $trans = Sentence::select('content', 'sentence_id', 'user_id', 'new_id')
        ->where('user_id', $user)
        ->where('new_id', $new)
        ->get();
        return $trans;
    }

    public function translate($new_id){
        $translate = Sentence::select('admins.name', 'sentence_translate.user_id', 'sentence_translate.active')
        ->join('admins', 'admins.id', '=', 'sentence_translate.user_id')
        ->groupBy('sentence_translate.user_id')
        ->paginate(20);
        return $translate;
    }

    public function getTransUser($new_id, $user_id){
        $trans = Sentence::select('sentence_id', 'content')
        ->where('user_id', $user_id)
        ->where('new_id', $new_id)
        ->get();
        return $trans;
    }

    public function changeFlag($id, $status, $user_id){
        $query = DB::table('sentence_translate')
        ->where('new_id', $id)
        ->where('user_id', $user_id)
        ->update(['active' => $status]);
        return 'ok';
    }
}
