@extends('home')
@extends('modal')
@section('title', 'Mazii Dictionary | Easy Japanese')
@section('description', 'Mazii Dictionary | Easy Japanese')
@section('url', $url)
@section('main')
<div class="search-input-container" >
    <div class="btn-group search-option">
        <button class="btn btn-default search-option-word {{ (isset($type) && $type == 'word') ? 'tab-active' : '' }}" id="tab0" value="word" ng-click="changeTypeSearch(0)"><span>Word</span>
        </button>
        <button class="btn btn-default search-option-kanji {{ (isset($type) && $type == 'kanji') ? 'tab-active' : '' }}" id="tab1" value="kanji" ng-click="changeTypeSearch(1)"><span>Kanji</span></button>
         <button class="btn btn-default search-option-example {{ (isset($type) && $type == 'example') ? 'tab-active' : '' }}" id="tab2" value="sentence" ng-click="changeTypeSearch(2)"> <span>Sentence</span></button>
        </button>
        <button class="btn btn-default search-option-grammar not-mobile" id="tab3" value="history" ng-click="showHistoryPanel()"><span>History</span>
        </button>
    </div>
    <div class="input-group input-group-lg search-box-range col-xs-12 col-md-8 col-no-padding">
        <input type="text" placeholder="日本, nihon, Japan" maxlength="64" id="search-text-box" class="form-control" ng-enter="inputEnter();"　focus-me value="{{ $query or '' }}">
        <button type="button" class="btn btn-link" id="show-draw-kanji" title="Hide/Show panel draw kanji" ng-click="showKanjiDrawTable();">
            <span class="fa fa-pencil-square-o fa-lg"></span>
        </button>
        <button type="button" class="btn btn-link" ng-if="queryNotNull();" ng-click="clearQuery();" id="clear-search-text">
            <span class="fa fa-times fa-lg"></span>
        </button>
        <div class="input-group-btn">
            <button type="button" class="btn btn-primary" id="search-button" ng-click="inputEnter();">
                <span class="fa fa-search fa-lg"></span>
            </button>
        </div>
    </div>
    <ng-kanji-recognize ng-if="isShowKanjiDraw()"></ng-kanji-recognize>
</div>

<div class="list-suggest-history col-xs-12 col-md-8 ng-scope" id="list-suggest-history">
    
</div>
@if(isset($welcome) && empty($welcome))
<div class="notify-new-version widget-container">
    <p>
        <b>Welcome to Mazii Dictionary!</b>
    </p>
        Mazii Dictionary is a Japanese - English dictionary.<br>
        I'm have many feature help you learn japanese more better. <br>
        Let try search a word...
    </p>
</div>
@endif
<div class="tab-container col-md-12 col-xs-12 no-padding">
    @yield('dict-main')
</div>
<div class="box-search" ng-click="translate()">
    <img src="{{ url('public/app/imgs/search.png') }}" height="30px">
</div>
@stop