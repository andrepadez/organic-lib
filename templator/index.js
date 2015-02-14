var Q = require('q');
var ajax = require('../ajax');

var cache = { regExp: {}, templates: {} };

var Templator = module.exports = {
    render: function(url, data){
        data = data || {};
        var deferred = Q.defer();
        ajax.get(url).then(function(res){
            cache.templates[url] = res;
            var supplanted = Templator.supplant(res, data);
            deferred.resolve(supplanted);
        }, function(err){
            deferred.reject(err);
        });
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
        var div = document.createElement('div');
        div.innerHTML = html;
        children = Array.prototype.slice.call(div.children);
        children.forEach(function(child){
            wrapper.appendChild(child);
        });
    }
};
