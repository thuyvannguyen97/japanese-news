var maziiServ = angular.module('mazii.service.note', []);

maziiServ.factory('noteServ', ["$rootScope", "$q", "$http", "$timeout", "$stateParams", "$state", function($rootScope, $q, $http, $timeout, $stateParams, $state) {
    
    var service = {};
    var note = null;
    var categoryNote = null;
    var grammar = null;
    
    function getCategory() {
        if (categoryNote != null)
            return categoryNote;
        var categoryJson = localStorage.getItem("categoryNote");
        categoryNote = JSON.parse(categoryJson);
        
        if (categoryNote == null) {
            categoryNote = [];
        }
        return categoryNote;
    }

    function getGrammar () {
        if (grammar != null)
            return grammar;
        var grammarJson = localStorage.getItem("grammar");
        grammar = JSON.parse(grammarJson);
        
        if (grammar == null) {
            grammar = [];
        }
        return grammar;
    }

    function getNote() {
        if (note != null)
            return note;
        var noteJson = localStorage.getItem("note");
        note = JSON.parse(noteJson);
        
        if (note == null) {
            note = [];
        }
        
        return note;
    }
    
    function saveNote() {
        var noteJson = JSON.stringify(note);
        localStorage.setItem("note", noteJson);
    }
    function saveCategory() {
        var categoryJson = JSON.stringify(categoryNote);
        localStorage.setItem("categoryNote", categoryJson);
    }

    function saveGrammar() {
        var grammarJson = JSON.stringify(grammar);
        localStorage.setItem("grammar", grammarJson);
    }
    
    service.getNoteItem = function (cate) {
        var temp = [];
        if (note == null) getNote();
        for (var i = 0; i < note.length; i++) {
            if (note[i].category == cate) {
                temp.push(note[i]);
            }
        }
        if (grammar == null) getGrammar();
        for (var i = 0; i < grammar.length; i++) {
            if (grammar[i].category == cate) {
                temp.push(grammar[i]);
            }
        }
        return temp;
    }

    service.getCategory = function () {
        if (categoryNote == null) getCategory();        
        return categoryNote;
    }

    service.pushCategory = function (cate) {
        
        if(cate == null || cate == "")
            return;
        
        if (categoryNote == null) getCategory();
        
        // check exist
        var indexExist = -1;
        for (var i = 0; i < categoryNote.length; i++) {
            if (categoryNote[i].category == cate) {
                indexExist = i;
                break;
            }
        }
        
        if (indexExist != -1) {
            categoryNote.splice(indexExist, 1);
        }
        
        var index = 0;
        if (categoryNote.length != 0) {
            index = categoryNote[categoryNote.length - 1].id + 1;
        }
        
        var newObj = {};
        newObj.category = cate;
        newObj.date = new Date();

        categoryNote.push(newObj);
        saveCategory();
    }

    service.pushGrammar = function (cate, query, type, idx) {
        
        if(cate == null || cate == "")
            return;
        if (query == null || query == "")
            return;
        
        if (grammar == null) getGrammar();
        
        // check exist
        var indexExist = -1;
        if (grammar.length > 0) {
            for (var i = 0; i < grammar.length; i++) {
                if (grammar[i].category == cate && grammar[i].idx == idx) {
                    indexExist = i;
                    break;
                }
            }
        };
        
        if (indexExist != -1) {
            grammar.splice(indexExist, 1);
        }

        var index = 0;
        if (grammar.length != 0) {
            index = grammar[grammar.length - 1].id + 1;
        }

        var newObj = {};
        newObj.category = cate;
        newObj.date = new Date();
        newObj.query = query;
        newObj.type = type;
        newObj.idx = idx;
        newObj.id = index;
        
        grammar.push(newObj);
        saveGrammar();
    }
    
    service.pushNote = function (cate, query, type) {
        
        if(cate == null || cate == "")
            return;
        if (query == null || query == "")
            return;
        
        if (note == null) getNote();
        
        // check exist
        var indexExist = -1;
        if (note.length > 0) {
            for (var i = 0; i < note.length; i++) {
                if (note[i].category == cate && note[i].query == query && note[i].type == type) {
                    indexExist = i;
                    break;
                }
            }
        };
        
        if (indexExist != -1) {
            note.splice(indexExist, 1);
        }
        
        var index = 0;
        if (note.length != 0) {
            index = note[note.length - 1].id + 1;
        }

        var newObj = {};
        newObj.category = cate;
        newObj.date = new Date();
        newObj.query = query;
        newObj.type = type;
        newObj.id = index;
        
        note.push(newObj);
        saveNote();
    }
    
    
    service.removeGrammar = function (id) {
        var index = -1;
        var cate = '';
        for (var i = 0; i < grammar.length; i++) {
            if (grammar[i].id == id) {
                index = i;
                cate = grammar[i].category;
                break;
            }
        }
        
        if (index != -1) {
            grammar.splice(index, 1);
        }
        
        saveGrammar();
        $rootScope.$broadcast("getNoteItem", {cate: cate});
    }

   service.removeCategory = function (cate) {
        var index = note.length;
        while(index--){
            if (note[index].category == cate) {
                note.splice(index, 1);
            }
        }
        index = grammar.length;
        while(index--){
            if (grammar[index].category == cate) {
                grammar.splice(index, 1);
            }
        }
        index = -1;
        for (var i = 0; i < categoryNote.length; i++) {
            if (categoryNote[i].category == cate) {
                index = i;
                break;
            }
        }
        if (index != -1) {
            categoryNote.splice(index, 1);
        }
        saveCategory();
        saveNote();
        saveGrammar();
        $rootScope.$broadcast("getNoteItem", {cate: ''});
    }
    service.removeNote = function (id) {

        var index = -1;
        var cate = '';
        
        for (var i = 0; i < note.length; i++) {
            if (note[i].id == id) {
                index = i;
                cate = note[i].category;
                break;
            }
        }
        
        if (index != -1) {
            note.splice(index, 1);
        }
        saveNote();
        $rootScope.$broadcast("getNoteItem", {cate: cate});
    }
    
    service.clearNote = function () {
        note = [];
        saveNote();
    }

    service.clearGrammar = function () {
        grammar = [];
        saveGrammar();
    }

    service.clearCategory = function () {
        categoryNote = [];
        saveCategory();
    }
    
    return service;
    
}]);