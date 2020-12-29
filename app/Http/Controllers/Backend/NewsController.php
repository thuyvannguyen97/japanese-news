<?php

namespace App\Http\Controllers\Backend;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Controllers\UtilController;
use App\Http\Controllers\ValidateController;
use Response;
use Config;
use Auth;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Input;
use Intervention\Image\Facades\Image as Image;
use App\Core\News\InnerNews;
use App\Models\News;

class NewsController extends Controller
{
    //
    public function __construct(){
        $this->util = new UtilController();
        $this->news = new InnerNews();
        $this->valid  = new ValidateController();
    }

    public function index(Request $request){
        return view('backend.news.index');
    }

    public function createNews(Request $request){
        if($request->ajax()){
            $user       = Auth::guard('admin')->user();
            $all        = Input::all();
            $title      = $all['title'];
            $pubDate    = $this->util->toDate($all['pubDate']);
            $description = $all['description'];
            $content    = $all['content'];
            $link       = $all['link'];
            $video      = $all['video'];
            $nameLink   = $all['nameLink'];
            $kind       = $all['kind'];

            if($request->hasFile('image')){
                
                // file image
                $imageName  = $_FILES['image']['name'];
                $type       = substr($imageName, strrpos($imageName, '.'));
                
                // change name image
                $imageName  = $this->util->generateRandomString(26) . str_replace('/', '', $pubDate) . $type;
                $temp = $_FILES['image']['tmp_name'];
                $url = public_path() . '/backend/video/' .$imageName;
                move_uploaded_file($temp, $url);
                
            }
            $image   = (isset($url)) ? config('/backend/video/') . $imageName : '';

            if(empty($title) || empty($content)){
                return Response::json('Title or news is null', 302);
            }

            $data = array(
                'title'     => preg_replace('/ id=\'\d{6}\'/', '', str_replace('"', '\'', $title)),
                'pubDate'   => $pubDate,
                'description' => preg_replace('/ id=\'\d{6}\'/', '', str_replace('"', '\'', $description)),
                'content'   => preg_replace('/ id=\'\d{6}\'/', '', str_replace('"', '\'', $content)),
                'image'     => '',
                'link'      => $link,
                'video'     => $image,
                'name_link'  => $nameLink,
                'kind'      => $kind,
                'news_order' => $this->news->totalNewsForDate($pubDate) + 1
            );

            $create = $this->news->createNews($user->id, $data);
            if($create == false){
                return Response::json('News exists', 302);
            }

            return Response::json('Success', 200);
        }
        return Response::json('Not to access', 500);
    }
    public function pubDate(Request $request){
        if($request->ajax()){
            $pubDate = $request->pubDate;
            $id = $request->id;
            $update = News::where('id', $id)->update(array(
                'pubDate' => $this->util->toDate($pubDate)
            ));
            return $update;
        }
        return Response::json('Not to access', 500);
    }

    public function editNews($id, Request $request){
        $news = News::find($id);
        $image = $news->image;
        if(!empty($image)){
            $image = strstr($image, 'news');
        }
        if($request->ajax()){
            $all = Input::all();
            $title   = $all['title'];
            $description = $all['description'];
            $content = $all['content'];
            
            $news->title = preg_replace('/ id=\"\d{5}\"/', '', $title);
            $news->description = preg_replace('/ id=\"\d{5}\"/', '', $description);
            $news->content = preg_replace('/ id=\"\d{5}\"/', '', $content);
            if($news->save()){
                return 'success';
            } else {
                return 'fail';
            }
            
        }
     
        $title = preg_replace('/<ruby.*?>(<rb>)*(.+?)<.*?<\/ruby>/', '$2', $news->title);
        $description = preg_replace('/<ruby.*?>(<rb>)*(.+?)<.*?<\/ruby>/', '$2', $news->description);
        $content = preg_replace('/<ruby.*?>(<rb>)*(.+?)<.*?<\/ruby>/', '$2', $news->content);
        
        return view('backend.news.edit', compact('news', 'id', 'title', 'content', 'description'));
    }

