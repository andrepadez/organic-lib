//promised Templating engine 
var Q = require('q');
var swig = require('swig');
var loader = require('./loader');
var parser = require('./parser');

//caching the regExp
var cacheRegExp = {};

var Templator = module.exports = {
    init: function(views){
        loader.init(views);
    },
    render: function(url, data){
        data = data || {};
        
        return loader.load(url)
            .then( function(template){
                console.log('data', data);
                return swig.render(template, { locals: data });
            } );
    },
    
    inject: function(wrapper, html){
        var deferred = Q.defer();
        var div = document.createElement('div');
        div.innerHTML = html;
        children = Array.prototype.slice.call(div.children);
        requestAnimationFrame(function(){
            children.forEach(function(child){
                wrapper.appendChild(child);
            });
            deferred.resolve();
        });
        return deferred.promise;
    }
};
