'use strict';

var initSearchCtrl = false;
var SERVER_ADRESS = 'http://crazyjapanese.com:8989';
var SHOW_NOTIFY_NEW_VERSION = true;
var TIME_SHOW_SURVAY = 30000;
// Declare app level module which depends on views, and components
var module = angular.module('mazii', [
  'ui.router',
  'mazii.service.history',
  // 'mazii.service.note',
  'mazii.service.util',
  'mazii.service.search',
  'mazii.service.category',
  'ngAudio',
  'ngSanitize',
  //'templates-main'
  ], function($interpolateProvider) {
    $interpolateProvider.startSymbol('<%');
    $interpolateProvider.endSymbol('%>');
});

module.root = "../resources/views/";

module.run(["$rootScope", "$state", "$timeout", "maziiServ", "dictUtilSer", "historyServ", "$stateParams", "$location", "$http", "ngAudio",
   function($rootScope, $state, $timeout, maziiServ, dictUtilSer, historyServ, $stateParams, $location, $http, ngAudio) {
    // --------news-------------
    $rootScope.id = $('.news_active').attr('id');
    
    maziiServ.getDetailNews($rootScope.id).then(function(data){
        $rootScope.currentNews = data;
    });
    $rootScope.showVideo = false;
    
    $rootScope.playVideo = function () {
        $rootScope.showVideo = true;
    }

    $rootScope.isMobile = function () {
        if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
            return true;
        }

        return false;
    }
    $(document).on("click", "a.dicWin", function(e) {
        var contentHtml = e.currentTarget.innerHTML;
        var content = '';
        
        content = contentHtml.replace(/<rt>.*?<\/rt>/g, "");
        content = content.replace(/<.*?>/g, "");
        
        if (content == '')
            return;
        
        var altId = $(e.currentTarget).attr("altid");
        if (altId != null && altId != "") { 
            altId = parseInt(altId);
            
            var defOfWord = null;
            
            // get definition of entity
            var def = $rootScope.currentNews.def;
            if (def != null) {
                for (var i = 0; i < def.length; i++) {
                    if (def[i].id == altId) {
                        defOfWord = def[i];
                    }
                }
            }
            
            if (defOfWord != null && defOfWord.entity != content) {
                content = defOfWord.entity;
            }
            
            $rootScope.$broadcast("query", { type: 'word', query: content, aux: defOfWord });
            
        } else {
            $rootScope.$broadcast("query", { type: 'word', query: content });
        }
    });
// ---------------------------------------------
// --------------Dictionary---------------------
    var showKanjiDraw = false;
    var currentQuery = '';

    $rootScope.showKanjiDrawTable = function () {
        showKanjiDraw = !showKanjiDraw;
    }
    $rootScope.searchThis = function (query) {
        $rootScope.$broadcast("query", { type: "word", query: query, tag: "quick-search" });
    }
    $rootScope.changeTypeSearch = function (id) {
        $('.search-input-container button').removeClass("tab-active");
        $('#tab' + id).addClass("tab-active");

        var placeHolder = "";
        switch (id) {
            case 0:
                placeHolder = "日本, nihon, Japan";
                break;
            case 1:
                placeHolder = "公, public";
                break;
            case 2:
                placeHolder = "優しい, yasashii, kind";
                break;
        }
        
        $("#search-text-box").attr("placeholder", placeHolder);
    }

    $rootScope.playAudio = function (word) {
        var baseAudioUrl = "http://data.mazii.net/audios/";
        var audioUrl = baseAudioUrl + dictUtilSer.convertJptoHex(word).toUpperCase() + ".mp3";
        $rootScope.sound = ngAudio.load(audioUrl);
        $rootScope.sound.play();
    }

    $rootScope.showDetailSuggest = function (id) {
        $('.icon_' + id).addClass('hiden');
        $('.detail_' + id).removeClass('hiden');
        $('.' + id).addClass('hiden');
    }

    $rootScope.isShowKanjiDraw = function () {
        return showKanjiDraw;
    }

    $rootScope.inputEnter = function () {
        var query = $("#search-text-box").val();
        var tabSearch = $('.tab-active').val();
        switch(tabSearch){
            case 'word':
                historyServ.push(query, "word");
                break;
            case 'kanji':
                historyServ.push(query, "kanji");
                break;
            case 'sentence':
                historyServ.push(query, "example");
                break;
                
        }
        if(query != '' && query != null){
            $rootScope.createUrl(tabSearch, query);
        }

    }

    $rootScope.createUrl = function(tabSearch, query){
        var from = 'ja';
        var to = 'en';
        query = query.trim();
        if (!dictUtilSer.isJapanese(query) && tabSearch != 'kanji') {
            if (!dictUtilSer.isVietnamese(query)) {
                // check auto capital first letter
                if (query.length > 1 &&
                    query[0] == query[0].toUpperCase() &&
                    query[1] == query[1].toLowerCase()) {
                    query = query.toLowerCase();
                }

                query = wanakana.toKana(query);
                $rootScope.isWanakana = true;
            } else {
                query = query.toLowerCase();
                $rootScope.lang = "EN";
            }
        }

        currentQuery = query;
        if(!dictUtilSer.isJapanese(currentQuery)){
            from = 'en';
            to = 'ja';
        }
        $("#search-text-box").val(currentQuery);
        if(currentQuery != '' && tabSearch == 'word'){
            window.location.href = "search/" + tabSearch + '/' + currentQuery + '-' + from + '-' + to;
        }else{
            window.location.href = "search/" + tabSearch + '/' + currentQuery + '-' + from;
        }
    }

    $rootScope.clearQuery = function () {
        $("#search-text-box").val('');
        setTimeout(function () {
            $("#search-text-box").focus();
        }, 10);
    }

    $rootScope.queryNotNull = function () {
        currentQuery = $("#search-text-box").val();
        if(currentQuery != ''){
            return true;
        }
        return false;
    }
    // Thay ký tự | thành ,
    $rootScope.convertNice = function (str) {
        return dictUtilSer.convertNice(str);
    }
    
    $rootScope.showHistoryPanel = function () {
        $('.history-panel').addClass('open-history-panel');
        $('.cover').css('display', 'block');
        $('body').css('overflow', 'hidden');
    }

    $rootScope.$on("insertQueryText", function (event, data) {
        if (data == null || data == '') {
            return;
        }
        
        var currentQuery = $("#search-text-box").val();
        currentQuery = currentQuery + data;
        $("#search-text-box").val(currentQuery);
    });

    $rootScope.filter = function (query) {
        var keyword = query;
        var suggestList = null;
        if (dictUtilSer.isJapanese(keyword)) {
            suggestList = dictUtilSer.realtimeSearch("ja", keyword);
        } else {

            if (dictUtilSer.isVietnamese(keyword)) {  
                suggestList = dictUtilSer.realtimeSearch("vi", keyword);
            } else {
                    // check auto capital first letter
                    if (keyword.length > 1 &&
                        keyword[0] == keyword[0].toUpperCase() &&
                        keyword[1] == keyword[1].toLowerCase()) {
                        keyword = keyword.toLowerCase();
                }

                var kanaKeyword = wanakana.toKana(keyword);
                suggestList = dictUtilSer.realtimeSearch("ja", kanaKeyword);  
                suggestList.splice(0, 0, keyword);
            }
        }

        return suggestList;    
    }


    $("#search-text-box").on('input', function() {
        var keyword = $("#search-text-box").val();
        var tabSelected = $(".tab-active").val();
        
        if(tabSelected != 'kanji'){
            var suggestSen = [];
            currentQuery = keyword.trim();
            suggestSen = $rootScope.filter(currentQuery);
            new autocomplete( 'search-text-box', 'list-suggest-history' );
            var width = $('.search-box-range').width();
            $('.list-suggest-history').css('width', width);
            $('#list-suggest-history').html('');
            for (var i = 0; i < suggestSen.length; i++) {
                var item = suggestSen[i];
                if(dictUtilSer.isJapanese(item)){
                    var div = '<div class="suggest-item ng-scope" id="'+i+'"><span><b>'+item.split(' ')[0]+'</b>'+item.replace(item.split(' ')[0], '')+' </span></div>';
                }else{
                    var div = '<div class="suggest-item ng-scope" id="'+i+'"><span><b>'+item+'</b></span></div>';
                }
                if(suggestSen[0] != ''){
                    $('#list-suggest-history').append(div);
                }
            }
        }
        $rootScope.suggestClick(suggestSen);
    });

   $rootScope.suggestClick = function(item){
        var tabSelected = $(".tab-active").val();
        $(document).on('click', 'div.suggest-item', function(e) {
            var id = $(this).attr('id');
            for (var i = 0; i < item.length; i++) {
                if(id == i){
                    if(dictUtilSer.isJapanese(item[i])){
                        $rootScope.createUrl(tabSelected, item[i].split(' ')[0]);
                    }else{
                        $rootScope.createUrl(tabSelected, item[i]);
                    }
                }
            }
        });
    };

   $rootScope.searchKan = function(keyword){
        var tabSelected = $(".tab-active").val();
        $rootScope.createUrl(tabSelected, keyword);
   };

   var scrolLength = 100;

   var autocomplete = function ( textBoxId, containerDivId ) { 
    var ac = this;    
    this.textbox     = document.getElementById(textBoxId);    
    this.div         = document.getElementById(containerDivId);    
    this.list        = this.div.getElementsByTagName('div');    
    this.pointer     = null;    
    this.textbox.onkeydown = function( e ) {
        e = e || window.event;        
        switch( e.keyCode ) {            
            case 38: //up                
            ac.selectDiv(-1);                
            break;            
            case 40: //down                
            ac.selectDiv(1);                
            break;        }    
        }    
        this.selectDiv = function( inc ) {        
            if(this.pointer > 1){
               scrollDiv();
           }

           if(this.pointer == 0)
            document.getElementById("list-suggest-history").scrollTop = 0;   

        if( this.pointer !== null && this.pointer+inc >= 0 && this.pointer+inc < this.list.length ) { 
            this.list[this.pointer].className = 'suggest-item';            
            this.pointer += inc;            
            this.list[this.pointer].className = 'active-suggest';            
            var string = this.list[this.pointer].innerHTML;
            string = string.substring(9, string.length);
            for (var i = 0; i < string.length; i++) {
                if (string[i] == '<') {
                    string = string.substring(0, i);
                    break;
                }
            }

            this.textbox.value = string;
        }

        if( this.pointer === null ) {            
            this.pointer = 0;            
            scrolLength = 20;
            this.list[this.pointer].className = 'active-suggest';            
            var string = this.list[this.pointer].innerHTML;
            string = string.substring(9, string.length);
            for (var i = 0; i < string.length; i++) {
                if (string[i] == '<') {
                    string = string.substring(0, i);
                    break;
                }
            }

            this.textbox.value = string;
        }    
    }
    function scrollDiv(){
     if(window.event.keyCode == 40){
         document.getElementById("list-suggest-history").scrollTop = scrolLength;
         scrolLength = scrolLength + 40;  
     }           
     else if(window.event.keyCode == 38){
         scrolLength = scrolLength - 40;  
         document.getElementById("list-suggest-history").scrollTop = scrolLength;
     }
 }
}
// --------------End-Dictionary-----------------


    $rootScope.noResults = false;
    $rootScope.examples = null;
    $rootScope.words = null;
    $rootScope.kanjis = null;
    $rootScope.grammars = null;
    $rootScope.tabSelected = 0;
    $rootScope.showLoading = false;
    $rootScope.currentKanjiSelected = 0;
    
    
    $rootScope.$on("query", function (event, data) {
        if (data == null)
            return;

        if (data.query == null) {
            $rootScope.startQuery(data, true);
        } else {
            $rootScope.setTabByChar(data.type[0]);
            if (data.type != 'grammarDetail') {
                $rootScope.startQuery(data.query, true, data.aux);
            } else {
                $rootScope.queryGrammarDetail(data.query);
            }
        }
        
        // show modal
        $("#instant-search").modal();
        
    });
    
    
    $rootScope.startQuery = function (query, forceVietnamese, aux) {
        $rootScope.noResults = false;
        $rootScope.examples = null;
        $rootScope.words = null;
        $rootScope.kanjis = null;
        $rootScope.grammars = null;
        $rootScope.grammarDetail = null;
        $rootScope.suggest = null;
        $rootScope.googleTranslate = null;
        $rootScope.wordAux = aux;
        
        var inputIsVietnamese = false;
        if (dictUtilSer.isJapanese(query) == false) {
            if (!dictUtilSer.isVietnamese(query) && forceVietnamese == null) {

                // check auto capital first letter
                if (query[0] == query[0].toUpperCase() &&
                   query[1] == query[1].toLowerCase()) {
                   query = query.toLowerCase();
            }

           query = wanakana.toKana(query);
        } else {
            query = query.toLowerCase();
            inputIsVietnamese = true;
        }
    }

if ($rootScope.tabSelected == 0) {
    $rootScope.titleInstantSearch = "Tra nhanh từ vựng: " + query;
    historyServ.push(query, "word", inputIsVietnamese ? "EN" : "JA");

    var dict = "jaen";
    if (inputIsVietnamese) {
        dict = "enja";
    }

    maziiServ.search("word", query).then(function (data) {

        var from = 'ja';
        var to = 'en';

        if (!dictUtilSer.isJapanese(query)) {
            from = 'en';
            to = 'ja';
        } else {
            from = 'ja';
            to = 'en';
        }

        if (data.status == 200) {

            $rootScope.words = [];
            $rootScope.suggest = [];

            for (var i = 0; i < data.data.length; i++) {

                    // Get list phonectic
                    var phonetic;
                    if (data.data[i].phonetic == null)
                        phonetic = [];
                    else 
                        phonetic = data.data[i].phonetic.split(' ');

                    // Get list means
                    var means = [];
                    for (var j = 0 ; j < data.data[i].means.length; j++) {
                        var mean = data.data[i].means[j].mean.split(',');
                        for (var k = 0; k < mean.length; k++)
                            means.push(mean[k].toLowerCase());
                    }

                    // Check found result for search
                    if (data.data[i].word == query || (phonetic.indexOf(query) != -1 && phonetic.length > 1)  || means.indexOf(query) != -1) {
                        $rootScope.words.push(data.data[i]);
                    } else {
                        if ($rootScope.suggest.length < 10)
                            $rootScope.suggest.push(data.data[i]);
                    }
                }
                
                if ($rootScope.words.length == 0) {
                    $rootScope.words = null;
                }
                $rootScope.showLoading = false;
            } else {
                $rootScope.words = null;
                $rootScope.showLoading = false;
            }
            
            maziiServ.googleTranslate(query, from, to).then(function (data) {
                $rootScope.googleTranslate = data;
                if ($rootScope.$$phase == null)
                    $rootScope.$apply();
            })
            
        }, function (err) {
            $rootScope.words = null;
            $rootScope.showLoading = false;
            $rootScope.noResults = true;
        });

    maziiServ.search("kanji", query).then(function (data) {
        if (data.status == 200) {
            if (dictUtilSer.isJapanese(query)) {
                var kanjis = dictUtilSer.getKanjiChara(query);

                $rootScope.resultKanjis = dictUtilSer.sortHVDataByKeyWord(kanjis, data.results);
            } else {
                $rootScope.resultKanjis = data.results;
            }                    
            $rootScope.noResultsKanjis = false;

            if ($rootScope.resultKanjis.length == 0 )
                $rootScope.noResultsKanjis = true;
        } else {
            $rootScope.resultKanjis = null;
            $rootScope.noResultsKanjis = true;
        }

    }, function (err) {
        $rootScope.resultKanjis = null;
        $rootScope.noResultsKanjis = true;
    });

} else if ($rootScope.tabSelected == 1) {
    $rootScope.titleInstantSearch = "Quick search kanji: " + query;

    maziiServ.search("kanji", query).then(function (data) {
        $rootScope.currentKanjiSelected = 0;
        if (data.status == 200) {
            var kanjis = dictUtilSer.getKanjiChara(query);

            $rootScope.kanjis = dictUtilSer.sortHVDataByKeyWord(kanjis, data.results);
            $rootScope.showLoading = false;
            if ($rootScope.kanjis.length == 0)
                $rootScope.kanjis = null;
            else                     
                historyServ.push(query, "kanji", $rootScope.lang);
        } else {
            $rootScope.kanjis = null;
            $rootScope.showLoading = false;
            $rootScope.noResults = true;
        }

    }, function (err) {
        $rootScope.kanjis = null;
        $rootScope.showLoading = false;
        $rootScope.noResults = true;
    });

} else if ($rootScope.tabSelected == 3) {
    $rootScope.titleInstantSearch = "Quick search grammar: " + query;

    maziiServ.search("grammar", query).then(function (data) {
        if (data.status == 200) {
            $rootScope.grammars = data.results;
            $rootScope.showLoading = false;
            historyServ.push(query, "grammar");
        } else {
            $rootScope.grammars = null;
            $rootScope.showLoading = false;
            $rootScope.noResults = true;
        }

    }, function (err) {
        $rootScope.grammars = null;
        $rootScope.showLoading = false;
        $rootScope.noResults = true;
    });


} else if ($rootScope.tabSelected == 2) {

    maziiServ.search("example", query).then(function (data) {
        if (data.status == 200) {
            $rootScope.examples = data.results;
            $rootScope.showLoading = false;
            historyServ.push(query, "example");
        } else {
            $rootScope.examples = null;
            $rootScope.showLoading = false;
            $rootScope.noResults = true;
        }

    }, function (err) {
        $rootScope.examples = null;
        $rootScope.showLoading = false;
        $rootScope.noResults = true;
    });
}
};

$rootScope.changeKanjiShow = function (index) {
    $rootScope.currentKanjiSelected = index;
}


$rootScope.kanjiSeletectClass = function ($index) {
    if ($rootScope.currentKanjiSelected == $index) {
        return "selected";
    }

    return "";
}

$rootScope.getCurrentType = function () {
    switch ($rootScope.tabSelected) {
        case 0:
        return "w";
        case 1:
        return "k";
        case 2:
        return "s";
        case 3:
        return "g";
    }

    return "w";
}

$rootScope.setTabByChar = function (c) {
    if (c == null || c == "") {
        $rootScope.tabSelected = 0;
    } else {
        if (c == "w") {
            $rootScope.tabSelected = 0;
        } else if (c == "k") {
            $rootScope.tabSelected = 1;
        } else if (c == "e") {
            $rootScope.tabSelected = 2;
        } else if (c == "g") {
            $rootScope.tabSelected = 3;
        } else if (c == "s") {
            $rootScope.tabSelected = 2;
        }
    }
}

    // Close modal

    $('.close-modal-jlpt').click(function () {
        $('#instant-search').modal('hide');
    })

    $('.close-modal-report').click(function () {
        $('#reportModal').modal('hide');
    })

    $('.close-modal-alert').click(function () {
        $('#alertModal').modal('hide');
    })

    $('.close-delete-history-modal').click(function () {
        $('confirmDeleteHistoryModal').modal('hide');
    })


    $rootScope.printKanjiMean = function (mean) {
        if (mean == null)
            return mean;
        
        return mean.replace(/\|/g, ", ")
    }
}]);



module.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if (event.which === 13) {
                scope.$apply(function () {
                    scope.$eval(attrs.ngEnter);
                });

                event.preventDefault();
            }
        });
    };
});

module.directive('focusMe', ["$timeout",
    function ($timeout) {
        return {
            link: function (scope, element, attrs) {

                $timeout(function () {
                    element[0].focus();
                }, 500);
            }
        };
    }]);
