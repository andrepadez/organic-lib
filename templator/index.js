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
        if(url.indexOf('views/') === -1){
            url = 'views/'+url;
        }
        return loader.load(url);
    },

    parse: function(template, locals){
        var html = swig.render(template, { 
            locals: locals,
            autoescape: false
        });
        return html;
    },
    
    inject: function(wrapper, html){
        var deferred = Q.defer();
        (function(container, html){
            var frag = document.createElement('div');
            frag.innerHTML = html;
            children = Array.prototype.slice.call(frag.children);
            requestAnimationFrame(function(){
                children.forEach(function(child){
                    wrapper.appendChild(child);
                });
                deferred.resolve();
            });    
        })(wrapper, html);
        
        return deferred.promise;
    }, 

    empty: function(container){
        var deferred = Q.defer();
        if(!container || !container.nodeName){
            deferred.reject( Error("container must be a DOM element") );
        } else {
            requestAnimationFrame(function(){
                container.innerHTML = '';
                deferred.resolve();
            });
        }
        return deferred.promise;
    }
};