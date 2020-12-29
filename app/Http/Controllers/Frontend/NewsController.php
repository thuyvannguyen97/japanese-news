<?php

namespace App\Http\Controllers\Frontend;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Controllers\ValidateController;
use App\Http\Controllers\UtilController;
use App\Http\Controllers\DictController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Input;
use Intervention\Image\Facades\Image as Image;
use App\Models\News;
use App\Models\Sentence;
use Session;
use Response;
use Lang;
use App\Models\Comment;
use App\Models\Admin;
use App\Models\Community;

class NewsController extends Controller
{
    public $baseUrl = "http://mazii.net/";
    public $validate;

    private $limit = '/10';
    public $dict;

    public function __construct(){
        $this->get_news_url 	= $this->baseUrl."api/news/";
        $this->get_news_normal_url 	= $this->baseUrl."api/news_normal/";
    	$this->validate = new ValidateController();
        $this->util     = new UtilController();
        $this->dict     = new DictController();
        $this->news     = new News();
        $this->sent     = new Sentence();
        $this->comt     = new Comment();
        $this->admin     = new Admin();
        $this->community= new Community();
    }
    function language(Request $request){

        // dd($request->locale);
        Session::put('locale', $request->get('locale'));
       
        return redirect()->back ();
    }
    public function show(Request $request){
        $type = $request->type;
        if ($type == null) {
            $type = 'easy';
        }
        
        $timing = time();
        $post = $this->news->post($timing);
        
        Session::put('type',$request->type);
        $top = array();
        // dd(Session::get('locale'));
        
        
            $lists     = $this->news->getTitle($type);
            // dd($lists);
            $firstNews = $lists[0];
            if(!empty($firstNews->description)){
                $desc = $this->validate->replaceTagHTML($firstNews->description);
                if(!empty($desc)){
                    $desc = substr($desc, 0, 120);
                }
                
                $news['desc'] = $desc;
            }else{
                $news['desc'] = 'Easy News, Easy Japanese';
            }
            $title = $this->validate->getTitle($firstNews->title);
            if(!empty($title)){
                $news['title'] = $title . ' - Easy News | Easy Japanese';
            }else{
                $news['title'] = 'Easy News | Easy Japanese';
            }
            $news['url']	= urldecode($request->fullUrl());

            // get more 4 news show
            for($i = 0; $i < sizeof($lists); $i++){
                
                $lists[$i]->video = 'http://paperjp.local.com/backend/video/'. $lists[$i]->video;
            }
            $nav = $this->news->nav();
        //    dd($lists);
            return view('frontend.news.index', compact('news', 'nav', 'lists'));
        
    }
    
    public function showDetail(Request $request, $newsId)
    { 
        $type = Session::get('type');
        if ($type == null) {
            $type = 'easy';
        }
        // $result = $this->getTranslate($newsId);
        // $count = sizeof($result['data']);
        $detail = $this->news->getDetailNews($request->id);
        $detail = $detail[0];
        $id   = $request->id;
        $lists = $this->news->getTitle($type);
        for ($j=0; $j < 5; $j++) { 
            $nav[] = $lists[$j];
        }
        
        $detail->video = 'http://paperjp.local.com/backend/video/'. $detail->video;

        $urlImage = $this->validate->checkLink($detail->image);
        $detail->image = $urlImage;

        $url = route('web.dict');
        
        $comment = $this->comt->comment($newsId);
        $repComment = $this->comt->repComment($newsId);

        foreach ($comment as $key => $value) {
            $comment[$key]->image = '../frontend/images/' . $value->image;
        }

        foreach ($repComment as $key => $value) {
            $comment[$key]->image = '../frontend/images/' . $value->image;
        }
      
        return view('frontend.news.detail', compact('detail', 'nav','id', 'url', 'comment', 'repComment'));
    }

    public function addComment(Request $request){
        if($request->ajax()){
            $new_mess = $request->new_mess;
            $parent_id = $request->parent_id;
            $user_id = Auth::guard('admin')->user()->id;
            $user = Auth::guard('admin')->user();
            $new_id = $request->new_id;
            $data = [
                "content" => $new_mess,
                "parent_id" => $parent_id,
                "user_id" => $user_id,
                "new_id" => $new_id,
                "active" => 1
            ];
            $add = $this->comt->addComment($data);
            return $user;
        }
    }

