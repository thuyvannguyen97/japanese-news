<?php

namespace App\Http\Controllers\Backend;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Core\BaseRepository;
use App\Core\Admin\InnerAdmin;
use App\Http\Controllers\ValidateController;
use Illuminate\Support\Facades\Input;
use Auth;
use Response;
use Session;
use App\Code;
use App\Models\Comment;
use App\Models\Community;
use App\Models\News;
use App\Models\Sentence;
class AdminController extends Controller
{
    //
    protected $admin;
    protected $valid;
    protected $comment;
    protected $community;
    protected $news;
    protected $sentence;

    public function __construct()
    {
        $this->admin = new InnerAdmin();
        $this->valid = new ValidateController();
        $this->comment = new Comment();
        $this->community = new Community();
        $this->news = new News();
        $this->sentence = new Sentence();
    }

    public function index(Request $request){
        $users = $this->admin->getAll();

        return view('backend.admin.index', compact('users'));
    }

    

    public function logout(){
        Auth::guard('admin')->logout();
        if (!Auth::check() && !Auth::guard('admin')->check()) {
            Session::flush();
            Session::regenerate();
        }
        return redirect()->route('admin.login');
    }

    public function register(Request $request){
        if($request->isMethod('post')){
            $name       = (isset($request->name)) ? $request->name : '';
            $email      = (isset($request->email)) ? $request->email : '';
            $password   = (isset($request->password)) ? $request->password : '';

            if($this->valid->valueNotNull($name) && $this->valid->valueNotNull($email) && $this->valid->valueNotNull($password)){
                $data = [
                    'name' => $name,
                    'email' => $email,
                    'password' => bcrypt($password)
                ];

                $create = $this->admin->createAdmin($data);
                if($create == false){
                    return view('backend.register.index')->with(['message' => 'Registration failed.', 'msgClass' => 'red']);
                }
                return view('backend.register.index')->with(['message' => 'Waiting for approval.', 'msgClass' => 'green']);
            } else {
                return redirect()->route('admin.register');
            }
        }

        return view('backend.register.index');
    }

    public function activeUser(Request $request){
        if($request->ajax()){
            $input = Input::all();
            $status = $input['status'];
            $id = $input['id'];
            $param = [
                'status' => abs($status - 1),
            ];
            $condition = [
                'id' => $id
            ];
            $update = $this->admin->update($param, $condition);
    
            return Response::json($update, 200);
        } else {
            return Response::json('Not access', 500);
        }
    }
    
    public function changeRole(Request $request){
        if($request->ajax()){
            $input = Input::all();
            $role = $input['role'];
            $id = $input['id'];
            $param = [
                'role' => $role
            ];
            $condition = [
                'id' => $id
            ];
            $update = $this->admin->update($param, $condition);
    
            return Response::json($update, 200);
        } else {
            return Response::json('Not access', 500);
        }
    }
    
    public function delete(Request $request){
        if($request->ajax()){
            $input = Input::all();
            $id = $input['id'];
            $param = [
                'status' => -1
            ];
            $condition = [
                'id' => $id
            ];
            $update = $this->admin->update($param, $condition);
    
            return Response::json($update, 200);
        } else {
            return Response::json('Not access', 500);
        }
    }

    public function manageComment(Request $request){
        $new_id = $request->new;
        $comment = $this->comment->allCmt($new_id);
        
        // dd($comment);
        return view('backend.comment.news', compact('comment', 'news'));
    }

    public function activeComment(Request $request){
        if($request->ajax()){
            $id = $request->id;
            $status = $request->status;
            $cate = $request->cate;

            // dd($cate);
            if ($cate == 'community') {
                $change = $this->community->changeFlag($id, $status); 
            }
            if( $cate == 'comment-community'){
                $change = $this->community->changeFlagCmt($id, $status);

            }
            if( $cate == 'sentence'){
                $user_id = $request->user_id;
                $change = $this->sentence->changeFlag($id, $status, $user_id); 
            } else {
                $change = $this->comment->changeFlag($id, $status); 
            }
                 
            return $change;
                       
        }
        return Response::json('Not have access', 500);
    }
    
    public function manageCommunity(Request $request){
        $cate = $request->cate;
        $topic = $this->community->allTopic();
        if ($cate == 'all') {
            // $comment = $this->comment->allCmt($new_id);
            $question = $this->community->allQuest();
        } else {
            $question = $this->community->questTopic($cate);
        }
       
        
        // dd($question);
        return view('backend.community.index', compact('question', 'topic', 'cate'));
    }

    public function manageCommunityComment(Request $request){
        $community_id = $request->community_id;
        $comment = $this->community->allCmt($community_id);
        
        // dd($comment);
        return view('backend.community.comment', compact('comment'));
    }

    public function manageTranslating(Request $request){
        $new_id = $request->id;
        $users = $this->sentence->translate($new_id);
        
        return view('backend.news.translate-manager', compact('users', 'new_id'));
    }

    public function manageTransUser(Request $request){
        $user_id = $request->user_id;
        $new_id = $request->new_id;
        
        $trans = $this->sentence->getTransUser($new_id, $user_id);
        
        return $trans;
    }
}
