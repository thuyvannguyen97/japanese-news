<div class="kanji-container">
    <div class="col-md-6 col-sx-12">
        <div class="kanji-main-infor widget-container">
            <div class="add-note-me">
                <button  ng-click="setQueryType(data.kanji, 'kanji');" class="btn btn-sm btn-default" data-toggle="modal" data-target="#myNote">
                    <span class="glyphicon glyphicon-plus"></span>
                </button>
            </div>
            <div class="pronoun-item"><span class='kunyomi-text'>Kanji: </span><span>{{ data.kanji }}</span></div>
            <div class="pronoun-item japanese-char" ng-if="data.kun != null && data.kun != ''"><span class='kunyomi-text'>訓:</span>  {{ convertNice(data.kun) }} </div>
            <div class="pronoun-item japanese-char" ng-if="data.on != null && data.on != ''"><span class='kunyomi-text'>音:</span>  {{ convertNice(data.on) }} </div>
            <div class="pronoun-item" ng-if="data.stroke_count != null"><span class='kunyomi-text'>Number stroke:</span> {{ data.stroke_count }} </div>
            <div class="level" ng-if="data.level != null"><span class='kunyomi-text'>JLPT:</span> {{ data.level }}</div>
            <div class="comp-detail" ng-if="data.compDetail != null"><span class='kunyomi-text'>Element suite: </span>
                <span class="kanji-component" ng-repeat="cd in data.compDetail">
                    {{ cd.w }} <span ng-if="cd.h != null && cd.h != ''"> {{ cd.h }}</span>
                </span>
            </div>
            <div class="short-mean"><span class='kunyomi-text'>Mean: </span>    		
                {{ getDetails() }}
            </div>
            <!--<ng-report data="data" type="kanji"></ng-report>-->
        </div>
    </div>
    <div class="col-md-6 col-xs-12">
        <div class="kanji-draw widget-container">
            <ng-kanji-draw data="data.kanji"></ng-kanji-draw>
        </div>
    </div>
    <div class="example-kanji widget-container col-md-12" ng-if="data.examples.length >0 ">
        <b>Example :</b>
        <table class="table">
            <thead>
              <tr>
                <th class="table-col-1">#</th>
                <th class="table-col-2">Word</th>
                <th class="table-col-3">Hiragana</th>
                <!-- <th class="table-col-4 td-hidden">Hán Việt</th> -->
                <th class="table-col-5">Mean</th>
              </tr>
            </thead>
            <tbody>
                <tr ng-repeat="exam in data.examples">
                    <td class="table-col-1">{{ $index + 1 }}</td>
                    <td class="table-col-2" ng-click="search(exam.w)" class="japanese-char">{{ exam.w }}</td>
                    <td class="table-col-3" class="japanese-char">{{ exam.p }}</td>
                    <!-- <td class="table-col-4 td-hidden">{{ exam.h }}</td> -->
                    <td class="table-col-5">{{ exam.m }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</div>

<ng-note-content></ng-note-content>
<ng-category></ng-category>