    public function getDictionary(Request $request){
        if($request->ajax()){
            $title = $this->validate->getTitle($request->text);
            $flag  = $request->type;
            $hira  = $request->hira;
            $tab   = $request->tab;
            $lang = Session::get('locale');
            $lang = "ja" .$lang;
            $url   ='http://mazii.net/api/search';
            if ($tab == 'word') {
                
                $data = [
                    "dict"  => $lang,
                    "type"  => "word",
                    "query" => $title,
                    "limit" => 15,
                    "page"  => 1
                ];
                $result = $this->util->postData($url, $data);
                $result = json_decode($result);
                // dd($result);
                $response = array();
                if(isset($result->found)){
                    if ($result->found == true || $result->status == 200) {
                        foreach ($result->data as $key => $value) {
                            if($value->word == $title){
                                $phonetic = $value->phonetic;
                                $word1    = $value->word;
                                foreach ($value->means as $k => $val) {
                                    if(isset($val->kind)){
                                        $dict = $val->kind;
                                        if($request->dict !== 'jako'){
                                            $val->kind = $this->dict->getKind($val->kind, $request->dict);  
                                        }
                                        $means[$dict][] = $val;
                                    }else{
                                        $val->kind = '';
                                        $means[$k][] = $val;
                                    }
                                    // dd($means);
                                    //check examples is null
                                    if(isset($val->examples)){
                                        if($val->examples == null){
                                            continue;
                                        }
                                        if($k == 0 && count($val->examples) < 1){
                                            $datExam = [
                                                "dict"  => $request->dict,
                                                "type"  => "example",
                                                "query" => $result->data[0]->word,
                                                "limit" => 1
                                            ];
                                            $resExam = $this->util->postData($url, $datExam);
                                            $resExam = json_decode($resExam);
                                            if($resExam->status == 200 && count($resExam->results)){
                                                $val->examples = $resExam->results;
                                            }
                                        }
                                    }
                                }       
                                $response[] = array(
                                        'phonetic' => $phonetic,
                                        'word'     => $word1,
                                        'means'    => $means 
                                );
                                // dd($means);
                            }else{
                                $means = [];
                                if($flag == 'dict'){
                                    $temp = true;
                                }elseif($flag == 'qsearch'){
                                    $temp = ($value->word == $title && $value->phonetic == $hira);
                                }
                                if ($temp) {
                                    $phonetic = $value->phonetic;
                                    $word1    = $value->word;
                                    foreach ($value->means as $k => $val) {
                                        if(isset($val->kind)){
                                            $dict = $val->kind;
                                            if($request->dict !== 'jako'){
                                                $val->kind = $this->dict->getKind($val->kind, $request->dict);  
                                            }
                                            $means[$dict][] = $val;
                                        }else{
                                            $val->kind = '';
                                            $means[$k][] = $val;
                                        }
    
                                        //check examples is null
                                        if(isset($val->examples)){
                                            if($val->examples == null){
                                                continue;
                                            }
                                            if($k == 0 && count($val->examples) < 1){
                                                $datExam = [
                                                    "dict"  => $request->dict,
                                                    "type"  => "example",
                                                    "query" => $result->data[0]->word,
                                                    "limit" => 1
                                                ];
                                                $resExam = $this->util->postData($url, $datExam);
                                                $resExam = json_decode($resExam);
                                                if($resExam->status == 200 && count($resExam->results)){
                                                    $val->examples = $resExam->results;
                                                }
                                            }
                                        }
                                    }       
                                    $response[] = array(
                                            'phonetic' => $phonetic,
                                            'word'     => $word1,
                                            'means'    => $means 
                                    );
                                   
                                }
                            }
                            
                        }
                        // dd($response);
                        if(count($response)){
                            return Response::json(['found' => true, 'result' => $response], 200);
                        }else{
                            return Response::json(['found' => false], 302);
                        }
                    }
                    else{
                        return Response::json('Error',320);
                    }
                }else{
                    return Response::json('Error', 500);
                }
            }
            if($tab == 'example'){
                $query  = $request->text;
                $data = [
                    "dict"  => $lang,
                    "type"  => "example",
                    "query" => $query,
                    "limit" => 15,
                    "page"  => 1
                ];
                $result = $this->util->postData($url, $data);
                $resultSenten = json_decode($result);
                // dd($resultSenten);
                if($resultSenten->status == 200){
                    
                    return Response::json(['found' => true, 'result'=> $resultSenten], 200);
                }
                else{
                    return Response::json(['found' => false], 302);
                }
            }
            if ($tab == 'kanji') {
                if($lang !== 'javi'){
                    $lang ='jaen';
              
                }
                $query  = $request->text;
                $data = [
                    "dict"  => $lang,
                    "type"  => "kanji",
                    "query" => $query,
                    "limit" => 15,
                    "page"  => 1
                ];
                $result = $this->util->postData($url, $data);
                $result = json_decode($result);
                // dd($result);
                if($result->status == 200){
                    
                    return Response::json(['found' => true, 'result'=> $result], 200);
                }
                else{
                    return Response::json(['found' => false], 302);
                }
            }
            
        }
    }
    public function getSearch(Request $request){
        // $lists = $this->getHeadNews(1, '/10');       
        // return view('frontend.dictionary.search', compact('lists','result'));
        return view('frontend.dictionary.search');
    }
    public function searchData(Request $request){
        if ($request->ajax()) {
            $title = $this->validate->getTitle($request->text);
            $url   ='http://mazii.net/api/search';
            $data = [
                "dict"  => 'javi',
                "type"  => "kanji",
                "query" => $title,
                "limit" => 2,
                "page"  => 1
            ];

            $result = $this->util->postData($url, $data);
            $result = json_decode($result);
            return Response::json($result);
        }
    }
    public function getTranslate($newsId){
        $lang = Session::get('locale');
        $url   ='http://api.mazii.net/ej/api/news/'.$newsId.'/'.$lang.'/9';
        $result = json_decode(file_get_contents($url), true);
        return $result;
    }
    public function translate(Request $request, $newsId){
        $type = Session::get('type');
        if($type == 'normal'){
            $active = true;
        }else{
            $home = true;
        }
        // dd($home);
        $result = $this->getTranslate($newsId);
        $result = $result['data'];
        foreach($result as $key => $item){
            $temp = explode(':', $item['content']);
            array_shift($temp);
            $arr = [];
            foreach($temp as $index => $value){
                $a = preg_match('/"[0-9]"/', $value, $num);
                $i = (count($num)) ? $num[0] : '';
                $pStr = (strrpos($value, ',')) ? strrpos($value, ',') : ((strrpos($value, '.')) ? strrpos($value, '.') : false);
                if($pStr){
                    $str = substr($value, 0, $pStr);
                    $str = str_replace('"', '', $str);
                    if($i !== ''){
                        $i = str_replace('"', '', $i);
                        if($str !== ''){
                            $arr[$i-1] = trim($str);
                        }
                    }else{
                        if($str !== ''){
                            $arr[] = trim($str);
                        }
                    }
                }else{
                    $arr[] = trim(str_replace(['"', '}'], '', $value));
                }
            }
            $result[$key]['content'] = $arr;
        }
 
        $detail = $this->getDetailNews($newsId);
        if($detail->status == 200){
            $title = $detail->result->title;
            $content = trim($detail->result->content->textbody);
            $str = rtrim($content, '。');
            $str = explode('。', $str);
            array_unshift($str, $title);
            return view('frontend.news.translate',compact('str','result', 'home', 'active', 'newsId'));
        }
    }

