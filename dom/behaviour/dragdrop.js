//add drag and drop behaviour to elements in a container

var isChildOf = require('../utils/is-child-of');
var getOffset = require('../utils/get-offset');

var maxZ = 1000;

module.exports = function(options){
    return new DragDrop(options);
};

var DragDrop = function(options){
    this.container = options.container || document.body;
    var elements = options.elements || [ options.element ];
    this.releaseCallback = options.releaseCallback || function(){};
    this.useClone = typeof options.useClone === 'boolean'? options.useClone : false;
    this.targets = Array.prototype.slice.call(elements);

    this.mouseMoveHandler = this.handleMouseMove.bind(this);
    this.mouseUpHandler = this.handleMouseUp.bind(this);
    this.container.addEventListener( 'mousedown', this.handleMouseDown.bind(this) );
};

DragDrop.prototype.handleMouseDown = function(ev){
    this.isMouseDown = true;
    this.draggableObject = this.getDraggableObject(ev);
    if(this.draggableObject){
        this.width = this.draggableObject.offsetWidth;
        this.height = this.draggableObject.offsetHeight;
        this.position = getOffset(this.draggableObject);
        this.draggableObject = this.useClone? this.draggableObject.cloneNode(true) : this.draggableObject;
        this.draggableObject.style.position = 'absolute';
        this.draggableObject.style.width = this.width + 'px';
        this.draggableObject.style.height = this.height + 'px';
        this.startX = ev.x;
        this.startY = ev.y;
        document.body.addEventListener( 'mouseup', this.mouseUpHandler );
        document.body.addEventListener( 'mouseleave', this.mouseUpHandler );
        document.body.addEventListener( 'mousemove', this.mouseMoveHandler );
    }
};

DragDrop.prototype.handleMouseMove = function(ev){
    if(this.draggableObject && this.isMouseDown){
        ev.preventDefault();
        
        this.draggableObject.style.zIndex = maxZ++;
        this.draggableObject.style.width = this.width + 'px';
        this.draggableObject.style.height = this.height + 'px';
        if( this.useClone && !this.draggableObject.parentNode ){
            document.body.appendChild(this.draggableObject);
        }
        
        var deltaX = ev.x - this.startX;
        var deltaY = ev.y - this.startY;
        this.draggableObject.style.marginLeft = (this.position.left + deltaX) + 'px';
        this.draggableObject.style.marginTop = (this.position.top + deltaY) + 'px';
    }
};

DragDrop.prototype.handleMouseUp = function(ev){
    ev.preventDefault();
    if( !this.draggableObject ){
        return;
    }
    if( this.draggableObject.parentNode && this.useClone ){
        this.draggableObject.parentNode.removeChild( this.draggableObject );
    }
    this.releaseCallback(this.draggableObject, ev);
    this.draggableObject = null;
    this.isMouseDown = false;
    document.body.removeEventListener( 'mouseup', this.mouseUpHandler );
    document.body.removeEventListener( 'mouseleave', this.mouseUpHandler );
    document.body.removeEventListener( 'mousemove', this.mouseUpHandler );
};

DragDrop.prototype.getDraggableObject = function(ev){
    if(ev.ctrlKey){
        return false;
    }
    var dragObject = null;
    this.targets.forEach(function(target){
        var nodeName = ev.target.nodeName.toLowerCase();
        if( nodeName !== 'input' && nodeName !== 'button' && isChildOf(ev.target, target) ){
            dragObject = target;
        }
    });
    return dragObject;
};
