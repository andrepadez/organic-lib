var DragDrop = require('./dragdrop');

var container, element, releaseCallback;

module.exports = function(options){
    releaseCallback = options.releaseCallback || function(){};
    options.releaseCallback = droppedHandler;
    DragDrop(options);
};

function droppedHandler (dragged, container, ev){
    var width = dragged.offsetWidth;
    var height = dragged.offsetHeight;
    
    if(dragged.offsetLeft < 0){
        dragged.style.marginLeft = '0';
    }
    if(dragged.offsetLeft + dragged.offsetWidth > container.offsetWidth){
        dragged.style.marginLeft = container.offsetWidth - dragged.offsetWidth + 'px';
    }
    if(dragged.offsetTop < 0){
        dragged.style.marginTop = '0';
    }
    if(dragged.offsetTop + dragged.offsetHeight > container.offsetHeight){
        dragged.style.marginTop = container.offsetHeight - dragged.offsetHeight + 'px';
    }

    releaseCallback(dragged, container, ev);
};
