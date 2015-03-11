//promised Templating engine 
var Q = require('q');
var loader = require('./loader');

//caching the regExp
var cacheRegExp = {};

var Templator = module.exports = {
    init: function(views){
        loader.init(views);
    },
    render: function(url, data){
        data = data || {};
        
        return loader.load(url)
            .then( function(html){
                return Templator.supplant(html, data);
            });
    },
    renderQueue: function(url, queue){
        var promises = [];
        queue.forEach(function(data){
            promises.push(Templator.render(url, data));
        });
        return Q.all(promises).then(function(res){
            return res.join('');
        });
    },
    supplant: function(html, data){
        Object.keys(data).forEach(function(key){
            var regExp = cacheRegExp[key] || new RegExp('\{\{' + key + '\}\}', 'g');
            cacheRegExp[key] = regExp;
            html = html.replace(regExp, data[key]);
        });
        return html;
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
