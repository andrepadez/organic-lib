var targets, releaseCallback;
var draggingElement, draggingClone, width, height;

module.exports = function(container, selector, cb){
    releaseCallback = cb;
    targets = Array.prototype.slice.call( container.querySelectorAll(selector) );

    container.addEventListener('mousedown', handleMouseDown);
    document.body.addEventListener('mousemove', handleMouseMove);
    document.body.addEventListener('mouseup', handleMouseUp);
}

var handleMouseDown = function(ev){
    if(targets.indexOf(ev.target) > 0 && ev.ctrlKey === false){
        ev.preventDefault();
        draggingElement = ev.target;
        width = draggingElement.offsetWidth;
        height = draggingElement.offsetHeight;
    }
};

var handleMouseMove = function(ev){
    if(draggingElement){
        if(!draggingClone){
            draggingClone = draggingElement.cloneNode();
            draggingClone.style.position = 'absolute';
            draggingClone.style.zIndex = 99999999;
            draggingClone.style.width = width + 'px';
            draggingClone.style.height = height + 'px';
            document.body.insertBefore(draggingClone, document.body.firstChild);
        }
        draggingClone.style.marginLeft = (ev.x - width/2) + 'px';
        draggingClone.style.marginTop = (ev.y - height/2) + 'px';
    };
};

var handleMouseUp = function(ev){
    document.body.removeChild(draggingClone);
    releaseCallback(draggingElement, this, ev);
    draggingElement = null;
    draggingClone = null;
};

//[TODO] - allow for children of target to be drag handlers
