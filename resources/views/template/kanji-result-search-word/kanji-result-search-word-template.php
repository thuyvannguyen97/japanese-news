<div class="kanji-container">
    <div class="kanji-main-infor widget-container" style="box-shadow: none">
        <div class="pronoun-item"><span class='kunyomi-text'>Kanji: </span><span><% data.kanji %></span></div>
        <div class="pronoun-item" ng-if="data.kun != null && data.kun != ''"><span class='kunyomi-text'>訓:</span>  <% convertNice(data.kun) %> </div>
        <div class="pronoun-item" ng-if="data.on != null && data.on != ''"><span class='kunyomi-text'>音:</span>  <% convertNice(data.on) %> </div>
        <div class="pronoun-item" ng-if="data.stroke_count != null"><span class='kunyomi-text'>Number stroke:</span> <% data.stroke_count %> </div>
        <div class="level" ng-if="data.level != null"><span class='kunyomi-text'>JLPT:</span> <% data.level %></div>
        <div class="comp-detail" ng-if="data.compDetail != null"><span class='kunyomi-text'>Element suite: </span>
            <span class="kanji-component" ng-repeat="cd in data.compDetail">
                <% cd.w %> <span ng-if="cd.h != null && cd.h != ''"> <% cd.h %></span>
            </span>
        </div>
        <div class="short-mean"><span class='kunyomi-text'>Mean: </span>
		
            <!-- <p><% getTitle() %></p> -->
            <% getDetails(0) %>
        </div>
        <a class="view-detail" ng-click="viewDetail(data.kanji)">Detail >></a>
    </div>
