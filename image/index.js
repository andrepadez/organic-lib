var Q = require('q');

var Image = function(file){
    this.file = file;
    this.image = window.Image();
    Object.keys(this.file).forEach( function(key){
        this[key] = file[key];
    }.bind(this) );
};

Image.prototype.constructor = Image;
module.exports = Image;

Image.prototype.load = function(){
    var deferred = Q.defer();

    var reader = new FileReader();

    reader.onload = function(ev){
        this.dataUrl = ev.target.result;
        this.image.onload = function(){
            deferred.resolve(this);
        }.bind(this);
        this.image.src = this.dataUrl;
    }.bind(this);

    reader.onerror = function(ev){
        deferred.reject( {message: 'can\'t load image: ' + this.name } );
    }.bind(this);

    reader.readAsDataURL(this.file);

    return deferred.promise;
};
