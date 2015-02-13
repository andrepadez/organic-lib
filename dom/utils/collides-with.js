module.exports = function(target, coords){
    var startX = target.offsetLeft;
    var startY = target.offsetTop;
    var endX = startX + target.offsetWidth;
    var endY = startY + target.offsetHeight;
    return (coords.x >= startX && coords.y >= startY) && (coords.x <= endX && coords.y <= endY)
};
