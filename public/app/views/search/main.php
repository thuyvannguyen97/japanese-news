<div class="search-input-container">
    <div class="btn-group search-option">
        <button class="btn btn-default search-option-word tab-active" id="tab0" ng-click="changeTypeSearch(0)"><span>Word</span>
        </button>
        <button class="btn btn-default search-option-kanji" id="tab1" ng-click="changeTypeSearch(1)"><span>Kanji</span></button>
         <button class="btn btn-default search-option-example" id="tab2" ng-click="changeTypeSearch(2)"> <span>Sentence</span></button>
        </button>
        <button class="btn btn-default search-option-grammar not-mobile" id="tab3" ng-click="showHistoryPanel()"><span>History</span>
        </button>
    </div>
    <div class="input-group input-group-lg search-box-range col-xs-12 col-md-8 col-no-padding">
        <input type="text" placeholder="日本, nihon, Japan" maxlength="64" id="search-text-box" class="form-control" ng-enter="inputEnter();"　focus-me>
        <button type="button" class="btn btn-link" id="show-draw-kanji" title="Hide/Show panel draw kanji" ng-click="showKanjiDrawTable();">
            <span class="fa fa-pencil-square-o fa-lg"></span>
        </button>
        <button type="button" class="btn btn-link" ng-if="queryNotNull()" ng-click="clearQuery();" id="clear-search-text">
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

<div class="list-suggest-history col-xs-12 col-md-8" id="list-suggest-history" ng-if="isJP">
    <div class="suggest-item" ng-repeat="item in suggestSen track by $index" ng-click="suggestClick(item)">
        <span><b>{{ item.split(' ')[0] }}</b> {{ item.replace(item.split(' ')[0], '') }} </span>
    </div>
</div>

<div class="notify-new-version widget-container" ng-if="showNotifynewVersion && !startSearch">
    <ng-notify></ng-notify>
</div>

<div class="tab-container col-md-12 col-xs-12 no-padding">
    <div label="Từ vựng" ng-if="tabSelected == 0" class="col-md-6 col-xs-12 result-word">
        <div class="words-list" ng-if="words != null">
            <ng-word ng-repeat="word in words" data="word"></ng-word>
        </div>
        <div class="google-translate" ng-if="words == null || words.length == 0">
            <ng-google-translate data="googleTranslate" ng-if="googleTranslate"></ng-google-translate>
        </div>
        <div class="widget-container" ng-if="conjugationVerb != null">
            <ng-verb-conjugtion data="conjugationVerb"></ng-verb-conjugtion>
        </div>
        <ng-synonyms data="googleTranslate" ng-if="googleTranslate"></ng-synonyms>
        
        <div class="suggest-list" ng-if="suggest != null && suggest.length > 0">
            <div class="suggest-title">Relate words: <b>{{ query }}</b></div>
            <div class="suggest-box" ng-repeat="word in suggest" 
            ng-click="showDetailSuggest(word._id)">
                <div class="{{word._id}}">
                    <p><span class="ja">{{ word.word }}</span> {{ word.phonetic }}</p>
                    <p>◆ {{ word.means[0].mean }}</p>
                    <p class="button-show">
                        <i class="fa fa-caret-down" class="icon_{{ word._id }}"></i>
                    </p>
                </div>

                <div class="detail_{{word._id}} hiden detail-suggest">
                    <button ng-click="setQueryType(word.word, 'word');" class="btn btn-sm btn-default suggest-note" data-toggle="modal" data-target="#myNote">
                        <span class="fa fa-plus"></span>
                    </button>
                    <p class="ja">{{ word.word }}</p>
                    <i class="audio-word fa fa-volume-down fa-lg" 
                    ng-click="playAudio(word.phonetic)"></i>
                    <p class="phonetic" ng-if="word.phonetic != null && word.phonetic != ''">
                        {{ word.phonetic }}
                    </p>
                    <div class="type-word" 
                        ng-if="word.means[0].kind != null && word.means[0].kind != ''">
                        ☆ {{ convertKindToReadable(word.means[0].kind) }} 
                    </div>
                    <p class="mean">◆ {{ word.means[0].mean }}</p>
                    <div ng-repeat="example in word.means[0].examples" class="example">
                        <p class="content">{{ example.content }}</p>
                        <p class="mean">{{ example.mean }}</p>
                    </div><br>
                </div>
            </div>
        </div>
        <div class="no-result" ng-if="noResults">
            Not found any related vocabulary to: <b>{{ query }}</b>
        </div>
    </div>

    <div class="col-md-6 col-sx-12 result-kanji-search-word" ng-if="tabSelected == 0 && !noResultsKanjis && resultKanjis != null && resultKanjis.length > 0">
        <div class="panel-group" id="accordion" role="tablist" aria-multiselectable="true">
            <p>Kanji in  <b>{{ query }}</b></p>
            <div class="panel panel-default" ng-repeat="kanji in resultKanjis">
                <div class="panel-heading" id="heading{{kanji._id}}" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapse{{kanji._id}}" aria-expanded="true" 
                    aria-controls="collapse{{kanji._id}}">
                  <h4 class="panel-title">
                        <span class="kanji"> {{ kanji.kanji }} </span>
                        「{{ convertNice(kanji.on) }}」 
                        <b class="mean">{{ convertNice(kanji.mean) }}</b>
                  </h4>
                </div>
                <div id="collapse{{kanji._id}}" class="panel-collapse collapse" role="tabpanel" aria-labelledby="heading{{kanji._id}}">
                  <div class="panel-body">
                    <ng-kanji-result-search-word data="kanji"></ng-kanji-result-search-word>
                  </div>
                </div>
            </div>
        </div>
    </div>
    <div label="Hán tự" ng-if="tabSelected == 1">
        <div class="list-kanji" ng-if="kanjis != null">
            <div class="btn-group">
                <button type="button" ng-repeat="kanji in kanjis" class="btn btn-default btn-lg draw-single-kanji" ng-click="changeKanjiShow($index);" ng-class="kanjiSeletectClass($index);">{{ kanji.kanji }}</button>
            </div>
            <div id="kanji-detail-result">
                <ng-kanji data="getCurrentKanji()"></ng-kanji>
            </div>
        </div>
        <div class="no-result" ng-if="noResults || kanjis == null">
           Not data about kanji: <b>{{ query }}</b>
        </div>
    </div>
    <div label="Mẫu câu" ng-if="tabSelected == 2" class="col-md-6 col-xs-12 result-example">
        <div class="examples-list widget-container" ng-if="examples != null">
            <ng-example ng-repeat="exam in examples" index="{{$index + 1}}" data="exam"></ng-example>
        </div>
        <div class="no-result" ng-if="noResults">
            Not found any related example to: <b>{{ query }}</b>
        </div>
    </div>
    <div label="Ngữ pháp" ng-if="tabSelected == 3" class="col-md-6 col-xs-12 result-grammar">
        <div class="grammar-list" ng-if="grammars != null">
            <ng-grammar ng-repeat="gr in grammars" data="gr"></ng-grammar>
        </div>
        <div class="no-result" ng-if="noResults">
            Not found grammar: <b>{{ query }}</b>
        </div>
    </div>
    
</div>
<div class="box-search" ng-click="translate()">
    <img src="<?php echo asset('public/japanese/imgs/search.png') ?>" height="30px">
</div>