    public function checkExistsTranslate(Request $request){
        $new_id = $request->id;
        $result = $this->news->getDetailNews($new_id);
        $user_id = Auth::guard('admin')->user()->id;
        $data = [];
        $title = $result[0]->title;
        
        $desc = $result[0]->description;
        $content = $result[0]->content;
        array_push($data, $title, $desc);
        $content = str_replace('<p>','', $content);
        // dd($content);
        $content = explode("<br>\r\n",$content);
        // $content = explode("<br>\n<br>",$content);
        
        for ($i=0; $i <sizeof($content); $i++) { 
            
            if($content[$i] != ''){
                // dd($i);
                array_push($data, $content[$i]);
            }
        }
        // dd($data);
        $list = $this->sent->listTrans($new_id);
        
         return view('frontend.news.translate', compact('data', 'new_id', 'list'));
        
    }

    public function addTranslate(Request $request){
        $id = $request->id;
        $user_id = Auth::guard('admin')->user()->id;
        $all = Input::all();
        // dd($all);
        $add = $this->sent->addSent($all, $user_id);
        
        return back();
    }

    public function getTrans(Request $request){
        $user = $request->user;
        $new = $request->new;
        
        $trans = $this->sent->getTrans($user, $new);
        return $trans;
    }
    public function getHeadNews($page , $limit, $type){
		if($page == null){
			$page = 1;
        }
        try{
            switch($type){
                case 'easy':
                    $url = $this->get_news_url.$page.$limit;
                    break;
                case 'normal':
                    $url = $this->get_news_normal_url.$page.$limit;
                    break;
                default:
                    $url = $this->get_news_url.$page.$limit;
            }
            $postData = @file_get_contents($url);
            if(empty($postData)){
                return null;
            }else{
                $data = json_decode($postData);
                $results = $data->results;
                foreach($results as $item){
                    if($this->validate->imageAvailable($item->value->image)){
                        $item->value->image = $this->validate->checkLink($item->value->image);
                    }
                }
                for ($i=0; $i < 10; $i++) { 
                    $newsId = $results[$i]->id;
                    $result[$i] = $this->getTranslate($newsId);
                    $count[$i] = sizeof($result[$i]['data']);
                    $results[$i]->count = $count[$i];
                }
                return $results;
            }
        }catch(\Exception $e){
            return null;
        }
    }
    
