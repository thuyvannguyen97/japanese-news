'use strict';

angular.module('mazii')

.controller('JLPTController', ["$rootScope", "$scope", "$state", "$timeout", "maziiServ", "dictUtilSer", "historyServ", "localstoreServ", "$http",
    function($rootScope, $scope, $state, $timeout, maziiServ, dictUtilSer, historyServ, localstoreServ, $http) {
    
    $scope.level = 5;
    $scope.checkFisrt = false;
    $scope.type = "kanji";
    $scope.page = 0;
    $scope.length = 0;
    $scope.firstlength = 0;
    $rootScope.title = 'JLPT';

    $scope.inforJlpt = localstoreServ.getItem('inforJLPT');
    if ($scope.inforJlpt != null) {
        $scope.level = $scope.inforJlpt.level;
        $scope.type = $scope.inforJlpt.type;
        $scope.page = $scope.inforJlpt.page;
        $scope.length = $scope.inforJlpt.length;
        $scope.firstlength = $scope.inforJlpt.firstlength;
    }

    $scope.selectType = function (type) {
        $scope.length = 0;
        $scope.type = type;
        $scope.page = 0;
        $scope.query();
    }

    $scope.changeShowhanViet = function () {
        if ($rootScope.showhanViet == null) {
            var ck = localstoreServ.getItem('showhanViet');
            if (ck == null) {
                $scope.showhanViet = true;
            } else {
                $scope.showhanViet = ck;
            }
        } else {
            $scope.showhanViet = $rootScope.showhanViet;
        }
    }


    $scope.selectLevel = function (level) {
        $scope.length = 0;
        $scope.level = level;
        $scope.page = 0;
        $scope.query();
    }
    
    $scope.getBeautyTitleGrammar = function (title) {
        if (title == null) {
            return null;
        }
        return title.split("=>")[0];
    }
    
    $scope.getBeautyDescGrammar = function (gr) {
        if (gr == null) {
            return gr;
        }
        
        if (gr.value == null || gr.value.usages == null)
            return null;
        
        var mean =  gr.value.usages[0].mean;
        if (mean != null) {
            mean = mean.replace(':', '').replace('：', '');
        }

        mean = dictUtilSer.removeJapaneseChar(mean);
        return mean;
    }

    $scope.showMean = function (mean){
        var show="";
        if(mean.length > 7) {
            show=mean.substring(0,7);

            show += "...";
        }
        else show=mean;

        return show;
    }
    
    $scope.query = function () {
        if (!$scope.checkFisrt) {
            if (!$scope.inforJlpt == null) {
                $scope.type = $scope.inforJlpt.type;
                $scope.level = $scope.inforJlpt.level;
                $scope.page = $scope.inforJlpt.page;
            }
        }

        if ($scope.type == "grammar") {
            maziiServ.queryGrammarJLPT($scope.level, $scope.page).then(function (data) {
               $scope.list = data.results;   
            });
        } else if ($scope.type == "kanji")  {
            maziiServ.queryKanjiJLPT($scope.level, $scope.page).then(function (data) {
               $scope.list = data.results;
            });
        } else {
            $http.get('db/jlpt/word' + $scope.level + '.json')
                .success(function (data) {
                    $scope.list = [];
                    for (var i = $scope.page * 60; i < $scope.page * 60 + 60; i++) {
                        $scope.list.push(data[i]);
                    }
                })
        }   

        $scope.checkFisrt = true;
        var inforJLPT = {
            type : $scope.type,
            level : $scope.level,
            page : $scope.page,
            length : $scope.length,
            firstlength : $scope.firstlength
        }

        localstoreServ.setItem('inforJLPT', inforJLPT);
        $scope.$applyAsync();
    };
    
    var prePageEnable = false;
    var nextPageEnable = false;
    $scope.getPreState = function () {
        if ($scope.page == 0) {
            prePageEnable = false;
            return "btn-disable";
        } else {
            prePageEnable = true;
            return "";
        }
    };
    
    $scope.getNextState = function () {
        if ($scope.list != null) {
            if ($scope.type == "kanji" && $scope.list.length < 100) {
                nextPageEnable = false;
                return "btn-disable";
            }
            
            if ($scope.type == "grammar" && $scope.list.length < 30) {
                nextPageEnable = false;
                return "btn-disable";
            }

            if ($scope.type == "word" && $scope.list.length < 60) {
                nextPageEnable = false;
                return "btn-disable";
            }
            
        } else {
            nextPageEnable = true;
            return "";
        }
        
        nextPageEnable = true;
        return "";
    }
    
    $scope.prePage = function () {
        
        if (prePageEnable == false)
            return;
        
        $scope.page --;
        if ($scope.page < 0) {
            $scope.page = 0;
        }

        if ($scope.type == 'grammar'  || $scope.type == 'word') {
            $scope.length =  $scope.length - $scope.firstlength;
        }
        $scope.query();
    }
    
    $scope.nextPage = function () {
        if (nextPageEnable == false) {
            return;
        }
        
        $scope.page ++;
        if ($scope.type == 'grammar' || $scope.type == 'word') {
            $scope.firstlength = $scope.list.length;
            $scope.length += $scope.list.length;
        }
        $scope.query();
    }
    
    $scope.showKanji = function (kanji) {
        $rootScope.$broadcast("query", { type: 'kanji', query: kanji });
    }
    
    $scope.showGrammar = function (query) {
        //console.log(query);
        $rootScope.$broadcast("query", { type: 'grammarDetail', query: query });
    }

    $scope.showWord = function (word) {
        $rootScope.$broadcast("query", { type: 'word', query: word });
    }
    
    $scope.query();
    $scope.changeShowhanViet();

    $scope.$on("showhanViet", function(event){
        $scope.changeShowhanViet();
    });

    sendGA('pageview', 'jlpt');
}]);
    
