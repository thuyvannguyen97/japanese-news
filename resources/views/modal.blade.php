@section('modal')
<div class="modal fade" id="instant-search">
    <div class="modal-dialog modal-jlpt">
      <div class="modal-content">
        <div class="modal-body">
            <button type="button" class="close close-modal-jlpt" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
            <div class="tab-container">
              <div label="Từ vựng" ng-if="tabSelected == 0">
                  <div class="words-list" ng-if="words != null">
                      <div ng-repeat="word in words">
                          <ng-word data="word" aux="wordAux" ng-if="$index == 0"></ng-word>
                          <ng-word data="word" ng-if="$index != 0"></ng-word>
                      </div>
                  </div>
                  <div class="google-translate" ng-if="words == null || words.length == 0">
                      <ng-google-translate data="googleTranslate" aux="wordAux" ng-if="googleTranslate"></ng-google-translate>
                  </div>
                  <ng-synonyms data="googleTranslate" ng-if="googleTranslate"></ng-synonyms>
                  <div class="suggest-list widget-container" ng-if="suggest != null && suggest.length > 0">
                      <div class="suggest-title">Relate words:</div>
                      <span class="suggest-word" ng-repeat="word in suggest" ng-click="startQuery(word.word)"><% word.word %><span ng-if="$index < (suggest.length - 1)">, </span> </span>
                  </div>      

                  <div class="panel-group" id="accordion" role="tablist" aria-multiselectable="true">
                    <p ng-if="resultKanjis != null">Kanji :</p>
                    <div class="panel panel-default" ng-repeat="kanji in resultKanjis">
                        <div class="panel-heading" id="heading<%kanji._id%>" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapse<%kanji._id%>" aria-expanded="true" 
                            aria-controls="collapse<%kanji._id%>">
                          <h4 class="panel-title">
                            <span class="kanji"> <% kanji.kanji %> </span>
                            「<% kanji.on %>」 
                            <b class="mean"><% printKanjiMean(kanji.mean) %></b>
                          </h4>
                        </div>
                        <div id="collapse<%kanji._id%>" class="panel-collapse collapse" role="tabpanel" aria-labelledby="heading<%kanji._id%>">
                          <div class="panel-body">
                            <ng-kanji-result-search-word data="kanji"></ng-kanji-result-search-word>
                          </div>
                        </div>
                    </div>
                  </div>
                  <div class="no-result" ng-if="noResults">
                      Not found any related vocabulary to: <% query %>
                  </div>
              </div>


              <div label="Hán tự" ng-if="tabSelected == 1">
                  <div class="list-kanji" ng-if="kanjis != null">
                      <div class="btn-group" ng-if="kanjis.length > 1">
                          <button type="button" ng-repeat="kanji in kanjis" class="btn btn-default btn-lg draw-single-kanji" ng-click="changeKanjiShow($index);" ng-class="kanjiSeletectClass($index);"><% kanji.kanji %></button>
                      </div>
                      <div id="kanji-detail-result">
                          <ng-kanji data="getCurrentKanji()"></ng-kanji>
                      </div>
                  </div>
                  <div class="no-result" ng-if="noResults || kanjis == null">
                      Not found: <% query %>
                  </div>                  
              </div>


              <div label="Example" ng-if="tabSelected == 2">
                  <div class="examples-list widget-container" ng-if="examples != null">
                      <ng-example ng-repeat="exam in examples" index="<%$index + 1%>" data="exam"></ng-example>
                  </div>
                  <div class="no-result" ng-if="noResults">
                      Not found any related example to: <% query %>
                  </div>
              </div>
              <div label="Grammar" ng-if="tabSelected == 3">
                  <div class="instant-grammar-container">
                      <ng-grammar data="grammarDetail" ng-if="grammarDetail != null"></ng-grammar>
                  </div>
                  <div class="no-result" ng-if="noResults">
                      Not found grammar : <% query %>
                  </div>
              </div>
          </div>
        </div>
        <div class="modal-footer">
          <!-- <button type="button" class="btn btn-default" data-dismiss="modal">Close</button> -->
        </div>
      </div><!-- /.modal-content -->
    </div><!-- /.modal-dialog -->
  </div><!-- /.modal -->
  
  <div class="modal fade" id="confirmDeleteHistoryModal">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close close-delete-history-modal" data-dismiss="modal" aria-hidden="true">&times;</button>
          <h4 class="modal-title">Delete history</h4>
        </div>
        <hr>
        <div class="modal-body">
          Do you want to delete your history?
        </div>
        <hr>
        <div class="modal-footer">
          <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
          <button type="button" class="btn btn-danger deleteHistory">Delete</button>
        </div>
      </div>
    </div>
  </div>
  @stop