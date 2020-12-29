<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class NewsController extends Controller
{
    public $baseUrl = "http://mazii.net/";
    public $validate;

    public function __construct(){
    	$this->get_head_news_url 	= $this->baseUrl."api/news/";
    	$this->get_detail_news_url 	= $this->baseUrl."api/news/";
    	$this->validate = new ValidateController();
    }

    public function index(){
    	
    	return Redirect('news');
    }

	public function getHeadNews($page = null, $limit = null){
		if($page == null){
			$page = 1;
		}
		$limit = '/10';
		$url = $this->get_head_news_url.$page.$limit;
		$postData = @file_get_contents($url);
		if(empty($postData)){
			return redirect()->route('error');
		} else {
			$data = json_decode($postData);
			$results = $data->results;
			return $results;
		}
	}

	public function getDetailNews($newsId){
		$url = $this->get_detail_news_url.$newsId;
		$postData = @file_get_contents($url);
		
		if(empty($postData)){
			return redirect()->route('error');
		} else {
			$data = json_decode($postData);
			
			return $data;
		}
	}

	public function getNews(Request $request, $newsId = null){
		$headNews   = $this->getHeadNews();
		if($newsId == null){
			$newsId = $headNews[0]->id;
		}
		$result = $this->getDetailNews($newsId);
		// test news custom
		$util = new UtilController();
		$url = "localhost:5984/nhknewsraw/31d6a7be277e6d89c892d829940017a1";

		$cus = $util->getDocCouchDB($url);
		$result = [
			'status' => 200,
			'result' => $cus
		];
		$result = (object) $result;
		// echo '<pre>';
		// print_r($result);
		// echo '</pre>';
		// die();

		switch ($result->status) {
			case 302:
				return redirect()->route('error');
			case 200:
				$detailNews = $result->result;
				// Check video and image
				if($this->validate->videoAvailable($detailNews->content->video)){
					$data['video'] = $this->validate->getVideo($detailNews->content->video);
				}
				if($this->validate->imageAvailable($detailNews->content->image)){
					$data['image'] = $this->validate->checkLink($detailNews->content->image, $detailNews->link);
				}
				if($detailNews->description != null && !empty($detailNews->description)){
					$des = $this->validate->replaceTagHTML($detailNews->description);
					if(!empty($des)){
						$des = substr($des, 0, 120);
					}
					
					$data['des'] = $des;
				} else {
					$data['des'] = 'Easy News, Easy Japanese';
				}

				$title = $this->validate->replaceTagHTML($detailNews->title);
				if(!empty($title)){
					$data['title'] = $title . ' - Easy News | Easy Japanese';
				} else {
					$data['title'] = 'Easy News | Easy Japanese';
				}
				$data['url']	= urldecode($request->fullUrl());
				$data['news']	= 'active';
				$data['id']  	= $newsId;
				$data['headNews'] = $headNews;
				$data['detail'] = $detailNews;
				// echo '<pre>';
				// print_r($data);
				// echo '</pre>';
				// die();
				return view('news.main', $data);
		}
	}

	// -------------api-------------
	public function getDetailNewsApi($newsId){
		$url = $this->get_detail_news_url.$newsId;
		$postData = file_get_contents($url);
		
		
		return $postData;
	}
	// ---------end api-------------
	
}
