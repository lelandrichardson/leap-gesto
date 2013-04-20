
// example gesture

;(function(){

    //TODO: allow gestures to declare dependencies...
    //TODO: how can gestures build on one another?

    // define your own custom gesturew
    var fiveFingers = (function(){
        //gesture scope here

        var isInGesture = false;

        return {
            name: "fiveFingers", //default name when event fires
            loop: function(frame, controller){
                // handle onFrame data collection + analysis

                var hands = frame.hands;
                if(hands.length === 0){
                    isInGesture = false;
                    return false;
                }
                var ffHand = _.find(hands,function(hand){
                    return hand.pointables.length>4;
                });
                if(!ffHand){
                    isInGesture = false;
                    return false;
                }
                var justStarted = !isInGesture;
                isInGesture = true;
                // if gesture occurs, pass back event data + name, otherwise pass back false
                return justStarted ? {
                    name: "fiveFingers",
                    data: {
                        hand: ffHand,
                        fingers: ffHand.pointables
                    }
                } : false;
            }
        };
    }());

    gesto.addGesture("fiveFingers",fiveFingers);


    gesto.on("fiveFingers",function(data){
        console.log("Five Fingers!!!");
    });

    gesto.start();


}());