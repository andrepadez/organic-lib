var Q = require('q');
var assert = require('chai').assert;
var pica = require('pica');

var OETImage = function(file){
    this.complete = false;
    this.file = file;
    this.image = new window.Image();
    Object.keys(this.file).forEach( function(key){
        this[key] = file[key];
    }.bind(this) );
};

OETImage.prototype.constructor = Image;
module.exports = OETImage;

OETImage.prototype.load = function(){
    var deferred = Q.defer();

    var reader = new FileReader();

    reader.onload = function(ev){
        this.dataUrl = ev.target.result;
        this.image.onload = function(){
            this.complete = true;
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

OETImage.prototype.getRatio = function(){
    return this.image.width / this.image.height;
};

OETImage.prototype.resizeToCanvas = function(options){
    var deferred = Q.defer();
    var targetWidth = options.targetWidth;
    var targetHeight = options.targetHeight;
    if( !(targetWidth || targetHeight) ){
        var err = Error('you have to specify a targetWidth and/or targetHeight');
        deferred.reject( err );
    }

    var render = function(){
        var originalCanvas = document.createElement('canvas');
        originalCanvas.width = this.image.width;
        originalCanvas.height = this.image.height;
        var ctx = originalCanvas.getContext('2d');
        ctx.drawImage(this.image, 0, 0, this.image.width, this.image.height);
        
        var ratio = this.getRatio();
        var resizedCanvas = document.createElement('canvas');
        resizedCanvas.width = targetWidth || targetHeight * ratio;
        resizedCanvas.height = targetHeight || targetWidth * ratio;

        var picaOptions = {
            quality: options.quality || 0,
            unsharpAmount: options.unsharpAmount || 50,
            unsharpThreshold: options.unsharpThreshold || 10
        };

        pica.resizeCanvas(originalCanvas, resizedCanvas, options, function(err){
            deferred.resolve(resizedCanvas);
        });
    }

    if(this.complete){
        render.call(this);
    } else {
        this.load().then( render.bind(this) );
    }

    return deferred.promise;
};
