<?php

namespace App\Models;

use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;

class Admin extends Authenticatable
{
    //
    use Notifiable;

    protected $primaryKey = 'id';

    protected $guard = 'admins';

    protected $fillable = [
        'name', 'email', 'password', 'status'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token',
    ];

    public $timestamps  = true;

    public function news(){
        return $this->hasMany('App\Models\News','user_id', 'id');
    }

    public function updateProfile($user, $data){
        $update = Admin::where('id',$user)
        ->update(array(
            'name'=>$data['name'],
            'phone'=> $data['phone'],
            'email'=> $data['email'],
            'image'=> $data['image']
        )); 
        return $update;
    }

    public function getProfile($user){
        $profile = Admin::select('name', 'email', 'phone', 'image')
        ->where('id', $user)
        ->get();
        return $profile;
    }

}
