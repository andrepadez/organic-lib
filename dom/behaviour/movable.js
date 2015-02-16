var DragDrop = require('./dragdrop');

var container, element, droppedCallback;

module.exports = function(cont, elem, cb){
    container = cont;
    element = elem;
    droppedCallback = cb || function(){};
    DragDrop(cont, element, droppedHandler);
}

var droppedHandler = function(dragged, container, ev){
    var width = dragged.offsetWidth;
    var height = dragged.offsetHeight;
    if(ev.x - (width/2) < container.offsetLeft){
        dragged.style.marginLeft = container.offsetLeft + 'px';
    }
    if( ev.x + (width/2) > ( container.offsetLeft + container.offsetWidth) ){
        dragged.style.marginLeft = ( container.offsetLeft + container.offsetWidth - (width) ) + 'px';
    }
    if( ev.y - (height/2) < container.offsetTop){
        dragged.style.marginTop = container.offsetTop + 'px';
    }
    if( ev.y + (height) > container.offsetHeight){
        dragged.style.marginTop = ( container.offsetHeight - (height) ) + 'px';
    }
    droppedCallback(dragged, container, ev);
};
