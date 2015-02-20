//pubsub module used by our application controllers
var registeredHandlers = {};
var catchAll = [];

module.exports = {
    subscribe: subscribe,
    broadcast: broadcast
};

function subscribe (messages, handler){
    if(typeof handler !== 'function'){
        throw new Error('you can\'t register non-methods as handlers');
    }
    if( messages === '*' ){
        catchAll.push(handler);
        return;
    }

    messages = Array.isArray(messages)? messages : [messages];
    messages.forEach(function(message){
        registeredHandlers[message] = registeredHandlers[message] || [];
        registeredHandlers[message].push(handler);
    });
};

function broadcast(message, data){
    data = data || {};
    var handlers = registeredHandlers[message] || [];
    handlers.forEach(function(handler){
        handler(message, data);
    });
    catchAll.forEach(function(handler){
        handler(message, data);
    });
};
