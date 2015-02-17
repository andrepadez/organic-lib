var element, handler;
var startWidth, startHeight, startX, startY;

module.exports = function(elem){
    element = elem;
    addHandler();
    handler.addEventListener('mousedown', handlerMouseDown);
}

var addHandler = function(){
    handler = document.createElement('div');
    handler.style.width = '10px';
    handler.style.height = '10px';
    handler.style.position = 'absolute';
    handler.style.bottom = '0';
    handler.style.right = '0';
    handler.style.cursor = 'nwse-resize';
    element.appendChild(handler);
};


var handlerMouseDown = function(ev){
    event.preventDefault();
    ev.stopPropagation();
    document.body.addEventListener('mousemove', handlerMouseMove);
    startWidth = element.offsetWidth;
    startHeight = element.offsetHeight;
    startX = ev.x;
    startY = ev.y;
};

var handlerMouseMove = function(ev){
    ev.stopPropagation();
    document.body.addEventListener('mouseup', handlerMouseUp);
    var deltaX = ev.x - startX;
    var deltaY = ev.y - startY;
    element.style.width = (startWidth + deltaX) + 'px';
    element.style.height = (startHeight + deltaY) + 'px';
};

var handlerMouseUp = function(ev){
    ev.stopPropagation();
    document.body.removeEventListener('mousemove', handlerMouseMove);
    document.body.removeEventListener('mouseup', handlerMouseUp);    
};
