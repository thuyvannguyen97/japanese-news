'use strict';

angular.module('mazii')

.controller('TermController', ["$rootScope", function($rootScope) {
    $rootScope.title = 'My word';

    sendGA('pageview', 'term');
}]);
