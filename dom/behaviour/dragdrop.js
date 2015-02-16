var isChildOf = require('../utils/is-child-of');

//add drag and drop behaviour to elements in a container
var targets, releaseCallback, useClone;
var draggingElement, draggingClone, width, height;

module.exports = function(container, elements, cb, clone){
    targets = Array.prototype.slice.call( elements );
    releaseCallback = cb;
    useClone = clone;

    container.addEventListener('mousedown', handleMouseDown);
}

var handleMouseDown = function(ev){
    document.body.addEventListener('mousemove', handleMouseMove);
    var target = shouldDrag(ev);
    if(target){
        ev.preventDefault();
        draggingElement = target;
        width = draggingElement.offsetWidth;
        height = draggingElement.offsetHeight;
    }
};

var eventsAdded = false;
var handleMouseMove = function(ev){
    if(!eventsAdded){
        document.body.addEventListener('mouseup', handleMouseUp);
        document.body.addEventListener('mouseleave', handleMouseUp);
        eventsAdded = true;
    }
    if(draggingElement){
        if(!draggingClone){
            draggingClone = useClone? draggingElement.cloneNode(true) : draggingElement;
            draggingClone.style.position = 'absolute';
            draggingClone.style.zIndex = 99999999;
            draggingClone.style.width = width + 'px';
            draggingClone.style.height = height + 'px';
            document.body.insertBefore(draggingClone, document.body.firstChild);
        }
        draggingClone.style.marginLeft = (ev.x - width/2) + 'px';
        draggingClone.style.marginTop = (ev.y - height/2) + 'px';
    }
};

var handleMouseUp = function(ev){
    if(draggingClone){
        if(useClone){
            document.body.removeChild(draggingClone);
        }
    }
    typeof releaseCallback === 'function' && releaseCallback(draggingElement, this, ev);
    draggingElement = null;
    draggingClone = null;
    eventsAdded = false;
    document.body.removeEventListener('mousemove', handleMouseMove);
    document.body.removeEventListener('mouseup', handleMouseUp);
    document.body.removeEventListener('mouseleave', handleMouseUp);
};

var shouldDrag = function(ev){
    if(ev.ctrlKey){
        return false;
    }
    var dragObject = null;
    targets.forEach(function(target){
        if( isChildOf(ev.target, target) ){
            dragObject = target;
        }
    });
    return dragObject;
};


