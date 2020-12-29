angular.module('mazii')


.directive('ngSynonyms', function () {
    return {
        restrict: 'E',
        scope: {
            data: '=data'
        },
        templateUrl: module.root + 'template/synonyms/synonyms-template.php',
        controller: ["$rootScope", "$scope", "$http", "dictUtilSer", function ($rootScope, $scope, $http, dictUtilSer) {
            
            $scope.searchThis = function (query) {
                $rootScope.$broadcast("query", { type: "word", query: query, tag: "quick-search" });
            }
            
        }]
    }
});