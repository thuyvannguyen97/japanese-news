'use strict';

angular.module('mazii')

.controller('WriteController', ["$rootScope", "$scope", "$state", "$timeout", "maziiServ", "dictUtilSer", "historyServ", "$stateParams", "$location", function($rootScope, $scope, $state, $timeout, maziiServ, dictUtilSer, historyServ, $stateParams, $location) {

	$scope.form = {};

	$scope.showDrawKanji = false;
	$rootScope.title = 'Write';

	var getDataKanji = function () {
		var query = $scope.form.kanji;
		maziiServ.search("kanji", query).then(function (data) {
            $scope.currentKanjiSelected = 0;
            if (data.status == 200) {
                if (dictUtilSer.isJapanese(query)) {
                    var kanjis = dictUtilSer.getKanjiChara(query);
                    $scope.kanjis = dictUtilSer.sortHVDataByKeyWord(kanjis, data.results);
                    $scope.data = $scope.kanjis[0];
                } else {
                    $scope.kanjis = data.results;
                    $scope.data = $scope.kanjis[0];
                }
                $scope.showDrawKanji = true;
                $scope.showResultNull = false;
                
 			} else {
 				$scope.showResultNull = true;
 			}

        });
	}

	$scope.searchKanji = function () {
		getDataKanji();
	}

    dictUtilSer.showTitlePage();

    sendGA('pageview', 'draw');


}])