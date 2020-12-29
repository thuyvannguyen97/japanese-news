<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Response;

class Follow extends Model
{
    //
    protected $table = 'follow_community';

    protected $guarded  = ["id"];

    public $timestamps  = true;

   

    
}
