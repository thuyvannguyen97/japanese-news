'use strict';

angular.module('mazii')

.controller('NewsController', 
    ["$rootScope", "$scope", "$state", "$timeout", "maziiServ", "dictUtilSer", "historyServ", "localstoreServ", "$stateParams", "$location", "categoryServ",
    function($rootScope, $scope, $state, $timeout, maziiServ, dictUtilSer, historyServ, localstoreServ, $stateParams, $location, categoryServ) {
    
    var positionX, positionY;
    var newsId = $stateParams.id;
    
    $scope.showVideo = false;
    $rootScope.title = 'News';
    var needReregisterEvent = false;
    var dataNew = [];   
    if(localStorage.getItem('dataNew')){
        dataNew = localStorage.getItem('dataNew');
    }
    $scope.$on("changeDetailNews", function (event, data) {
        // query detail news
        maziiServ.getDetailNews(data.id).then(function (data) {
            $scope.currentNews = data;
            $scope.showVideo = false;
            if (newsReadIds.indexOf(data._id) == -1) {
                newsReadIds.push(data._id);
                localStorage.setItem("news_read", JSON.stringify(newsReadIds));
                changeString(data);
            }
            $location.search("id", data._id);
            maziiServ.sendAltNewsLog(data._id);
        });
    });
    
    $scope.playVideo = function () {
        $scope.showVideo = true;
    }
    $scope.getNewsReadClass = function (id) {
        var className = newsReadIds.indexOf(id) != -1 ? 'news_read' : ''; 
        return className;
    }
    
    $scope.checkLink = function (url) {
        if (url.indexOf("http") != -1) {
            return url;
        } else {
            var baseUrl = $scope.currentNews.link;
            var indexSplash = 0;
            for (var i = baseUrl.length - 1; i >= 0; i--) {
                if (baseUrl[i] == "/") {
                    indexSplash = i;
                    break;
                }
            }

            baseUrl = baseUrl.substring(0, indexSplash + 1);
            return baseUrl + url;
        }
    }
    
    $scope.getVideo = function () {
        if ($scope.isMobile()) {
            return '<video class="movie-news-sm movie-news-md" controls> \
                    <source src="https://nhkmovs-i.akamaihd.net/i/news/' + 
                        $scope.currentNews.content.video
                    + '/master.m3u8" type="video/mp4"> \
                    Your browser does not support the video tag. \
                    </video>';
        }
        
        return '<object type="application/x-shockwave-flash" data="http://www3.nhk.or.jp/news/player5.swf" class="movie-news-sm movie-news-md" id="news_image_div3" style="visibility: visible;"> \
            <param name="allowScriptAccess" value="sameDomain"> \
            <param name="allowFullScreen" value="true"> \
            <param name="wmode" value="direct"> \
            <param name="quality" value="high"> \
            <param name="bgcolor" value="#000000"> \
            <param name="flashvars" value="fms=rtmp://flv.nhk.or.jp/ondemand/flv/news/&amp;movie=' + $scope.currentNews.content.video +'"></object>';
    }

    $scope.getAudio = function () {
        var urlAudio = $scope.currentNews.content.audio;
        urlAudio = "http://www3.nhk.or.jp/news/easy/" + urlAudio.replace(".mp3", "") + "/" + urlAudio;
        return '<audio controls><source src="' + urlAudio + '" type="audio/mpeg"></audio>';
    }
    
    $scope.videoAvailable = function () {
        if (typeof device !== "undefined"
 && navigator.connection.type == Connection.NONE) {
            return false;
        }
        
        var link = $scope.currentNews.content.video;
        if (link == null ||
           link == '')
            return false;
        
        return true;
    }
    
    $scope.audioAvailable = function () {
        if (typeof device !== "undefined"
 && navigator.connection.type == Connection.NONE) {
            return false;
        }
        
        var link = $scope.currentNews.content.audio;
        if (link == null ||
           link == '')
            return false;
        
        return true;
    }
    
    $scope.imageAvailable = function () {
        if (typeof device !== "undefined"
 && navigator.connection.type == Connection.NONE) {
            return false;
        }
        
        var link = $scope.currentNews.content.image;
        if (link == null ||
           link == '')
            return false;
        
        return true;
    }

    $scope.isMobile = function () {
        if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
            return true;
        }

        return false;
    }
    
    maziiServ.getHeadNews().then(function (data) {
        $scope.lastestNews = data;
        var newId = data[0].value.id;
        if (newsId != null) {
            newId = newsId;
        }
        maziiServ.getDetailNews(newId).then(function (data) {
            $scope.currentNews = data;
            $location.search("id", newId);
            maziiServ.sendAltNewsLog(newId);
         
            var dtTmp = localStorage.getItem('dtTmp');
            if(!dtTmp){
                localStorage.setItem('dtTmp', data._id);
                changeString(data);        
            }
            else{
                for(var i = 0; i < dtTmp.length; i++){  
                    if(dtTmp[i].id == data._id){
                        dtTmp.push({"id" : data._id});
                        localStorage.setItem('dtTmp', data._id);
                        changeString(data);
                    }
                }    
            }
        })
    });
    var changeString = function(data){
         
        var textmore = data.content.textmore.replace(/<rt>.*?<\/rt>/g, "");
        textmore = textmore.replace(/<.*?>/g, "");
        var content = data.content.textbody.replace(/<rt>.*?<\/rt>/g, "");
        content = content.replace(/<.*?>/g, "");
        content = content.concat(content, textmore);
        content = content.split("。");
        
        if(typeof dataNew == 'string'){
            dataNew = JSON.parse(dataNew);
        }
        var tmp = {};
        var category_id;
        var category_vi_name;
        for(var j = 0; j < data.def.length; j++){
            for(var i = 0; i < content.length; i++){
                if(content[i].indexOf(data.def[j].entity) != -1){
                    var response = categoryServ.getIdCategory(data.def[j].category);
                    if (response == null)
                        continue;
                    category_id = response.id;
                    category_vi_name = response.vi_name;

                    tmp = {
                        "entity_id"     : data.def[j].id,
                        "category_id"   : category_id,
                        "text"          : data.def[j].entity,
                        "example"       : content[i],
                        "category"      : data.def[j].category,
                        "category_vi_name" : category_vi_name
                    };
                    dataNew.push(tmp);  
                    break;  
                }
            }
        }
         
        $rootScope.$broadcast('addNewData', dataNew);
        localStorage.setItem('dataNew', JSON.stringify(dataNew));
        return ;
    }
    var newsReadIds = JSON.parse(localStorage.getItem("news_read"));
    if (newsReadIds == null) {
        newsReadIds = [];
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
            
            // send log
            maziiServ.sendAltLog(altId);
            
            var defOfWord = null;
            
            // get definition of entity
            var def = $scope.currentNews.def;
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

    $scope.translate = function () {
        if ($scope.text) 
            return;
        
        $rootScope.$broadcast("query", { type: 'word', query: $scope.text });
        $('.box-search').css('display', 'none');
    }

    

    $( document ).on( "mousemove", function( event ) {
        $scope.x = event.pageX;
        $scope.y = event.pageY;
    });

    var showFurigana = function () {
        var showFurigana = localstoreServ.getItem('showFurigana');
        if (showFurigana != null && showFurigana == false) {
            // add css to hide furigana
            $('head').append('<style id="setting_css">rt{display: none;}</style>');
        } else {
            $('#setting_css').remove();
        }
    }

    $rootScope.$on('changeShowFurigana', function(data){
        showFurigana();
    });
    sendGA('pageview', 'news');
    
}]);
