'use strict';

angular.module('mazii')

.controller('SearchController', ["$rootScope", "$scope", "$state", "$timeout", "maziiServ", "dictUtilSer", "historyServ", "$stateParams", "$location", "localstoreServ", "ngAudio", "$window", "$http", 
    function($rootScope, $scope, $state, $timeout, maziiServ, dictUtilSer, historyServ, $stateParams, $location, localstoreServ, ngAudio, $window, $http) {
    
    initSearchCtrl = true;
    var isBackHistory = false;
    
    $scope.examples = null;
    $scope.words = null;
    $scope.kanjis = null;
    $scope.grammars = null;
    $scope.suggest = null;
    $scope.googleTranslate = null;
    $rootScope.title = 'Search';
    $scope.noResultsKanjis  = true;
            
    $scope.tabSelected = 0;
    $scope.showLoading = false;
    $scope.currentKanjiSelected = 0;
    $scope.noResults = false;
    $scope.showNotifynewVersion = SHOW_NOTIFY_NEW_VERSION;
    $scope.startSearch = false;

    var showKanjiDraw = false;
    var currentQuery = '';
    var tabName;
    var isWanakana;
    var showSuggestSearch = localstoreServ.getItem('showSuggest');;

    $scope.showKanjiDrawTable = function () {
        showKanjiDraw = !showKanjiDraw;
        if (showKanjiDraw == false) {
            currentQuery = $("#search-text-box").val();
            if (currentQuery != "") {
                $scope.startQuery(currentQuery);
            }
        }
    }
    
     $scope.queryNotNull = function () {
        return currentQuery != null && currentQuery != '';
    }
    
    $scope.getCurrentQuery = function () {
        return currentQuery;
    }
    
    $scope.isShowKanjiDraw = function () {
        return showKanjiDraw;
    }
    
    $scope.inputEnter = function () {
        currentQuery = $("#search-text-box").val();
        if (currentQuery != "") {
            $scope.startQuery(currentQuery);
        }
    }
    
    $scope.$on("query", function (event, data) {

        if (data == null || data.tag == 'quick-search')
            return;
        
        if (data.query == null) {
            currentQuery = data;
            $scope.startQuery(data, true);
        } else {
            
            if (data.type == "grammarDetail")
                return;
            
            currentQuery = data.query;
            $scope.setTabByChar(data.type[0]);
            $scope.startQuery(currentQuery, true);
        }
    });

    
            
    $scope.$on("insertQueryText", function (event, data) {
        if (data == null || data == '') {
            return;
        }
        
        var currentQuery = $("#search-text-box").val();
        currentQuery = currentQuery + data;
        $("#search-text-box").val(currentQuery);
    });
    
    $scope.clearQuery = function () {
        $("#search-text-box").val('');
        currentQuery = '';
        $scope.suggestSen = [];
        setTimeout(function () {
            $("#search-text-box").focus();
        }, 10);
    }

    
    $scope.getTypeButtonClass = function (id) {
        if (id == $scope.tabSelected) {
            return "btn-primary";
        } else {
            return "btn-default";
        }
    }
    
    $scope.changeTypeSearch = function (id, noCallSearch) {
        if (id != $scope.tabSelected) {
            $scope.tabSelected = id;
        } else {
            return;
        }
        
        if (showKanjiDraw == true) {
            showKanjiDraw = false;
        }
        
        $('.search-input-container button').removeClass("tab-active");
        $('#tab' + id).addClass("tab-active");

        var placeHolder = "";
        switch (id) {
            case 0:
                placeHolder = "日本, nihon, Japan";
                tabName = 'word';
                break;
            case 1:
                placeHolder = "公, public";
                tabName = 'kanji';
                break;
            case 2:
                placeHolder = "優しい, yasashii, kind";
                tabName = 'example';
                break;
            case 3:
                placeHolder = "のに, để";
                tabName = 'grammar';
                break;
        }
        
        $("#search-text-box").attr("placeholder", placeHolder);
        
        if (noCallSearch != true) {
            currentQuery = $("#search-text-box").val();
            if (currentQuery && currentQuery != "") {
                $scope.startQuery(currentQuery);
            }
        }
    }

    var currentTimeoutFastSearch = null;
    $scope.enterInput = function (query) {
        if (query != null && query != '') {
            if (currentTimeoutFastSearch != null) {
                clearTimeout(currentTimeoutFastSearch);
            }
            
            if (query.length > 1 &&
                query[0] == query[0].toUpperCase() &&
                query[1] == query[1].toLowerCase()) {
                query = query.toLowerCase();
            }
            
            currentTimeoutFastSearch = setTimeout(function () {
                var sen = {
                    type : tabName,
                    query : query
                };

                //console.log(query);
                $scope.suggestSen = $scope.filter(sen);
                if ($scope.tabSelected == 1 && !dictUtilSer.isJapanese(query))
                    $scope.suggestSen = [];

                new autocomplete( 'search-text-box', 'list-suggest-history' );
                var width = $('.search-box-range').width();
                $('.list-suggest-history').css('width', width);
                if (!$scope.$$phase && !$rootScope.$$phase) {
                    $scope.$digest();
                }
            }, 400);  

        } else {
            $scope.suggestSen = [];
            clearTimeout(currentTimeoutFastSearch);
            currentTimeoutFastSearch = null;
        }

    }
    
    $scope.suggestClick = function (key) {
        if (dictUtilSer.isJapanese(key)) {
            $scope.startQuery(key.split(" ")[0], true);
        } else {
            $scope.startQuery(key, true);
        }
    }
    
    $scope.startQuery = function (query, forceVietnamese) {

        $scope.startSearch = true;
        if (currentTimeoutFastSearch != null) {
            clearTimeout(currentTimeoutFastSearch);
        }
        
        showKanjiDraw = false;
        $scope.showServerContent = false;

        currentQuery = query;
        
        $scope.noResults = false;
        $scope.examples = null;
        $scope.words = null;
        $scope.kanjis = null;
        $scope.grammars = null;
        $scope.suggest = null;
        $scope.googleTranslate = null;
        $scope.lang = "JA";
        $scope.showLoading = true;
        $rootScope.isWanakana = false;
        
        if ($scope.tabSelected == 1) {
            forceVietnamese = true;
        }
        
        var inputIsVietnamese = false;

        


        if (dictUtilSer.isJapanese(query) == false) {

            if (!dictUtilSer.isVietnamese(query) && forceVietnamese == null) {

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
                inputIsVietnamese = true;
                $scope.lang = "EN";
            }
        }
        
        currentQuery = query;
        $("#search-text-box").val(currentQuery);
        $scope.query = query;
        
        if ($scope.tabSelected == 0) {

            historyServ.push(query, "word", $scope.lang);
            var dict = "jaen";
            if ($scope.lang == "EN" || inputIsVietnamese) {
                dict = "enja";
            }
            
            maziiServ.search("word", query, dict).then(function (data) {
                
                var from = 'ja';
                var to = 'en';
                
                if (!dictUtilSer.isJapanese(query)) {
                    from = 'en'
                    to = 'ja';
                } else {
                    from = 'ja';
                    to = 'en';
                }

                if (data == null) {
                    $scope.words = null;
                    dictUtilSer.showLoading(false);
                    maziiServ.googleTranslate(query, from, to, function (data) {
                        if (data == null) {
                            $scope.noResults = true;
                        }
                        
                        $scope.googleTranslate = data;
                        if (!$scope.$$phase && !$rootScope.$$phase) {
                            $scope.$digest();
                        }
                    });
                    
                    return;
                }
                
                
                if (data.status == 200) {
                
                    $scope.words = [];
                    $scope.suggest = [];
                    
                    for (var i = 0; i < data.data.length; i++) {

                        // Get list phonectic
                        var phonetic;
                        if (data.data[i].phonetic == null)
                            phonetic = [];
                        else 
                            phonetic = data.data[i].phonetic.split(' ');

                        var means = [];
                        for (var j = 0 ; j < data.data[i].means.length; j++) {
                            var mean = data.data[i].means[j].mean.split(',');
                            for (var k = 0; k < mean.length; k++)
                                means.push(mean[k].toLowerCase());
                        }

                        // Check found result for search
                        if (data.data[i].word == query || (phonetic.indexOf(query) != -1 && phonetic.length > 1)  || means.indexOf(query) != -1) {
                            $scope.words.push(data.data[i]);
                        } else {
                            if ($scope.suggest.length < 10)
                                $scope.suggest.push(data.data[i]);
                        }
                    }
                    
                    $scope.showLoading = false;
                } else {
                    $scope.words = null;
                    $scope.showLoading = false;                    
                }
                
                maziiServ.googleTranslate(query, from, to).then(function (data) {
                    $scope.googleTranslate = data;
                    if ($scope.$$phase == null)
                        $scope.$apply();
                })
                
            }, function (err) {
                $scope.words = null;
                $scope.showLoading = false;
                $scope.noResults = true;
            });

            maziiServ.search("kanji", query).then(function (data) {
                if (data.status == 200) {
                    if (dictUtilSer.isJapanese(query)) {
                        var kanjis = dictUtilSer.getKanjiChara(query);
                        $scope.resultKanjis = dictUtilSer.sortHVDataByKeyWord(kanjis, data.results);
                    } else {
                        $scope.resultKanjis = data.results;
                    }                    
                    $scope.noResultsKanjis = false;
                    if ($scope.resultKanjis.length == 0 )
                        $scope.noResultsKanjis = true;
                } else {
                    $scope.resultKanjis = null;
                    $scope.noResultsKanjis = true;
                }

            }, function (err) {
                $scope.resultKanjis = null;
                $scope.noResultsKanjis = true;
            });

            sendGA("search", "word", query);
            
        } else if ($scope.tabSelected == 1) {
            maziiServ.search("kanji", query).then(function (data) {
                $scope.currentKanjiSelected = 0;
                if (data.status == 200) {
                    if (dictUtilSer.isJapanese(query)) {
                        var kanjis = dictUtilSer.getKanjiChara(query);

                        $scope.kanjis = dictUtilSer.sortHVDataByKeyWord(kanjis, data.results);
                    } else {
                        $scope.kanjis = data.results;
                    }
                    $scope.showLoading = false;
                    
                    if ($scope.kanjis.length == 0)
                        $scope.kanjis = null;
                    else                     
                        historyServ.push(query, "kanji", $scope.lang);
                } else {
                    $scope.kanjis = null;
                    $scope.showLoading = false;
                    $scope.noResults = true;
                }

            }, function (err) {
                $scope.kanjis = null;
                $scope.showLoading = false;
                $scope.noResults = true;
            });
            
            sendGA("search", "kanji", query);
        } else if ($scope.tabSelected == 3) {
            maziiServ.search("grammar", query).then(function (data) {
                if (data.status == 200) {
                    $scope.grammars = data.results;
                    $scope.showLoading = false;
                    historyServ.push(query, "grammar", $scope.lang);
                } else {
                    $scope.grammars = null;
                    $scope.showLoading = false;
                    $scope.noResults = true;
                }

            }, function (err) {
                $scope.grammars = null;
                $scope.showLoading = false;
                $scope.noResults = true;
            });
            sendGA("search", "grammar", query);
            
        } else if ($scope.tabSelected == 2) {
            maziiServ.search("example", query).then(function (data) {
                if (data.status == 200) {
                    $scope.examples = data.results;
                    $scope.showLoading = false;
                    historyServ.push(query, "example", $scope.lang);
                } else {
                    $scope.examples = null;
                    $scope.showLoading = false;
                    $scope.noResults = true;
                }

            }, function (err) {
                $scope.examples = null;
                $scope.showLoading = false;
                $scope.noResults = true;
            });
            
            sendGA("search", "example", query);
        }
        $scope.suggestSen = [];
        
        // change hash search when user enter a new query
        if (isBackHistory == false) {
            var newHash = "/search?type=" + $scope.getCurrentType()  + "&query=" + query;
            $location.url(newHash);
            $location.replace();
            $window.history.pushState(null, "Search", $location.absUrl());
        }
        
    };
    
    $scope.changeKanjiShow = function (index) {
        $scope.currentKanjiSelected = index;
    }
    
    $scope.getCurrentKanji = function () {
        return $scope.kanjis[$scope.currentKanjiSelected];
    }
    
    $scope.kanjiSeletectClass = function ($index) {
        if ($scope.currentKanjiSelected == $index) {
            return "selected";
        }
        
        return "";
    }
    
    $scope.getCurrentType = function () {
        switch ($scope.tabSelected) {
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
    
    $scope.setTabByChar = function (c) {
        var id = 0;
        if (c == null || c == "") {
            id = 0;
        } else {
            if (c == "w") {
                id = 0;
            } else if (c == "k") {
                id = 1;
            } else if (c == "e") {
                id = 2;
            } else if (c == "g") {
                id = 3;
            } else if (c == "s") {
                id = 2;
            }
        }
        
        $scope.changeTypeSearch(id, true);
    }
    
    var initType = $stateParams.type;
    var initQuery = $stateParams.query;
    $scope.setTabByChar(initQuery);
    
    if (initQuery != null && initQuery != "") {
        currentQuery = initQuery;
        $scope.startQuery(initQuery);
    } else {
        currentQuery = '';
    }
    
    $scope.$on("searchKanji", function(event, message){
        $scope.changeTypeSearch(1, true);
        $scope.startQuery(message);
    });
        
    $scope.showServerContent = false;
    /*maziiServ.getServerContent().then(function(data) {
       $scope.serverContent = data;
        $scope.showServerContent = true;
    });*/
    
    $("#search-text-box").on('input', function() {
        var keyword = $("#search-text-box").val();
        keyword = keyword.trim();
        currentQuery = keyword;
        $scope.enterInput(keyword);
    });

    $scope.showHistoryPanel = function () {
        $('.history-panel').addClass('open-history-panel');
        $('.cover').css('display', 'block');
        $('body').css('overflow', 'hidden');
    }

    $scope.showDetailSuggest = function (id) {
        $('.icon_' + id).addClass('hiden');
        $('.detail_' + id).removeClass('hiden');
        $('.' + id).addClass('hiden');
    }

    $scope.convertKindToReadable = function (abr) {
        if (abr == null || abr == "")
            return "";
        
        return dictUtilSer.convertKindToReadable(abr);
    }

    $scope.playAudio = function (phonetic) {
        var ttsUrl = "http://www.ispeech.org/p/generic/getaudio?text=";
        var ttsParam = "&voice=jpjapanesemale&speed=0&action=convert";
        var audioUrl = ttsUrl + phonetic + ttsParam;
        $scope.sound = ngAudio.load(audioUrl);
        $scope.sound.play();
    }

    $rootScope.$on('chaneShowSuggest', function(data){
        showSuggestSearch = localstoreServ.getItem('showSuggest');
    });

    $scope.setQueryType = function (query, type) {
        $rootScope.$broadcast("setQueryType", {query: query, type: type});
    }

    $scope.translate = function () {
        $rootScope.$broadcast("query", { type: 'word', query: $scope.text, tag : 'quick-search' });
        $('.box-search').css('display', 'none');
    }

    $scope.selectText = function () {
        var Kolich;
        if(!window.Kolich){
            Kolich = {};
        }

        Kolich.Selector = {};
        Kolich.Selector.getSelected = function(){
            var t = '';
            if(window.getSelection){
                t = window.getSelection();
            }else if(document.getSelection){
                t = document.getSelection();
            }else if(document.selection){
                t = document.selection.createRange().text;
            }
            return t;
        }

        Kolich.Selector.mouseup = function(){
            var st = Kolich.Selector.getSelected();
            if(st!=''){
                $scope.text = st.toString();
                $('.box-search').css('display', 'block');
                $('.box-search').css('left', $scope.x - 100);
                $('.box-search').css('top', $scope.y - 200);
            }
        }

        $(document).ready(function(){
            $(document).bind("mouseup", Kolich.Selector.mouseup);
        });
    };

    $scope.$on('$locationChangeSuccess', function(ev, newUrl, oldUrl, newState, oldState) {
        var regexp = /type=(.)&query=(.+)/i;
        var matches = newUrl.match(regexp);
        
        if (matches == null)
            return;
        
        if (matches.length != 3)
            return;
        
        var typeValue = matches[1];
        var queryValue = decodeURIComponent(matches[2]);
        if (queryValue == currentQuery) {
            isBackHistory = false;
            return;
        }
        
        isBackHistory = true;
        // start search new query
        $scope.setTabByChar(typeValue);
        $scope.startQuery(queryValue, true);
    });
    
    
    $( document ).on( "mousemove", function( event ) {
        $scope.x = event.pageX;
        $scope.y = event.pageY;
    });

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
                    string = string.substring(56, string.length);
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
                    string = string.substring(56, string.length);
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
    
    // Thay ký tự | thành ,
    $scope.convertNice = function (str) {
        return dictUtilSer.convertNice(str);
    }


    $('body').removeClass('hidden');
    $scope.selectText();
    
    dictUtilSer.showTitlePage();
    sendGA('pageview', 'search');

}]);
