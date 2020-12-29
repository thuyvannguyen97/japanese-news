angular.module('mazii')


.directive('ngGrammar', function () {
    return {
        restrict: 'E',
        templateUrl: module.root + 'template/grammar/grammar-template.php',
        scope: {
            data: '=data',
            detail: '=detail'
        },
        controller: ["$rootScope", "$scope", "$http", "dictUtilSer", "maziiServ", function ($rootScope, $scope, $http, dictUtilSer, maziiServ) {
            
            $scope.loadDetail = function () {
                if ($scope.detail != null)
                    return;
                
                maziiServ.search("grammar_detail", $scope.data._id).then(function (data) {
                   $scope.detail = data.grammar; 
                });
            }
            
            $scope.splitUtil = function (text, splitChar) {
                if (text == null || text == '')
                    return null;
                
                var notes = text.split(splitChar);
                var results = [];
                for (var i = 0; i < notes.length; i++) {
                    var note = notes[i].trim();
                    if (note != '') {
                        results.push(note);
                    }
                }
                
                return results;
            }
            
            $scope.removeJapaneseChar = function (text) {
                return dictUtilSer.removeJapaneseChar(text);
            };
            
            $scope.splitExplain = function (explain) {
                return $scope.splitUtil(explain, '☞');
            }
            
            $scope.splitNote = function (note) {
                return $scope.splitUtil(note, '☞');
            }
            
            $scope.setQueryGrammar = function (query, type, id) {
                $rootScope.$broadcast("setQueryGrammar", {query: query, type: type, id: id});
            }
            
            $scope.$watch("data", function (oldValue, newValue) {
                if ($scope.data.grammar != null) {
                    $scope.showDetailImediately = true;
                    $scope.detail = $scope.data.grammar;
                    return;
                } else {
                    $scope.showDetailImediately = false;
                }
            })
            
            if ($scope.data.grammar != null) {
                $scope.showDetailImediately = true;
                $scope.detail = $scope.data.grammar;
                return;
            } else {
                $scope.showDetailImediately = false;
            }
            
            
            var grammarTitles = $scope.data.title.split("=>");
            var titleMean = '';
            if (grammarTitles.length > 1) {
                titleMean = grammarTitles[1];
            }
            
            $scope.title = grammarTitles[0];
            $scope.titleMean = titleMean;
            $scope.id = $scope.data._id.replace(/:/g, "_");

            
        }]
    }
})