//add drag and drop behaviour to elements in a container
var isChildOf = require('../utils/is-child-of');

var container, targets, elements, releaseCallback, useClone;
var isMouseDown, draggableObject, positionX, positionY, startX, startY;

var maxZ = 1000;

module.exports = function(options){
    container = options.container || document.body;
    elements = options.elements || [ options.element ];
    releaseCallback = options.releaseCallback || function(){};
    useClone = typeof options.useClone === 'boolean'? options.useClone : false;

    targets = Array.prototype.slice.call( elements );

    container.addEventListener('mousedown', handleMouseDown);
}

document.body.addEventListener('mousemove', handleMouseMove);
document.body.addEventListener('mouseleave', handleMouseUp);
document.body.addEventListener('mouseup', handleMouseUp);

var handleMouseDown = function(ev){
    isMouseDown = true;
    draggableObject = getDraggableObject(ev);
    draggableObject = useClone? draggableObject.clone(true) : draggableObject;
    if(draggableObject){
        positionX = draggableObject.offsetLeft;
        positionY = draggableObject.offsetTop;
        startX = ev.x;
        startY = ev.y;
        width = draggableObject.offsetWidth;
        height = draggableObject.offsetHeight;
    }
};

function handleMouseMove(ev){
    if(draggableObject && isMouseDown){
        ev.preventDefault();
        draggableObject.style.position = 'absolute';
        draggableObject.style.zIndex = maxZ++;
        draggableObject.style.width = width + 'px';
        draggableObject.style.height = height + 'px';
        document.body.insertBefore(draggableObject, document.body.firstChild);
        
        var deltaX = ev.x - startX;
        var deltaY = ev.y - startY;
        draggableObject.style.marginLeft = (positionX + deltaX) + 'px';
        draggableObject.style.marginTop = (positionY + deltaY) + 'px';
    }
};

function handleMouseUp(ev){
    ev.preventDefault();
    if(!draggableObject){
        return;
    }
    if(useClone){
        document.body.removeChild(draggingClone);
    }
    typeof releaseCallback === 'function' && releaseCallback(draggableObject, this, ev);
    draggableObject = null;
};

function getDraggableObject(ev){
    if(ev.ctrlKey){
        return false;
    }
    var dragObject = null;
    targets.forEach(function(target){
        var nodeName = ev.target.nodeName.toLowerCase();
        if( nodeName !== 'input' && nodeName !== 'button' && isChildOf(ev.target, target) ){
            dragObject = target;
        }
    });
    return dragObject;
};
