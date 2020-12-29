<div class="synonyms-result word-detail-content" ng-if="data.synsets != null">
    <div class="synonyms-header">Synonyms of <b> <% data.synsets[0].base_form %> </b></div>
    <div class="synonyms-word-type" ng-if="data.synsets[0].pos != null"> <% data.synsets[0].pos %> </div>
    <ul>
        <li ng-repeat="entry in data.synsets[0].entry">
            <span class="synonyms-word" ng-repeat="synonym in entry.synonym" ng-click="searchThis(synonym);">
                <% synonym %><span ng-if="$index < entry.synonym.length - 1">, </span>
            </span>
        </li>
    </ul>
 </div>