<?php namespace App\Core\Admin;

use App\Core\BaseRepository;
use Illuminate\Support\Facades\DB;
use App\Models\Admin;
use App\Models\News;
use App\Code;

class InnerAdmin extends BaseRepository{

    protected $model;

    public function __construct(){
        $this->model  = new Admin();
    }

    public function createAdmin($data){
        if($this->checkAdminUnique($data['name'], $data['email'])){
            return false;
        }else{
            return $this->create([
                'name' => $data['name'],
                'email' => $data['email'],
                'password'   => $data['password'],
                'created_at' => date('Y-m-d H:i:s')
            ]);
        }
    }

    public function checkAdminUnique($name, $email){
        return $this->model->where('name', $name)->where('email', $email)->count() > 0;
    }

    


    public function getListCollabo($start, $end){
        $collab = Admin::with(['news' => function($q) use($start, $end){
            $q->select('*')->where('created_at','>=', $start)->where('created_at','<=', $end)->where('status','=','2')->count();
        }])->where('role','=','2')->paginate(12);

        return $collab;
    }

    public function getAll()
    {
        $user = Admin::select("*")
        ->where('role', '=', '0')
        ->paginate(20);
        return $user;
    }
}

?>