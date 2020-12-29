var SERVER_ERROR_CODE = 302;
var SERVER_SUCCESS_CODE = 200;
var baseUrlApi = 'http://easyjapanese.net/';

var maziiServ = angular.module('mazii.service.search', []);

maziiServ.factory('maziiServ', ["$rootScope", "$q", "$http", "$timeout", "$stateParams", "$state", function($rootScope, $q, $http, $timeout, $stateParams, $state) {
    
    var query_word_url = baseUrlApi + "api/word/";
    // var query_example_url = baseUrlApi + "api/example/";
    var query_kanji_url = baseUrlApi + "api/kanji/";
    // var query_grammar_url = baseUrl + "api/refer/";
    // var query_grammar_detail_url = baseUrl + "api/grammar/";

    var get_head_news_url = baseUrlApi + "api/news/"
    var get_detail_news_url = baseUrlApi + "api/news/"
    
    var google_translate_url = baseUrlApi + "api/gsearch/";
    
    // var query_grammar_jlpt_url = baseUrl + "api/jlptgrammar/";
    // var query_kanji_jlpt_url = baseUrlApi + "api/jlpt/";
    
    var alt_log_url = "http://alt.mazii.net/ene/log"
    
    var requestCaches = {};
    
    var service = {};
    
    service.search = function (type, query) {
        var url = "";
        if (type == "word") {
            url = query_word_url + query;
        } else if (type == "example") {
            url = query_example_url + query;
        } else if (type == "kanji") {
            url = query_kanji_url + query;
        } else if (type == "grammar") {
            url = query_grammar_url + query;
        }　else if (type == "grammar_detail") {
            url = query_grammar_detail_url + query;
        }
        
        var deferred = $q.defer();
        
        if (requestCaches[url] != null) {
            deferred.resolve(requestCaches[url]);
            return deferred.promise;
        }
        
        $http.get(url)
        .success(function (data, status, headers, config) {
            requestCaches[url] = data;
            deferred.resolve(data);
        })
        .error(function (data, status, headers, config) {
            deferred.reject(status);
        });
        
        return deferred.promise;
    };    
    
    service.googleTranslate = function (query, from, to) {
        
        var url = google_translate_url + query + "/" + from + "/" + to;
        var deferred = $q.defer();
        if (requestCaches[url] != null) {
            deferred.resolve(requestCaches[url]);
            return deferred.promise;
        }
        
        $http.get(url)
        .success(function (data, status, headers, config) {
            if (data != null && data.status == SERVER_SUCCESS_CODE) {
                var gt = JSON.parse(data.data);
                if (gt != null) {
                    requestCaches[url] = gt;
                    deferred.resolve(gt);
                } else {
                    deferred.resolve(null);
                }
            } else {
                deferred.resolve(null);
            }
            
        })
        .error(function (data, status, headers, config) {
            deferred.reject(null);
        });
        
        return deferred.promise;
    }
    
    service.getHeadNews = function (page) {
        
        if (page == null) {
            page = 1;
        }
        
        var deferred = $q.defer();
        var url = get_head_news_url + page + "/10";
        if (requestCaches[url] != null) {
            deferred.resolve(requestCaches[url]);
            return deferred.promise;
        }
        
        
        $http.get(url)
        .success(function (data, status, headers, config) {
            requestCaches[url] = data.results;
            deferred.resolve(data.results);
        })
        .error(function (data, status, headers, config) {
            deferred.reject(null);
        });
        
        return deferred.promise;
    };
    
    service.getDetailNews = function (newsId) {
        
        var url = get_detail_news_url + newsId;
        var deferred = $q.defer();
        
        if (requestCaches[url] != null) {
            deferred.resolve(requestCaches[url]);
            return deferred.promise;
        }
        
        $http.get(url)
        .success(function (data, status, headers, config) {
            requestCaches[url] = data.result;
            deferred.resolve(data.result);
        })
        .error(function (data, status, headers, config) {
            deferred.reject(null);
        });
        
        return deferred.promise;
    }
    
    
    service.queryGrammarJLPT = function (level, page) {
        var url = query_grammar_jlpt_url + level + "/30/" + page;
        
        var deferred = $q.defer();
        
        if (requestCaches[url] != null) {
            deferred.resolve(requestCaches[url]);
            return deferred.promise;
        }
        
        $http.get(url)
        .success(function (data, status, headers, config) {
            if (data.status == SERVER_ERROR_CODE) {
                deferred.resolve(null);
            } else {
                requestCaches[url] = data;
                deferred.resolve(data);
            }
            
        })
        .error(function (data, status, headers, config) {
            deferred.reject(null);
        });
        
        return deferred.promise;
    }
    
    service.queryKanjiJLPT = function (level, page) {
        var url = query_kanji_jlpt_url + level + '/' + page;
        
        var deferred = $q.defer();
        
        if (requestCaches[url] != null) {
            deferred.resolve(requestCaches[url]);
            return deferred.promise;
        }
        
        $http.post(url)
        .success(function (data, status, headers, config) {
            if (data.status == SERVER_ERROR_CODE) {
                deferred.resolve(null);
            } else {
                requestCaches[url] = data;
                
                deferred.resolve(data);
            }
            
        })
        .error(function (data, status, headers, config) {
            deferred.reject(null);
        });
        
        return deferred.promise;
    }
    
    var sendRequest = function (method, url, data, callback) {
        var request = new XMLHttpRequest();

        request.open(method, url);

        request.setRequestHeader('Content-Type', 'application/json');

        request.onreadystatechange = function () {
          if (this.readyState === 4) {
            if (this.responseText != null && callback != null) {
                callback(JSON.parse(this.responseText));
            }
          }
        };

        if (data != null) {
            request.send(JSON.stringify(data));
        } else {
            request.send();
        }
    }
    
    service.sendAltLog = function (entityId) {
        var data = { "entity_id": entityId };
       sendRequest("POST", alt_log_url, data);
    }
    
    service.sendAltNewsLog = function (newsId) {
        var data = { "news_id": newsId };
        var url = "http://alt.mazii.net/ene/news_log";
        sendRequest("POST", url, data);
        
    }
    service.sendFeedback = function(entity_id, old_category_id, new_category_id, correct, sentence, callback){
        var url = "http://alt.mazii.net/ene/feedback";
        var data = {
            "entity_id"        : entity_id,
            "old_category_id"  : old_category_id,
            "new_category_id"  : new_category_id,
            "correct"          : correct,
            "sentence"         : sentence
        }
        sendRequest("POST", url, data);
    };
    return service;
}])
