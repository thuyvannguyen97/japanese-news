@extends('home')
@extends('news.right')
@extends('modal')
@section('title', $title)
@section('description', $des)
@section('url', $url)
@section('main')
<div class="main-news widget-container japanese-char" id="{{ $detail->_id }}">
    <div class="main-news-title">
        <h1>{!! $detail->title !!}</h1>
    </div>
    <div class="main-news-time">{!! $detail->pubDate !!}</div>
    @if(isset($image))
    <div id="main-news-picture-div" >
        <img id="main-news-picture" class="movie-news-sm movie-news-md" src="{{ $image }}" ng-if="!showVideo">
        @if(isset($video))
        <div class="movie-play-btn" ng-if="!showVideo">
            <img src="{{url('public/app/imgs/play.png')}}" ng-click="playVideo()"></img>
        </div>
        <div id="news_image_div3" ng-if="showVideo && !isMobile()">{!! $video !!}</div>
        @endif
    </div>
    @endif
    <div class="main-news-body">
        <p>{!! $detail->content->textbody !!}</p>
    </div>
    <div class="main-news-more">
        <p>{!! $detail->content->textmore !!}</p>
    </div>
    <div class="news-source">ソース：<a href="{{ $detail->link }}" target="blank">NHK　ニュース</a>
    </div>

</div>
<div class="box-search" ng-click="translate()">
    <img src="{{ url('public/app/imgs/search.png') }}" height="30px">
</div>
@endsection