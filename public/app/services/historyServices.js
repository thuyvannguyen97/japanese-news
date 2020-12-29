var maziiServ = angular.module('mazii.service.history', []);

maziiServ.factory('historyServ', ["$rootScope", "$q", "$http", "$timeout", "$stateParams", "$state", function($rootScope, $q, $http, $timeout, $stateParams, $state) {
    
    var service = {};
    var history = null;
    
    function get() {
        if (history != null)
            return history;
        
        var historyJson = localStorage.getItem("history");
        history = JSON.parse(historyJson);
        
        if (history == null) {
            history = [];
        }
        
        return history;
    }
    
    function save() {
        var historyJson = JSON.stringify(history);
        localStorage.setItem("history", historyJson);
    }
    
    service.get = function () {
        if (history == null) get();
        
        return history;
    }
    
    service.push = function (query, type) {
        
        if (query == null || query == "")
            return;
        
        if (history == null) get();
        
        // check exist
        var indexExist = -1;
        for (var i = 0; i < history.length; i++) {
            if (history[i].query == query && history[i].type == type) {
                indexExist = i;
                break;
            }
        }
        
        if (indexExist != -1) {
            history.splice(indexExist, 1);
        }
        
        var index = 0;
        if (history.length != 0) {
            index = history[history.length - 1].id + 1;
        }
        
        var newObj = {};
        newObj.date = new Date();
        newObj.query = query;
        newObj.type = type;
        newObj.id = index;
        
        history.push(newObj);
        save();
    }
    
    service.remove = function (id) {

        var index = -1;
        
        for (var i = 0; i < history.length; i++) {
            if (history[i].id == id) {
                index = i;
                break;
            }
        }
        
        if (index != -1) {
            history.splice(index, 1);
        }
        
        save();
    }
    
    service.clear = function () {
        history = [];
        save();
    }
    
    return service;
    
}]);