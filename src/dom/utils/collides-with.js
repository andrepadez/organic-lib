//detects if an object(DOM element) is dropped on a target
module.exports = function(target, coords){
    var startX = target.offsetLeft;
    var startY = target.offsetTop;
    var endX = startX + target.offsetWidth;
    var endY = startY + target.offsetHeight;
    return (coords.x >= startX && coords.y >= startY) && (coords.x <= endX && coords.y <= endY)
};
