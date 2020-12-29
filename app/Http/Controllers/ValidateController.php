<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ValidateController extends Controller
{
    public function getVideo($video){
		$object = '<object type="application/x-shockwave-flash" data="http://www3.nhk.or.jp/news/player5.swf" class="movie-news-sm movie-news-md" id="news_image_div3" style="visibility: visible;">
            <param name="allowScriptAccess" value="sameDomain">
            <param name="allowFullScreen" value="true">
            <param name="wmode" value="direct">
            <param name="quality" value="high">
            <param name="bgcolor" value="#000000"> 
            <param name="flashvars" value="fms=rtmp://flv.nhk.or.jp/ondemand/flv/news/&amp;movie='.$video.'"></object>';
        return $object;
	}

	public function videoAvailable($video){
		if($video == null || $video == ''){
			return false;
		}
		return true;
	}

	public function imageAvailable($image){
		if($image == null || $image == ''){
			return false;
		}
		return true;
	}

	public function checkLink($url){
        try{
            if (strpos($url, 'http') !== false) {
                return $url;
            } else {
                $endImg = strstr($url, '.');
                // $endHtml = strstr($link, '.html');
                // $baseUrl = str_replace($endHtml, $endImg, $link);
                // news easy
                $baseUrl = 'https://www3.nhk.or.jp/news/easy/';
                $id  = substr($url, 0, strpos($url, '.'));
                $baseUrl .= $id . '/' . $id . $endImg;
                return $baseUrl;
            }
        }catch(\Exception $e){
            return null;
        }
    }

    public function replaceTagHTML($str){
        $result = '';
        if(!empty($str)){
            $result = preg_replace('/(<\/?p>)|(<\/?ruby>)|(<\/?rt>)|(「)|(」)/', '', $str);
            $result = strip_tags($result, 'a');
        }

        return $result;
    }
    public function getTitle($str)
    {
        $result = '';
        if(!empty($str)){
        $result = preg_replace('/<rt>(.*?)<\/rt>/', '', $str);
        $result = strip_tags($result, 'a');       
        }
        return $result;
    }

    public function valueNotNull($value){
        if($value == '' || $value == null)
            return false;
        return true;
    }
}
