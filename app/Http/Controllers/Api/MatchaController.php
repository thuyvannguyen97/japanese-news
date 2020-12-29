<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Sunra\PhpSimple\HtmlDomParser;
use App\Http\Controllers\UtilController;
use Illuminate\Support\Facades\Config;
use App\Models\News;

class MatchaController extends Controller
{
    // Crawler báo matcha
    private $baseUrl = 'https://matcha-jp.com/easy/?type=latest&page=1';
    private $url = 'https://matcha-jp.com';
    private $linkCouch = 'nhknewsraw/_design/news/_view/by_link';

    public function __construct()
    {
        $this->news = new News();
        $this->util = new UtilController();
    }


    public function crawler() {
        set_time_limit(0);
        $links = $this->getLink();
        $results = [];
        if($links) {
            foreach($links as $link) {
                $easylink = $this->url . $link;
                $url = Config::get('couchdb.host') . $this->linkCouch . '?key="' . $easylink . '"';

                $checkLink = $this->checkExistLink($url);
                if(!$checkLink) {
                    $html = HtmlDomParser::file_get_html($easylink);
                    $header = $html->find('.container .article_header');
                    $data['content']['image']  = $html->find('.container .article_thumb img')[0]->src;
                    foreach($header as $element) {
                        $data['title'] = $element->find('h1')[0]->innertext();
                        $data['description'] = $element->find('p.description')[0]->outertext();
                        $data['pubDate'] = str_replace('.', '-', $element->find('.date')[0]->innertext());
                    }
                    $data['link'] = $easylink;
                    $data['nameLink'] = 'Matcha';
                    $data['content']['video'] = null;
                    $data['content']['audio'] = null;
                    $data['content']['textmore'] = '';
                    $data['type'] = 'easy';

                    // get elements
                    $content  = $html->find('.container .article_content')[0]->innertext();
                    $small  = $html->find('.container .article_content p small');
                    $content = str_replace('data-src', 'src', $content);
                    $content = str_replace($small, '', $content);
                    $content = preg_replace('/<div class=\"c-ratioBox photoFrame\".+?><img.*?(src=\"http.*?\").*?><\/div>/', '<img width="590px;" height="360px;" $1>', $content);
                    $dataReg = [
                        '/<div class=\"article_infoTrigger.+?<\/code><\/div>/',
                        '/<div class=\"article_info\".+?<\/a><\/td> <\/tr> <\/table> <\/div><\/div>/',
                        '/<div class=\"recommended_articles\".+?<\/a><\/p><\/p><\/div><\/li><\/ul><\/div>/',
                        '/(<rb>)|(<\/rb>)|(<rp>\(<\/rp>)|(<rp>\)<\/rp>)/'
                    ];
                    $content = preg_replace($dataReg, '', $content);

                    $data['content']['textbody'] = $content;

                    // import to couchdb
                    // $database = Config::get('common.couch.nhknewsraw');
                    // $this->util->postCurl($database, $data);

                    // import to mysql
                    // check exists
                    if(!$this->news->where('link', $data['link'])->first()) {
                        $myData = [
                            'user_id' => 12,
                            'pubDate' => preg_replace('/0(\d{1}\/)/', '$1', date('m/d/Y')),
                            'title'   => $data['title'],
                            'kind'    => 'crawler',
                            'link'    => $data['link'],
                            'name_link' => $data['nameLink'],
                            'image'   => $data['content']['image'],
                            'description' => $data['description'],
                            'content' => $data['content']['textbody']
                        ];
    
                        $this->news->insert($myData);
                        $results[] = $myData;
                    }
    
                }
            }
        }
        dd($results);
    }

    public function checkExistLink($url) {
        $couch = $this->util->getDocCouchDB($url);
        if(count($couch->rows)) {
            return true;
        } else {
            return false;
        }
    }

    public function getLink() {
        $html = HtmlDomParser::file_get_html($this->baseUrl);
        $list = $html->find('.container .c-horizontalList .thumb a.c-imageLink');
        foreach($list as $li) {
            $href[] = $li->href;
        }
        return (isset($href)) ? $href : false;
    }
}