    function getTitleNews(Request $request){
        if($request->ajax()){
            $page = $request->page;
            $type = Session::get('type');
            $news = $this->getHeadNews($page, $this->limit, $type);
            if($news != null){
                return Response::json($news, 200);
            }
            return Response::json('Empty', 302);
        }
        return Response::json('error', 500);
    }

    
    public function profile(Request $request){
        
        $user = Auth::guard('admin')->user();
        
            $profile = $this->admin->getProfile($user->id);
            // $profile[0]->image = 
            // dd($profile[0]->image);
            return view('frontend.login.profile', compact('profile'));
        
        
    }

    public function editProfile(Request $request){
            $user = Auth::guard('admin')->user();
            $name = $request->name;
            $phone = $request->phone;
            $email = $request->email;

            if($request->hasFile('image')){
                $imageName  = $_FILES['image']['name'];
                $type       = substr($imageName, strrpos($imageName, '.'));
               
                // change name image
                // $subTitle   = mb_substr($this->valid->replaceTagHTML($title), 0, 6) . '_' .  str_replace('/', '_', $pubDate);
                $imageName  = $this->util->generateRandomString(26) . $type;
                $pathImg    = public_path() . '/frontend/images/' .$imageName;
                Image::make($_FILES['image']['tmp_name'])->resize(640, 360)->save($pathImg);
            }
            $image   = (isset($pathImg)) ? config(public_path() . '/frontend/images/') . $imageName : '';
            $data = array(
                'name'     => $name,
                'phone'    => $phone,
                'email'    => $email,
                'image'    => $image
            );

            $create = $this->admin->updateProfile($user->id, $data);
            $mess = " Sửa thành công. ";
            return redirect()->back()->with('mess', $mess);
        
    }

