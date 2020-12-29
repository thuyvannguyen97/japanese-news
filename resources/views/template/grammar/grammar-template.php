<div class="panel panel-default" ng-if="!showDetailImediately">
    <div class="panel-heading">
        <h4 class="panel-title">
            <a href="#collapseGrammar{{id}}" class="grammar-open-link" data-toggle="collapse" data-parent="#grammar-list" ng-click="loadDetail()"> 
                <div class='grammar-item-list'>{{ data.level }}:{{ title }}</div>
                <div class='grammar-item-mean'> {{ titleMean }} </div>
            </a>
        </h4>
    </div>
    <div id="collapseGrammar{{id}}" class="panel-collapse collapse">
        <div class="panel-body" id="parent-detail-gr{{id}}">
            <div class="grammar-usages" ng-repeat="usage in detail.usages">
                <div class="add-note-me">
                    <button  ng-click="setQueryGrammar(usage.synopsis,'grammar_detail',id);" class="btn btn-sm btn-default" data-toggle="modal" data-target="#myNote">
                        <span class="glyphicon glyphicon-plus"></span>
                    </button>
                </div>
                <div class="gr-use-synopsis" ng-bind-html="usage.synopsis"></div>
                <div class="gr-use-explain"><div class="gr-use-title">意味：</div>　<span ng-bind-html="removeJapaneseChar(usage.mean)"></span> </div>
                <div class="example-title">例：</div>
                <ng-example data="exam" ng-repeat="exam in usage.examples" index="{{$index + 1}}"></ng-example>
                <div class="gr-use-note" ng-if="usage.explain != null && usage.explain != ''">
                    <div class="gr-explain-title">説明:</div>
                    <div class="gr-explain-note" ng-repeat="expl in splitExplain(usage.explain)" ng-bind-html="expl"></div>
                </div>
                <div class="gr-use-notice" ng-if="usage.note != null">
                    <div class="gr-notice-title">注意:</div>
                    <div class="" ng-bind-html="usage.note"></div>
                </div>
            </div>
            <!--<ng-report data="data" type="grammar"></ng-report>-->
        </div>
    </div>
</div>
<div class="grammar-usages" ng-repeat="usage in detail.usages" ng-if="showDetailImediately">
    <div class="gr-use-synopsis"> {{ usage.synopsis }} </div>
    <div class="gr-use-explain"><div class="gr-use-title">意味：</div>　<span ng-bind-html="removeJapaneseChar(usage.mean)"></span> </div>
    <div class="example-title">例：</div>
    <ng-example data="exam" ng-repeat="exam in usage.examples" index="{{$index + 1}}"></ng-example>
    <div class="gr-use-note" ng-if="usage.explain != null && usage.explain != ''">
        <div class="gr-explain-title">説明:</div>
        <div class="gr-explain-note" ng-repeat="expl in splitExplain(usage.explain)" ng-bind-html="expl"></div>
    </div>
    <div class="gr-use-notice" ng-if="usage.note != null">
        <div class="gr-notice-title">注意:</div>
        <ul>
            <li ng-repeat="note in splitNote(usage.note)" ng-bind-html="note" ng-if="note != ''"></li>
        </ul>
    </div>
    <!--<ng-report data="detail" type="grammarDetail"></ng-report>-->
</div>

<ng-note-content></ng-note-content>
<ng-category></ng-category>