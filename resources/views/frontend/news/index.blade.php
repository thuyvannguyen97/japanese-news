@extends('frontend.news.layout')

@section('title', $news['title'])
@section('description', $news['desc'])
@section('url', $news['url'])
{!! HTML::style('frontend/css/index.css') !!}
@section('main-content')
<div class="col-md-8" id="articles">    
        <a class="top-news">Top Newest</a>
        <div class="row" id="art-box-list-sm">
            @foreach($lists as $t)
            <div class="col-config-2">
                <div class="box-info-news-sm">
                    
                    <a href="{{ route('web.detail',['id' => $t->id]) }} ">
                        <div class="image-top img-index">
                        <video style="width: 100%; height: 100%;" preload="auto" src="{!! $t->video !!}" onerror="this.onerror=null;this.src='images/default-news.png';">
                        </video>
                    </div>
                    </a>
                    <h4><a class="link-paper" href="{{ route('web.detail',['id' => $t->id]) }}">{!! $t->title !!}</a></h4>
                </div>
            </div>
            @endforeach
        </div>
        <div class="pagination">
    {{ $lists->links() }}
    </div>
    </div>

@endsection
