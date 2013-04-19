;(function(Leap, _, undefined){
    "use strict";
    // module scope


    // USEFUL NATIVE PROTOTYPES
    // ---------------------------------------------------
    var slice = Array.prototype.slice,
        splice = Array.prototype.splice,
        min = Math.min,
        max = Math.max;

    // USEFUL UNDERSCORE OR NATIVES
    // ----------------------------------------------------
    var extend = _.extend,
        map = _.map,
        each = _.each;


    // UTILITY FUNCTIONS
    // ----------------------------------------------------
    var nop = function() {};
    var compose = function(a,b){
        return function(){
            var args = slice.call(arguments,0);
            a.apply(this, args);
            b.apply(this, args);
        }.bind(this);
    };


    // UTILITY METHODS
    // ------------------------------------------
    var _defaultOptions = {
        enableGestures: true
    };



    var gesto = (function(){
        var registry = {},
            gestures = {},
            leap = Leap,
            controller,
            options,
            isStarted = false
            ;

        // configuration function. must be called before calling gesto.start();
        // passes in the controller options to be used
        var configure = function(opts) {
            if(isStarted) {
                throw "Can't configure gesto while it is running. Call .stop() first.";
            }
            options = opts;
        };

        // MAIN LOOP FUNCTION
        // --------------------------------------------------------------
        var loop = function(frame){
            each(gestures,function(gesture){
                var value = gesture.loop.call(null, frame, controller);
                if(value){
                    // gesture is triggering an event
                    fireAll(value.name || gesture.name, value.data || {});
                }
            });
        };


        // FIRING EVENTS
        // -------------------------------------------------------------

        // allows for namespaced event like "swipe.swipteLeft" to trigger both "swipe" handlers and "swipe.swipeLeft"
        // handlers.  Basically, event namespacing.
        var fireAll = function(namespacedEvent, data){
            var ns = namespacedEvent.split('.'),
                temp,
                eventName = ns.shift();

            fire(eventName,data);

            while((temp = ns.shift()) === undefined){
                eventName += '.' + temp;
                fire(eventName,data);
            }


        };

        var fire = function (eventName, data) {
            var array, i;
            if (registry.hasOwnProperty(eventName)) {
                array = registry[eventName];
                for (i = 0; i < array.length; i += 1) {
                    array[i].call(null, data); //TODO: should something be bound to "this"?
                }
            }
            return this;
        };

        // PRIMARY METHODS
        // --------------------------------------------------------------
        var start = function(){
            var opts = extend({},_defaultOptions,options);
            controller = new leap.Controller(opts);
            controller.connect();
            isStarted = true
            controller.on('frame',loop);
        };

        var stop = function() {
            controller.disconnect();
            isStarted = false;
        };

        // GESTURE REGISTRATION
        // -------------------------------------------------------------

        var addGesture = function(name, gesture){
            if(!gesture || !gesture.loop || typeof gesture.loop !== 'function') {
                throw "Gestures must provide a loop method";
            }
            if(typeof name !== 'string'){
                throw "You must provide a string gesture name";
            }
            gestures[name] = gesture;
        };
        var removeGesture = function(name){
            delete gestures[name];
        };



        // EVENT BINDINGS
        // ------------------------------------------------------------
        var on = function(eventName, callback){
            if (registry.hasOwnProperty(eventName)) {
                registry[eventName].push(callback);
            } else {
                registry[eventName] = [callback];
            }
            return this;
        };

        var off = function(eventName, callback){
            if(registry.hasOwnProperty(eventName)){
                var handlers = registry[eventName];
                var i = -1;
                each(handlers,function(handler,idx){
                    if(handler === callback) {
                        i = idx;
                    }
                });
                if(i !== -1) {
                    handlers[i] = nop; //TODO: make this better?
                }
            }
        };
        
        

        // export public api. ensure that all methods are bound to have "this" be gesto
        return _.bindAll({
            on: on,
            off: off,

            addGesture: addGesture,
            removeGesture: removeGesture,

            start: start,
            stop: stop,
            configure: configure
        });
    }());


    //export global
    window.gesto = gesto;;
}(window.Leap,window._));


// example gesture

;(function(){

    //TODO: allow gestures to declare dependencies...
    //TODO: how can gestures build on one another?

    // define your own custom gesturew
    var swipeGesture = (function(){
        return {
            name: "swipe", //default name when event fires
            loop: function(frame, controller){
                // handle onFrame data collection + analysis
                var gestureOccurred = false;

                // data analysis

                // if gesture occurrs, pass back event data + name, otherwise pass back false
                return gestureOccurred ? {
                    name: "swipeLeft",
                    data: {
                        direction: [1,2,3],
                        translation: 33.56,
                        origin: [4,5,6],
                        elapsed: 587
                    }
                } : false;
            }
        };
    }());

//    gesto.addGesture("swipe",swipeGesture);
//
//
//    gesto.on("swipe",function(data){
//
//    });
//
//    gesto.start();


}());
