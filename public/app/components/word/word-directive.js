angular.module('mazii')


.directive('ngWord', function () {
    return {
        restrict: 'E',
        templateUrl: module.root + 'template/word/word-template.php',
        scope: {
            data: '=data',
            aux: '=aux'
        },
        controller: ["$rootScope", "$scope", "$http", "dictUtilSer", "ngAudio", function ($rootScope, $scope, $http, dictUtilSer, ngAudio) {
        
            
            var baseAudioUrl = "http://data.mazii.net/audios/";
            $scope.id = Math.random() * 1000;
            
            var wordObj = $scope.data;
            for (var i = 0; i < wordObj.means.length; i++) {
                var kind = wordObj.means[i].kind;
                if (kind != null && kind != '') {
                    var kinds = [];
                    if (kind.indexOf(',') != -1) {
                        kinds = kind.split(',');
                        for (var j = 0; j < kinds.length; j++) {
                            kinds[j] = kinds[j].trim();
                        }
                    } else {
                        kinds.push(kind);
                    }
                    
                    for (var j = 0; j < kinds.length; j++) {
                        var conjugationVerb = dictUtilSer.getConjugationTableOfVerb(wordObj.word, wordObj.phonetic, kinds[j]);
                        
                        if (conjugationVerb != null) {
                            $scope.conjugationVerb = conjugationVerb;
                            break;
                        }
                    }
                }
                
                if ($scope.conjugationVerb != null) {
                    break;
                }
            }

            $scope.setQueryType = function (query, type) {
                $rootScope.$broadcast("setQueryType", {query: query, type: type});
            }
            
            var audioUrl = baseAudioUrl + dictUtilSer.convertJptoHex($scope.data.word).toUpperCase() + ".mp3";
            $scope.sound = ngAudio.load(audioUrl);
            $scope.playAudio = function () {
                $scope.sound.play();
            };
            
            var word = $scope.data.word;
            if (dictUtilSer.isJapanese(word)) {
                $scope.amHanViet = dictUtilSer.getHVOfKey(word);
            }
            
            // group kind
            $scope.data.kinds = {};
            $scope.data.noKinds = [];
            for (var i = 0; i < $scope.data.means.length; i++) {
                var mean = $scope.data.means[i];
                if (mean.kind != null && mean.kind != '') {
                    if ($scope.data.kinds[mean.kind] == null) {
                        $scope.data.kinds[mean.kind] = [];
                    }
                    
                    $scope.data.kinds[mean.kind].push(mean);
                } else {
                    $scope.data.noKinds.push(mean);
                }
            }
            
            $scope.convertKindToReadable = function (abr) {
                if (abr == null || abr == "")
                    return "";
                
                return dictUtilSer.convertKindToReadable(abr);
            }
            
            $scope.capitaliseFirstLetter = function (str) {
                return dictUtilSer.capitaliseFirstLetter(str);
            }
            
            $scope.getCategoryEn = function () {
                var category = $scope.aux.category;
                
                
                return dictUtilSer.getLevelOfCategory(category);
            }
            
            $scope.showVerbConjugtion = function () {
                
            }
        }]
    }
})
