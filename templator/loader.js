var Q = require('q');
var ajax = require('../ajax');

var Loader = module.exports = {
    init: function(views){
        this.views = views;
    },
    load: function(url){
        if( Loader.views ){
            return loadFromJSON(url);
        } else {
            return ajax.get(url);
        }

        
    }
};

var loadFromJSON = function(url){
    var deferred = Q.defer();
    path = url.split('/');
    var template = Loader.views;
    Object.keys(path).forEach(function(key){
        if(key !== "0" || path[key] !== 'views'){
            template = template[ path[key] ];
            if(!template){
                deferred.reject( Error('view not found in views.json ' + url) );
            }
        }
    });
    deferred.resolve( template );
    return deferred.promise;
}; 
