
var Parser = module.exports = {
    parse: function(template, data){
        template = evaluate(template, data);   
        return template;
    }
};

var evaluate = function(template, data){
    template = parseValues(template, data);
    template = parseExpressions(template, data);
    console.log(template);
    return template;
};

var parseValues = function(template, data){
    var execResult, toReplace, expression, expressionArray;
    var values = {};
    var finalTemplate = template;
    while(execResult = regExps.value.exec(template)){
        expressionArray = execResult[1].trim().split('.');
        expression = data[ expressionArray.shift() ];
        
        expressionArray.forEach(function(key, index){
            expression = expression[ key ];
            if(!expression){
                throw Error('can\'t find ' + execResult[1].trim() + ' while rendering template');
            }
        });

        toReplace = execResult[0];
        finalTemplate = finalTemplate.replace( toReplace, expression || toReplace );
    }
    return finalTemplate;
};

var parseExpressions = function(template, data){
    return template;
}

var regExps = {
    value: /\{\{([^\{\}]+)\}\}/g,
    expression: /\{\%([^\{\%\}])\%\}/g
};

