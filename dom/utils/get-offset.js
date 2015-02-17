//returns an object {top, left} with the offset of an element in relation to the body
module.exports = function(elem){
    var offsetLeft = 0;
    var offsetTop = 0;
    do {
        if( !isNaN(elem.offsetLeft) && !isNaN(elem.offsetTop) ){
            offsetLeft += elem.offsetLeft;
            offsetTop += elem.offsetTop;
        }
    } while ( elem = elem.offsetParent );

    return { left: offsetLeft, top: offsetTop };
};
