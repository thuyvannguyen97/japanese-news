<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Igo;
use Config;

class UtilController extends Controller
{
    //
    public function __construct(){
        $this->igo = new Igo(public_path() . "/libs/igo-php/lib/ipadic");
    }

    public function getIp(){
        return getHostByName(getHostName());
    }

    public function encodeWithUni($string){
        return json_encode($string, JSON_UNESCAPED_UNICODE);
    }

    public function toHira($text){
        set_time_limit(0);
        $url = 'http://admin.pikasmart.com/pyapi/convert?kanji=' . urlencode($text);
        $data = $this->actionGetData($url);

        return (isset($data->kana)) ? $data->kana : '';
    }

    public function isKanji($str) {
        return preg_match('/[\x{4E00}-\x{9FBF}]/u', $str);
    }
    
    public function isHiragana($str) {
        return preg_match('/[\x{3040}-\x{309F}]/u', $str);
    }
    
    public function isKatakana($str) {
        return preg_match('/[\x{30A0}-\x{30FF}]/u', $str);
    }

    public function isJapanese($str){
        return preg_match('/[\x{4E00}-\x{9FBF}\x{3040}-\x{309F}\x{30A0}-\x{30FF}]/u', $str);
    }
    
    public function toFurigana($str){
        $id = $this->generateRandomNumber(6);
        $hira = $this->toHira($str);
        $result = '<ruby id="' . $id . '">' . $str . '<rt>' . $hira . '</rt></ruby>';

        return $result;
    }

    public function generateRandomNumber($length) {
	    $characters = '0123456789';
	    $charactersLength = strlen($characters);
	    $randomString = '';
	    for ($i = 0; $i < $length; $i++) {
	        $randomString .= $characters[rand(0, $charactersLength - 1)];
	    }
	    return $randomString;
    }
    
    public function generateRandomString($length) {
	    $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
	    $charactersLength = strlen($characters);
	    $randomString = '';
	    for ($i = 0; $i < $length; $i++) {
	        $randomString .= $characters[rand(0, $charactersLength - 1)];
	    }
	    return $randomString;
	}

    // convert 0x/0y/yyyy => x/y/yyyy
    public function toDate($date){
        $arr = explode('/', $date);
        $result = (int)$arr[0] . '/' . (int)$arr[1] . '/' . (int)$arr[2];

        return $result;
    }

    public function actionGetData($url){
		$ch = curl_init();
		curl_setopt($ch, CURLOPT_URL, $url);
		curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'GET');
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		curl_setopt($ch, CURLOPT_HTTPHEADER, array(
			'Content-type: application/json',
			'Accept: */*'
			));
		$response =curl_exec($ch);
		curl_close($ch);
		$result = json_decode($response);
		return $result;
    }

    public function getDocCouchDB($url){
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'GET');
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, array(
            'Content-type: application/json',
            'Accept: */*'
            ));
        curl_setopt($ch, CURLOPT_USERPWD, Config::get('couchdb.user').':'.Config::get('couchdb.pass'));
        $response =curl_exec($ch);
        curl_close($ch);
        $result = json_decode($response);
        return $result;
    }

    public function postDocCouchDB($url, $arr){
        $ch = curl_init();
        $payload = json_encode($arr);
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'POST');
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
        curl_setopt($ch, CURLOPT_HTTPHEADER, array(
            'Content-type: application/json',
            'Accept: */*'
            ));
        curl_setopt($ch, CURLOPT_USERPWD, Config::get('couchdb.user').':'.Config::get('couchdb.pass'));
        $response =curl_exec($ch);
        curl_close($ch);
        $result = json_decode($response);
        return $result;
    }
    
    public function postData($url, $arr){
        $ch = curl_init();
        $payload = json_encode($arr);
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'POST');
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
        curl_setopt($ch, CURLOPT_HTTPHEADER, array(
            'Content-type: application/json',
            'Accept: */*'
            ));
        $response =curl_exec($ch);
        curl_close($ch);
        return $response;
    }

    // Tạo chuỗi query string
    public function create_link($uri, $filter = array())
    {
        $string = '';
        foreach ($filter as $key => $val)
        {
            $string .= "&{$key}={$val}";
        }
        return $uri . ($string ? '?'.ltrim($string, '&') : '');
    }

    // Hàm phân trang
    public function paging($link, $total_records, $current_page, $limit, $keyword = '')
    {
        $range = 10;
        $min   = 0;
        $max   = 0;

        $total_page = ceil($total_records / $limit);
        
        if($current_page > $total_page){
            $current_page = $total_page;
        }elseif($current_page < 1){
            $current_page = 1;
        }

        $middle = ceil($range/2);
        if($total_page < $range){
            $min = 1;
            $max = $total_page;
        } else {
            $min = $current_page - ($middle + 1);
            $max = $current_page + ($middle - 1);

            if($min<1){
                $min = 1;
                $max = $range;
            }elseif($max > $total_page){
                $max = $total_page;
                $min = $total_page - $range + 1;
            }
        }

        $start = ($current_page -1)*$limit;
        $html = "<div class='text-center";
        $html .= "<nav aria-label='Page navigation'>";
        $html .= "<ul class='pagination'>";

        if($current_page > 1 && $max > 1){
            $html .= '<li><a href="'.$link . '/'.($current_page - 1) .'" aria-label="Previous"><span aria-hidden="true">&laquo;</span></a></li>';
        }

        for($i=$min; $i<=$max; $i++){
            if($i == $current_page){
                $html .= '<li class="active"><a>'.$i.'<span class="sr-only"></span></a></li>';
            } else {
                $html .= '<li><a href="'. $link .'/'. $i . '">'.$i.'<span class="sr-only"></span></a></li>';

            }
        }

        if($current_page < $max && $max > 1){
            $html .= '<li><a href="' . $link .'/'. ($current_page+1) . '"aria-label="Next"><span aria-hidden="true">&raquo;</span></a></li>';
        }
        $html .= "</ul>";
        $html .= "</nav>";
        $html .= "</div>";
        // Trả kết quả
        return array(
            'start' => $start,
            'limit' => $limit,
            'key'  => $keyword,
            'html' => $html
        );
    }
}
