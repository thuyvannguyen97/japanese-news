'use strict';

angular.module('mazii')

.controller('HeaderController', ["$rootScope", "$scope", "$state", "$timeout", "maziiServ", "dictUtilSer", "historyServ", function($rootScope, $scope, $state, $timeout, maziiServ, dictUtilSer, historyServ) {

	$scope.showMenuLeft = function () {
      	$('.menu-left').addClass('open-menu-left');
      	$('.cover').css('display', 'block');
	}

	$scope.closePanel = function () {
	    dictUtilSer.closePanel();
	}

	$scope.showHistory = function () {
		$('.history-panel').addClass('open-history-panel');
		$('.cover').css('display', 'block');
		$('body').css('overflow', 'hidden');
	}

	$scope.showSetting = function () {
		$('.setting-panel').addClass('open-setting-panel');
		$('.cover').css('display', 'block');
		$('body').css('overflow', 'hidden');
	}

	$scope.convertNice = function (str) {
        return dictUtilSer.convertNice(str);
    }

	}]);