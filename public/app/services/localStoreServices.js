'use strict';

var localstoreSerive = angular.module('mazii.service.localstore', []);

localstoreSerive.factory('localstoreServ', [
    function() {

        var service = {};

        service.setItem = function (key, value) {
            localStorage.setItem(key, angular.toJson(value))
        };

        service.getItem = function (key) {
            var result = localStorage.getItem(key);
            return angular.fromJson(result);
        };

        service.deleteItem = function (key) {
            localStorage.removeItem(key);
        };

        service.clear = function () {
            localStorage.clear();
        };

        return service;

    }]);