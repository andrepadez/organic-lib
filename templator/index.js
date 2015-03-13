//promised Templating engine 
var Q = require('q');
var swig = require('swig');
var loader = require('./loader');

var Templator = module.exports = {
    init: function(views){
        loader.init(views);
    },

    render: function(url, locals, wrapper, before){
        return this.getTemplate(url)
            .then( function(template){
                return this.parse(template, locals);
            }.bind(this) )
            .then( function(html){
                return this.inject(wrapper, html)
            }.bind(this) );
    },

    getTemplate: function(url){
        return loader.load(url);
    },

    parse: function(template, locals){
        return swig.render(template, { locals: locals });
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
