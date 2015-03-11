var Q = require('q');
var ajax = require('../ajax');

var Loader = module.exports = {
    init: function(views){
        this.views = views;
    },
    load: function(url){
        var deferred = Q.defer();
        if( Loader.views ){
            deferred.resolve( loadFromJSON(url) );
        } else {
            return ajax.get(url);
        }

        return deferred.promise;
    }
};

var loadFromJSON = function(url){
    path = url.split('/');
    var template = Loader.views;
    Object.keys(path).forEach(function(key){
        if(key !== "0" || path[key] !== 'views'){
            template = template[ path[key] ];
            if(!template){
                throw Error('view not found in views.json ' + url);
            }
        }
    });
    return template;
}; 
