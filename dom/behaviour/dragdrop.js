//add drag and drop behaviour to elements in a container
var isChildOf = require('../utils/is-child-of');

var container, targets, elements, releaseCallback, useClone;
var isMouseDown, draggableObject, position, startX, startY;

var maxZ = 1000;

module.exports = function(options){
    container = options.container || document.body;
    elements = options.elements || [ options.element ];
    releaseCallback = options.releaseCallback || function(){};
    useClone = typeof options.useClone === 'boolean'? options.useClone : false;

    targets = Array.prototype.slice.call( elements );

    container.addEventListener('mousedown', handleMouseDown);
}

document.body.addEventListener('mouseup', handleMouseUp);
document.body.addEventListener('mouseleave', handleMouseUp);
document.body.addEventListener('mousemove', handleMouseMove);

function handleMouseDown(ev){
    isMouseDown = true;
    draggableObject = getDraggableObject(ev);
    if(draggableObject){
        width = draggableObject.offsetWidth;
        height = draggableObject.offsetHeight;
        position = getOffset(draggableObject);
        draggableObject = useClone? draggableObject.cloneNode(true) : draggableObject;
        draggableObject.style.position = 'absolute';
        draggableObject.style.width = width + 'px';
        draggableObject.style.height = height + 'px';
        startX = ev.x;
        startY = ev.y;
    }
};

function handleMouseMove(ev){
    if(draggableObject && isMouseDown){
        ev.preventDefault();
        
        draggableObject.style.zIndex = maxZ++;
        draggableObject.style.width = width + 'px';
        draggableObject.style.height = height + 'px';
        if( useClone && !draggableObject.parentNode ){
            document.body.appendChild(draggableObject);
        }
        
        var deltaX = ev.x - startX;
        var deltaY = ev.y - startY;
        draggableObject.style.marginLeft = (position.left + deltaX) + 'px';
        draggableObject.style.marginTop = (position.top + deltaY) + 'px';
    }
};

function handleMouseUp(ev){
    ev.preventDefault();
    if(!draggableObject){
        return;
    }
    if(useClone){
        draggableObject.parentNode.removeChild(draggableObject);
    }
    typeof releaseCallback === 'function' && releaseCallback(draggableObject, this, ev);
    draggableObject = null;
    isMouseDown = false;
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

function getOffset(elem){
    var offsetLeft = 0;
    var offsetTop = 0;
    do {
        if( !isNaN(elem.offsetLeft) && !isNaN(elem.offsetTop) ){
            offsetLeft += elem.offsetLeft;
            offsetTop += elem.offsetTop;
        }
    } while ( elem = elem.offsetParent );

    return { left: offsetLeft, top: offsetTop };
}
