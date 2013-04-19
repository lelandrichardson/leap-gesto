;(function(){
    // module scope

    var Gesto = function(){
        var self = this;


        self.registry = {};

    };

    var gp = Gesto.prototype;

    gp.fire = function (eventName, data) {
        var array, i;
        if (this.registry.hasOwnProperty(eventName)) {
            array = this.registry[eventName];
            for (i = 0; i < array.length; i += 1) {
                array[i].call(this, data);;
            }
        }
        return this;
    };

    gp.on = function(eventName, callback){

    };

    gp.off = function(eventName, callback){

    };



    window.Gesto = Gesto;
    window.gesto = new Gesto();
}());



var eventuality = function (that) {
    var registry = {};
    that.fire = function (event) {
        var array,
            func,
            handler,
            i,
            type = typeof event === 'string' ? event : event.type;

        if (registry.hasOwnProperty(type)) {
            array = registry[type];
            for (i = 0; i < array.length; i += 1) {
                handler = array[i];
                func = handler.method;
                if (typeof func === 'string') {
                    func = this[func];
                }
                func.apply(this, [event]);
            }
        }
        return this;
    };
    that.on = function (type, method) {
        var handler = {
            method: method
        };
        if (registry.hasOwnProperty(type)) {
            registry[type].push(handler);
        } else {
            registry[type] = [handler];
        }
        return this;
    };

    that.override = function(type, method) {
        if (registry.hasOwnProperty(type)) {
            registry[type].length = 0;
        }
        return that.on(type, method);
    };
    return that;
};