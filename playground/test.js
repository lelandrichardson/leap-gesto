// Setup Leap loop with frame callback function
var controllerOptions = {enableGestures: true};

var el = {
    frame: document.getElementById("frameData"),
    hand: document.getElementById("handData"),
    pointable: document.getElementById("pointableData"),
    gesture: document.getElementById("gestureData"),
};

var previousFrame;
var vectorToString = function(v){return v.toString();}
Leap.loop(controllerOptions, function(frame) {
    // Body of callback function

    var frameString = "Frame ID: " + frame.id  + "<br />"
        + "Timestamp: " + frame.timestamp + " &micro;s<br />"
        + "Hands: " + frame.hands.length + "<br />"
        + "Fingers: " + frame.fingers.length + "<br />"
        + "Tools: " + frame.tools.length + "<br />"
        + "Gestures: " + frame.gestures.length + "<br />";



    // Frame motion factors
    if (previousFrame) {
        var translation = frame.translation(previousFrame);
        frameString += "Translation: " + vectorToString(translation) + " mm <br />";

        var rotationAxis = frame.rotationAxis(previousFrame);
        var rotationAngle = frame.rotationAngle(previousFrame);
        frameString += "Rotation axis: " + vectorToString(rotationAxis, 2) + "<br />";
        frameString += "Rotation angle: " + rotationAngle.toFixed(2) + " radians<br />";

        var scaleFactor = frame.scaleFactor(previousFrame);
        frameString += "Scale factor: " + scaleFactor.toFixed(2) + "<br />";
    }


    // Display Hand object data
    var handString = "";
    if (frame.hands.length > 0) {
        for (var i = 0; i < frame.hands.length; i++) {
            var hand = frame.hands[i];

            handString += "Hand ID: " + hand.id + "<br />";
            handString += "Direction: " + vectorToString(hand.direction, 2) + "<br />";
            handString += "Palm normal: " + vectorToString(hand.palmNormal, 2) + "<br />";
            handString += "Palm position: " + vectorToString(hand.palmPosition) + " mm<br />";
            handString += "Palm velocity: " + vectorToString(hand.palmVelocity) + " mm/s<br />";
            handString += "Sphere center: " + vectorToString(hand.sphereCenter) + " mm<br />";
            handString += "Sphere radius: " + hand.sphereRadius.toFixed(1) + " mm<br />";

            // And so on...
        }
    }


    // Display Pointable (finger and tool) object data
    var pointableString = "";
    if (frame.pointables.length > 0) {
        for (var i = 0; i < frame.pointables.length; i++) {
            var pointable = frame.pointables[i];

            pointableString += "Pointable ID: " + pointable.id + "<br />";
            pointableString += "Belongs to hand with ID: " + pointable.handId + "<br />";

            if (pointable.tool) {
                pointableString += "Classified as a tool <br />";
                pointableString += "Length: " + pointable.length.toFixed(1) + " mm<br />";
                pointableString += "Width: "  + pointable.width.toFixed(1) + " mm<br />";
            }
            else {
                pointableString += "Classified as a finger<br />";
                pointableString += "Length: " + pointable.length.toFixed(1) + " mm<br />";
            }

            pointableString += "Direction: " + vectorToString(pointable.direction, 2) + "<br />";
            pointableString += "Tip position: " + vectorToString(pointable.tipPosition) + " mm<br />";
            pointableString += "Tip velocity: " + vectorToString(pointable.tipVelocity) + " mm/s<br />";
        }
    }

    previousFrame = frame;

    el.frame.innerHTML = frameString;
    el.hand.innerHTML = handString;
    el.gesture.innerHTML = '';
    el.pointable.innerHTML = pointableString;

});