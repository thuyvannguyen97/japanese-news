<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\News;
use Config;
use App\Http\Controllers\UtilController;
use Response;

class NewsController extends Controller
{
    //
    private $news;
    private $view = 'nhknewsraw/_design/news/_view/by_name_link';
    private $util;

    public function __construct()
    {
        $this->new = new News();
        $this->util = new UtilController();
    }

    public function newsWithPage($page = 1, $limit = 10) {
        $skip = ($page-1)*$limit;
        $url = Config::get('couchdb.host') . $this->view . '?limit='.$limit.'&skip='.$skip.'&descending=true';

        $news = $this->util->getDocCouchDB($url);

        if(count($news->rows)) {
            return Response::json(['status' => 200, 'results' => $news->rows], 200);
        } else {
            return Response::json(['status' => 302, 'message' => 'Không có báo'], 200);
        }
    }
}
