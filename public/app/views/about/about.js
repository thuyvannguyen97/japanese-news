'use strict';

angular.module('mazii')

.controller('AboutController', ['$rootScope', 'dictUtilSer', function ($rootScope, dictUtilSer) {

	$rootScope.title = 'About Mazii';

	dictUtilSer.showTitlePage();
	sendGA('pageview', 'about');
    
}]);