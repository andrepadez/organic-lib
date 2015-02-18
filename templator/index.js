//promised Templating engine 
var Q = require('q');
var ajax = require('../ajax');

var cache = { regExp: {}, templates: {} };

var Templator = module.exports = {
    init: function(views){
        this.views = views;
    },
    render: function(url, data){
        data = data || {};
        var deferred = Q.defer();
        if(this.views){
            path = url.split('/');
            var template = this.views;
            Object.keys(path).forEach(function(key){
                if(key !== "0" || path[key] !== 'views'){
                    template = template[ path[key] ];
                    if(!template){
                        deferred.reject(Error('view not found in views.json ' + url));
                    }
                }
            });
            var html =  Templator.supplant(template, data);
            deferred.resolve(html);
        } else {
            ajax.get(url)
                .then(function(res){
                    cache.templates[url] = res;
                    var supplanted = Templator.supplant(res, data);
                    deferred.resolve(supplanted);
                }, function(err){
                    deferred.reject(err);
                });
        }

        return deferred.promise;
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
            var regExp = cache[key] || new RegExp('\{\{' + key + '\}\}', 'g');
            cache[key] = regExp;
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
