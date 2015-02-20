var Q = require('q');

var Image = module.exports = function(file){
    this.file = file;
    Object.keys(this.file).forEach( function(key){
        this[key] = file[key];
    }.bind(this) );
};

Image.prototype.load = function(){
    var deferred = Q.defer();

    var reader = new FileReader();

    reader.onload = function(ev){
        this.dataUrl = ev.target.result;
        deferred.resolve(this);
    }.bind(this);

    reader.onerror = function(ev){
        deferred.reject( {message: 'can\'t load image: ' + this.name } );
    }.bind(this);

    reader.readAsDataURL(this.file);

    return deferred.promise;
};
