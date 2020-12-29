@extends('dictionary.main')
@section('url', $url)
@section('dict-main')
@if(isset($des))
    @section('description', $des)
@endif
@if(isset($title))
    @section('title', $title)
@endif
@if(isset($type) && $type == 'word')
<div label="Từ vựng" class="col-md-6 col-xs-12 result-word">
    @if(isset($result) && !empty($result))
    <div class="words-list">
        <div class="word-container widget-container">
            <div class="main-word">
                <h1>{{ $result->word }}</h1>
            </div>
            <i class="audio-word fa fa-volume-down fa-lg" ng-click="playAudio('{{ $result->word }}')"></i>
            <div class="add-note-me">
                <button class="btn btn-sm btn-default" data-toggle="modal" data-target="#myNote">
                    <span class="glyphicon glyphicon-plus"></span>
                </button>
            </div>
            @if($result->phonetic != null && $result->phonetic != '')
            <div class="phonetic-word japanese-char">
                {{ $result->phonetic }}
            </div> 
            @endif
            @foreach($result->means as $key => $value)
            <div class="mean-detail-range">
                @if($value->kind != null && $value->kind != '')
                <div class="type-word">☆ {{ $value->kind }} </div>
                @endif
                <div class="mean-fr-word">◆ {{ $value->mean }} </div>
            </div>
            @endforeach
                <!-- <div class="mean-detail-range" ng-repeat="(kind, means) in data.kinds">
                    <div class="type-word">☆ @{{ convertKindToReadable(kind) }} </div>
                    <div ng-repeat="(index, mean) in means">
                        <div class="mean-fr-word">◆ @{{ capitaliseFirstLetter(mean.mean) }} </div>
                        <div class="example-range">
                            <ng-example ng-repeat="exam in mean.examples"  data="exam"></ng-example>
                        </div>
                    </div>
                </div>   -->        
            </div>
            <!-- <div class="widget-container" ng-if="conjugationVerb">
                <ng-verb-conjugtion data="conjugationVerb"></ng-verb-conjugtion>
            </div>
            <ng-note-content></ng-note-content>
            <ng-category></ng-category> -->
        </div>
        @endif
        @if(isset($gsearch) && !empty($gsearch))
        <div class="google-translate-result word-detail-content" >
            <div class="gogl-word-searched">{{ $gsearch->sentences[0]->orig }}</div>
            @if(isset($gsearch->sentences[1]->translit))
            <div class="gogl-word-search-translit"> {{ $gsearch->sentences[1]->translit }} </div>
            @elseif(isset($gsearch->sentences[1]->src_translit))
            <div class="gogl-word-search-translit"> {{ $gsearch->sentences[1]->src_translit }} </div>
            @endif
            <div class="gogl-word-search-trans">{{ $gsearch->sentences[0]->trans }} </div>
            <div class="gogl-word-search-helper">Automatic translation</div>
        </div>
        <!-- <div class="widget-container" ng-if="conjugationVerb != null">
            <ng-verb-conjugtion data="conjugationVerb"></ng-verb-conjugtion>
        </div> -->
        <!-- <ng-synonyms data="googleTranslate" ng-if="googleTranslate"></ng-synonyms> -->
        @if(isset($gsearch->synsets))
        <div class="synonyms-result word-detail-content">
        <div class="synonyms-header">Synonyms of <b> {{ $gsearch->synsets[0]->base_form }} </b></div>
            <div class="synonyms-word-type"> {{ $gsearch->synsets[0]->pos }} </div>
            <ul>
                @foreach($gsearch->synsets[0]->entry as $key => $value)
                <li>
                    @foreach($value->synonym as $k => $val)
                    <span class="synonyms-word" ng-click='searchThis("{{ $val }}");'>
                        {{ $val }}
                    </span>
                    @if($k < (count($value->synonym) - 1))
                    <span>, </span>
                    @endif
                    @endforeach
                </li>
                @endforeach
            </ul>
        </div>
        @endif
        @endif
        @if(!empty($suggests))
        <div class="suggest-list">
            <div class="suggest-title">Relate words: <b>{{ $query or '' }}</b></div>
            @foreach($suggests as $key => $value)
            <div class="suggest-box" ng-click="showDetailSuggest({{ $value->_id }})">
                <div class="{{ $value->_id }}">
                    <p><span class="ja">{{ $value->word }}</span> {{ $value->phonetic }}</p>
                    <p>◆ {{ $value->means[0]->mean }}</p>
                    <p class="button-show">
                        <i class="fa fa-caret-down" class="icon_{{ $value->_id }}"></i>
                    </p>
                </div>

                <div class="detail_{{ $value->_id }} hiden detail-suggest">
                    <button class="btn btn-sm btn-default suggest-note" data-toggle="modal" data-target="#myNote">
                        <span class="fa fa-plus"></span>
                    </button>
                    <p class="ja">{{ $value->word }}</p>
                    <i class="audio-word fa fa-volume-down fa-lg" ng-click="playAudio('{{ $value->word }}')"></i>
                    @if($value->phonetic != null && $value->phonetic != '')
                    <p class="phonetic">
                        {{ $value->phonetic }}
                    </p>
                    @endif
                    @if($value->means[0]->kind != null && $value->means[0]->kind != '')
                    <div class="type-word">
                        ☆ {{ $value->means[0]->kind }} 
                    </div>
                    @endif
                    <p class="mean-fr-word mean">◆ {{ $value->means[0]->mean }}</p>
                    <!-- <div ng-repeat="example in word.means[0].examples" class="example">
                        <p class="content"><% example.content %></p>
                        <p class="mean"><% example.mean %></p>
                    </div><br> -->
                </div>
            </div>
            @endforeach
        </div>
        @endif
        @if(isset($noResults) && empty($noResults))
        <div class="no-result">
            Not found any related vocabulary to: <b>{{ $query }}</b>
        </div>
        @endif
    </div>
    @endif
    @if(isset($resultKanji) && !empty($resultKanji))
    <div class="col-md-6 col-sx-12 result-kanji-search-word">
        <div class="panel-group" id="accordion" role="tablist" aria-multiselectable="true">
            <p>Kanji in  <b>{{ $query or '' }}</b></p>
            @foreach($resultKanji as $key => $value)
            <div class="panel panel-default">
                <div class="panel-heading" id="heading{{ $value->_id }}" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapse{{ $value->_id }}" aria-expanded="true" 
                    aria-controls="collapse{{ $value->_id }}">
                    <h4 class="panel-title">
                        <span class="kanji"> {{ $value->kanji }} </span>
                        「{{ $value->on }}」 
                        <b class="mean">{{ $value->mean }}</b>
                    </h4>
                </div>
                <div id="collapse{{ $value->_id }}" class="panel-collapse collapse" role="tabpanel" aria-labelledby="heading{{ $value->_id }}">
                    <div class="panel-body">
                        <div class="kanji-container">
                            <div class="kanji-main-infor widget-container" style="box-shadow: none">
                                <div class="pronoun-item"><span class='kunyomi-text'>Kanji: </span><span>{{ $value->kanji }}</span></div>
                                <div class="pronoun-item"><span class='kunyomi-text'>訓:</span>  {{ $value->kun }} </div>
                                <div class="pronoun-item"><span class='kunyomi-text'>Number stroke:</span> {{ $value->stroke_count }} </div>
                                <div class="level"><span class='kunyomi-text'>JLPT:</span> {{ $value->level }}</div>
                                @if(isset($value->compDetail) && $value->compDetail != null)
                                <div class="comp-detail"><span class='kunyomi-text'>Element suite: </span>
                                    @foreach($value->compDetail as $k => $val)
                                    <span class="kanji-component">
                                        {{ $val->w }} 
                                        @if($val->h != '')
                                        <span> {{ $val->h }}</span>
                                        @endif
                                    </span>
                                    @endforeach
                                </div>
                                @endif
                                <div class="short-mean"><span class='kunyomi-text'>Mean: </span>            
                                    {{ $value->mean }}
                                </div>
                                <a class="view-detail">Detail >></a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            @endforeach
        </div>
    </div>
    @endif
    @stop