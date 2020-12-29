'use strict';

angular.module('mazii')

.controller('NoteController', ["$rootScope", "$scope", "$state", "$timeout", "noteServ","$stateParams", "$location", "dictUtilSer", function($rootScope, $scope, $state, $timeout, noteServ, $stateParams, $location, dictUtilSer) {

    $scope.category = noteServ.getCategory();
    $scope.state = false;
    $scope.activeItem = null;
    $rootScope.title = 'My word';

    $scope.getNoteItem = function (cate) {
        $('.note-item').removeClass('seleted-note');
        $rootScope.$broadcast("getNoteItem", {cate: cate});
    }


    $scope.showEdit = function () {
        $('.category-delete').toggleClass('hidden-note-delete');
    }

    $scope.deleteCategory = function (cate) {
        noteServ.removeCategory(cate);
    }

    $scope.getTime = function (date) {
        var time = new Date(date);
        return time.toDateString();
    }
    $scope.getDeleteState = function () {
        if($scope.state){
            return '';
        }else{
            return 'hidden-note-delete';
        }
    }

    $scope.showEdit = function () {
        if($scope.state == false){
            $scope.state = true;
        }else{
            $scope.state = false;
        }
    }

    dictUtilSer.showTitlePage();

    sendGA('pageview', 'myword');
}]);
