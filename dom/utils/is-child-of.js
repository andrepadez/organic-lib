
module.exports = function(elem, parent){

    if(elem === parent){
        return true;
    }
    while(elem = elem.parentNode){
        if(elem === document.body){
            return false;
        }
        if(elem === parent){
            return true;
       }
    }

}
