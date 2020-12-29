angular.module('mazii')


.directive('ngHistory', function () {
    return {
        restrict: 'E',
        templateUrl: module.root + 'template/history/history-template.php',
        controller: ["$rootScope", "$scope", "$http", "historyServ", "$state", "localstoreServ", "dictUtilSer",
         function ($rootScope, $scope, $http, historyServ, $state, localstoreServ, dictUtilSer) {
            
            $scope.history = historyServ.get();
            $scope.search = function (type, query) {
                dictUtilSer.closePanel();
                $rootScope.$broadcast("query", { type: type, query: query, tag: "quick-search" });
            }

            $scope.getTime = function (date) {
                var time = new Date(date);
                return time.toDateString();
            }

            $scope.deleteHistory = function () {
                localstoreServ.deleteItem('history');
                $scope.history = historyServ.get();
                $('#confirmDeleteHistoryModal').modal('show');
            }

            $scope.hideHistory = function () {
                dictUtilSer.closePanel();
            }

            $('.deleteHistory').click(function () {
                historyServ.clear();
                $scope.history = historyServ.get();
                dictUtilSer.closePanel();
                $('#confirmDeleteHistoryModal').modal('hide');
            })
        }]
    }
})