    public function toFuriEdit(Request $request){
        if($request->ajax()){
            $title = $request->title;
            $description = $request->description;
            $content = $request->content;
            $str = [];
            array_push($str, $title, $description, $content);
            
            for ($j=0; $j < sizeof($str); $j++) { 
                $result[$j] = '';
                $kanji = '';
                for($i = 0; $i < mb_strlen($str[$j]); $i++){
                    $c = mb_substr($str[$j], $i, 1);
                    if($this->util->isKanji($c)){
                        if(!empty($kanji)){
                            $kanji .= $c;
                        } else {
                            $kanji = $c;
                        }
                        if($i == ($len - 1)){
                            $temp = $this->util->toFurigana($kanji);
                            $result .= $temp;
                        }
                    } else {
                        // Tạo furi
                        if(!empty($kanji)){
                            $temp = $this->util->toFurigana($kanji);
                            $result[$j] .= $temp;
                            $kanji = '';
                        }
                        $result[$j] .= $c;
                    }
                }
            }
            

            return Response::json($result, 200);
        }
        return Response::json('No access', 302);
    }

    public function toFuri(Request $request){
        if($request->ajax()){
            $string = $request->text;
            $len    = mb_strlen($string);
            $result = '';
            $kanji  = '';
            for($i = 0; $i < $len; $i++){
                $c = mb_substr($string, $i, 1);
                // lấy 1 chuỗi kanji liền nhau
                if($this->util->isKanji($c)){
                    if(!empty($kanji)){
                        $kanji .= $c;
                    } else {
                        $kanji = $c;
                    }
                    if($i == ($len - 1)){
                        $temp = $this->util->toFurigana($kanji);
                        $result .= $temp;
                    }
                } else {
                    // Tạo furi
                    if(!empty($kanji)){
                        $temp = $this->util->toFurigana($kanji);
                        $result .= $temp;
                        $kanji = '';
                    }
                    $result .= $c;
                }
            }

            return Response::json($result, 200);
        }
        return Response::json('No access', 302);
    }

    public function newsManager($module,  Request $request){
        $title = $request->get('search');
        $date  = $request->get('fil-date');
        $with = ['admins'];
        switch($module){
            case 'new':
                $param = ['status' => 0];
                break;
            case 'posted':
                $param = ['status' => 1];
                break;
            case 'success':
                $param = ['status' => 2];
                break;
            case 'deleted':
                $param = ['status' => -1];
                break;
            default:
                $param = ['status' => 0];
        }

        $order = '';
        if($date != null && $date != ''){
            $date = $this->util->toDate($date);
            $param = array_merge($param, ['pubDate' => $date]);
            $order = $this->news->totalNewsForDate($date);
        }
        $user       = Auth::guard('admin')->user();
        if ($user->role == 2) {
            $param['user_id'] = $user->id;
        }
        // dd($with);
        $news = $this->news->getAllWithPaginate($param);
        // return $news;
        // add view short
        foreach($news as $item){
            $des_short  = substr($item->description, 0, strpos($item->description, '。'));
            $cont_short = substr($item->content, 0, strpos($item->content, '。'));
            $item->des_short  = ($des_short != '') ? $des_short : $item->description;
            $item->cont_short = ($cont_short != '') ? $cont_short : $item->content;
        }
        // dd($news);
        return view('backend.news.manager', compact('news', 'module', 'order'));
    }

    
    public function getDescription(Request $request){
        $id = $request->id;

        return $this->news->getDescription($id);
    }
    
    public function getContent(Request $request){
        $id = $request->id;

        return $this->news->getContent($id);
    }
    
    public function changeStatus(Request $request){
        $id = $request->id;
        $status = $request->status;
        $param = ['status' => $status];
        $condition = ['id' => $id];

        return $this->news->update($param, $condition);
    }
    
    public function changeOrder(Request $request){
        $id         = $request->id;
        $order      = $request->order;
        $order_old  = $request->order_old;
        $pubDate    = $request->pubDate;

        // news bị thay đổi
        $param2 = ['news_order' => $order_old];
        $condition2 = ['pubDate' => $pubDate, 'news_order' => $order];
        $second = $this->news->update($param2, $condition2);

        // news được thay đổi
        $param = ['news_order' => $order];
        $condition = ['id' => $id];
        $first = $this->news->update($param, $condition);

        if($first && $second){
            return Response::json('success', 200);
        }
        return Response::json('error', 302);
    }
}
