<div class="word-container widget-container">
    <div class="main-word">
        <%  ::data.word %>
    </div>
    <i class="audio-word fa fa-volume-down fa-lg" ng-click="playAudio()"></i>
    <div class="add-note-me">
        <button ng-click="setQueryType(data.word, 'word');" class="btn btn-sm btn-default" data-toggle="modal" data-target="#myNote">
            <span class="glyphicon glyphicon-plus"></span>
        </button>
    </div>
    <div class="phonetic-word japanese-char" ng-if="data.phonetic != null && data.phonetic != '' && data.phonetic.length < 20">
        <%  ::data.phonetic %>
    </div> 
    <div class="sound-button" ng-click="playSound(data.word);"></div>
    <!--<div class="han-viet-word" ng-if="amHanViet != null && amHanViet != ''">
        「<%  ::amHanViet %>」
    </div> -->
    <div class="mean-detail-range" ng-repeat="mean in data.noKinds">
        <div class="type-word" ng-if="mean.kind != null && mean.kind != ''">☆ <%  convertKindToReadable(mean.kind) %> </div>
        <div class="mean-fr-word">◆ <%  capitaliseFirstLetter(mean.mean) %> </div>
        <div class="example-range">
            <ng-example ng-repeat="exam in mean.examples"  data="exam"></ng-example>
        </div>
    </div>
    <div class="mean-detail-range" ng-repeat="(kind, means) in data.kinds">
        <div class="type-word">☆ <%  convertKindToReadable(kind) %> </div>
        <div ng-repeat="(index, mean) in means">
            <div class="mean-fr-word">◆ <%  capitaliseFirstLetter(mean.mean) %> </div>
            <div class="example-range">
                <ng-example ng-repeat="exam in mean.examples"  data="exam"></ng-example>
            </div>
        </div>
    </div>          
</div>
<div class="widget-container" ng-if="conjugationVerb">
    <ng-verb-conjugtion data="conjugationVerb"></ng-verb-conjugtion>
</div>

<ng-note-content></ng-note-content>
<ng-category></ng-category>
