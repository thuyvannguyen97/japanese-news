angular.module('mazii')


.directive('ngGoogleTranslate', function () {
    return {
        restrict: 'E',
        scope: {
            data: '=data',
            aux: '=aux'
        },
        templateUrl: module.root + 'template/google-translate/google-translate-template.php',
        controller: ["$rootScope", "$scope", "$http", "dictUtilSer", function ($rootScope, $scope, $http, dictUtilSer) {
            $scope.getCategoryEn = function () {
                if($scope.aux){
                    var category = $scope.aux.category;
                    return dictUtilSer.getLevelOfCategory(category);
                }
            }
        }]
    }
});
