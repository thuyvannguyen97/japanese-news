angular.module('mazii')

.directive('ngKanjiResultSearchWord', function () {
    return {
        restrict: 'E',
        templateUrl: module.root + 'template/kanji-result-search-word/kanji-result-search-word-template.php',
        scope: {
            data: '=data'
        },
        controller: ["$rootScope", "$scope", "$http", "dictUtilSer", function ($rootScope, $scope, $http, dictUtilSer) {
            $scope.collapse = false;
            
            $scope.getDetails = function () {
                $scope.mean = dictUtilSer.convertNice($scope.data.mean);
               // $scope.mean = $scope.mean.replace(",", " , ");
                return $scope.mean;
            }

            $scope.search = function (query) {
                $rootScope.$broadcast("searchKanji", query);
            }

            $scope.viewDetail = function (query) {
                $rootScope.$broadcast("searchKanji", query);   
            }

            // Thay ký tự | thành ,
            $scope.convertNice = function (str) {
                return dictUtilSer.convertNice(str);
            }

            $scope.convertBoKanji = function (str) {
                return dictUtilSer.convertBoKanji(str);
            }
        }]
    }
})