    public function getCommunity(Request $request){
        $topic = $request->topic;

        $user = Auth::guard('admin')->user();
        // dd($user);
        if ($user != null) {
            $user_id = Auth::guard('admin')->user()->id;
            $followQuest = $this->community->follow($user_id);
            
            $status = '1';
            if ($topic != '1') {
                $allAnswer = $this->community->answer($topic);
                // dd(sizeof($allAnswer[0]->follow_quest));
                for ($i=0; $i < sizeof($allAnswer); $i++) { 
                    for ($j=0; $j < sizeof($allAnswer[$i]->follow_quest); $j++) { 
                        if ($allAnswer[$i]->follow_quest[$j]->user_id == $user_id) {
                            $allAnswer[$i]->status = '1';
                        }
                    }
                }
            } else{
                $allAnswer = $this->community->allAnswer();
                // dd($allAnswer);
                for ($i=0; $i < sizeof($allAnswer); $i++) { 
                    for ($j=0; $j < sizeof($allAnswer[$i]->follow_quest); $j++) { 
                        // dd($user);
                        if ($allAnswer[$i]->follow_quest[$j]->user_id == $user_id) {
                            $allAnswer[$i]->status = '1';
                        }
                    }
                }
            }
        } else{
            $status = '1';
            if ($topic != '1') {
                $allAnswer = $this->community->answer($topic);
                
            } else{
                $allAnswer = $this->community->allAnswer();
                
            }
            $followQuest = null;
        }
      

        $comment = [];
        for ($i=0; $i < sizeof($allAnswer); $i++) { 
            $comment[$i] = $this->community->comment($allAnswer[$i]->id);
        }
        $follow = $this->community->countFollow();
        $repComment = $this->community->repComment();
        $countCmt = $this->community->countComment();
        
        // dd($user);
        return view('frontend.community.index', compact('allAnswer','comment', 'repComment', 'follow', 'countCmt', 'topic', 'followQuest', 'user'));
    }

    public function oneQuest(Request $request){
        $id = $request->id;
        
        
        $user = Auth::guard('admin')->user()->id;
        
            $allAnswer = $this->community->oneQuest($id);
            // dd($oneQuest);
                for ($j=0; $j < sizeof($allAnswer[0]->follow_quest); $j++) { 
                    if ($allAnswer[0]->follow_quest[$j]->user_id == $user) {
                        $allAnswer[0]->status = '1';
                    }
                }
           
       

        $comment = [];
        
        $comment[0] = $this->community->comment($allAnswer[0]->id);
        // dd($allAnswer);
        $topic = $allAnswer[0]->topic_id;
        $follow = $this->community->countFollow();
        $repComment = $this->community->repComment();
        $countCmt = $this->community->countComment();
        $followQuest = $this->community->follow($user);
// dd($followQuest);
        return view('frontend.community.index', compact('allAnswer','comment', 'repComment', 'follow', 'countCmt', 'topic', 'followQuest'));
    }
    public function addAnswer(Request $request){
        $title = $request->title;
        $content = $request->content;
        $topic = $request->topic;
        $user = Auth::guard('admin')->user()->id;
        
        $data = [
            "user_id"    => $user,
            "title"   => $title,
            "content" => $content,
            "topic_id"     => $topic
        ];
        // dd($data);
        $addAnswer = $this->community->addAnswer($data);
        return back();
    }

    public function contact(Request $request){
        $community_id = $request->community_id;
        $user_id = Auth::guard('admin')->user()->id;
        $check = $this->community->checkFollow($community_id, $user_id);
        $followQuest = $this->community->follow($user_id);
        return array($followQuest, $check);
    }

    public function deleteFollow(Request $request){
        $community_id = $request->community_id;
        $user = Auth::guard('admin')->user()->id;
        $contact = $this->community->deleteFollow($user, $community_id);
        $followQuest = $this->community->follow($user);
        return $followQuest;
    }

    public function createComment(Request $request){
        
        if($request->ajax()){
            $new_mess = $request->new_mess;
            $parent_id = $request->parent_id;
            $user_id = Auth::guard('admin')->user()->id;
            $user = Auth::guard('admin')->user();
            $community_id = $request->community_id;
            $data = [
                "content" => $new_mess,
                "parent_id" => $parent_id,
                "user_id" => $user_id,
                "community_id" => $community_id
            ];
            $add = $this->community->createComment($data);
            return $user;
        }
    }
}
