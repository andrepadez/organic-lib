
var Parser = module.exports = {
    parse: function(template, data){
        template = evaluate(template, data);   
        return template;
    }
};

var evaluate = function(template, data){
    template = parseValues(template, data);
    console.log(template);
    return template;
};

var parseValues = function(template, data){
    var execResult;
    var values = {};
    while(execResult = regExps.value.exec(template)){
        var expression = execResult[1].trim();
        var toReplace = execResult[0];
        template = template.replace( toReplace, data[expression] || toReplace );
    }
    return template;
};

var regExps = {
    value: /\{\{(.+)\}\}/g,
    expression: /\{\%(.+)\%\}/g
};

