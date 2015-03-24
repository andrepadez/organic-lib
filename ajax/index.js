// promised library for Ajax requests
var Q = require('q');

var Ajax = module.exports = {

    get: function(url){
        var deferred = Q.defer();

        var xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        xhr.onload = xhrOnloadHandler.bind(xhr, deferred);
        xhr.send();

        return deferred.promise;
    },
    getJSON: function(url){
        return Ajax.get(url).then(JSON.parse);
    }, 

    post: function(url, payload){
        var deferred = Q.defer();

        var formData = new FormData();
        Object.keys(payload).forEach(function(key){
            formData.append( key, payload[key] );
        });

        var xhr = new XMLHttpRequest();
        xhr.open('POST', url, true);
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhr.onload = xhrOnloadHandler.bind(xhr, deferred);
        xhr.send( JSON.stringify(payload) );

        return deferred.promise;
    }
};

var xhrOnloadHandler = function(deferred, ev){
    if(this.status < 400){
        deferred.resolve(this.responseText);    
    } else {
        deferred.reject({
            status: this.status,
            message: this.responseText
        });
    }
};
