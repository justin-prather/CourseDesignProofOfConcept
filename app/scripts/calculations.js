// Calculate the hypotenuse of a triangle given side lengths x and y
var hypoteneus = function( x, y ){
	return Math.sqrt( (x*x) + (y*y) );
};

var toDegrees = function (angle) {
  return angle * (180 / Math.PI);
}

var toRadians = function(angle) {
  return angle * (Math.PI / 180);
}

// Calculate the intersection point of two lines
// from: http://jsfiddle.net/justin_c_rounds/Gd2S2/
function checkLineIntersection(line1StartX, line1StartY, line1EndX, line1EndY, line2StartX, line2StartY, line2EndX, line2EndY) {
    // if the lines intersect, the result contains the x and y of the intersection (treating the lines as infinite) and booleans for whether line segment 1 or line segment 2 contain the point
    var denominator, a, b, numerator1, numerator2, result = {
        x: null,
        y: null,
    };
    denominator = ((line2EndY - line2StartY) * (line1EndX - line1StartX)) - ((line2EndX - line2StartX) * (line1EndY - line1StartY));
    // console.log('Denominator: ' + denominator);
    if (denominator < 0.0000001 && denominator > -0.0000001) {
        // console.log( 'no intersection ');
        return result;
    }
    // console.log( 'intersection' );
    a = line1StartY - line2StartY;
    b = line1StartX - line2StartX;
    numerator1 = ((line2EndX - line2StartX) * a) - ((line2EndY - line2StartY) * b);
    numerator2 = ((line1EndX - line1StartX) * a) - ((line1EndY - line1StartY) * b);
    a = numerator1 / denominator;
    b = numerator2 / denominator;

    // if we cast these lines infinitely in both directions, they intersect here:
    result.x = line1StartX + (a * (line1EndX - line1StartX));
    result.y = line1StartY + (a * (line1EndY - line1StartY));
/*
        // it is worth noting that this should be the same as:
        x = line2StartX + (b * (line2EndX - line2StartX));
        y = line2StartX + (b * (line2EndY - line2StartY));
        */
    
    return result;
};

var curveLength = function(startX, startY, controlX, controlY, endX, endY){ // straight lines dont work!!
    var aX, aY, bX, bY;
    aX = startX - 2*controlX + endX;
    aY = startY - 2*controlY + endY;
    bX = 2*controlX - 2*startX;
    bY = 2*controlY - 2*startY;

    var A = 4*((aX*aX) + (aY*aY));
    var B = 4*((aX*bX) + (aY*bY));
    var C = (bX*bX) + (bY*bY);

    var Sabc = 2*Math.sqrt(A+B+C);
    var A_2 = Math.sqrt(A);
    var A_32 = 2*A*A_2;
    var C_2 = 2*Math.sqrt(C);
    var BA = B/A_2;

    var len = ( A_32*Sabc + A_2*B*(Sabc-C_2) + (4*C*A-B*B)*Math.log( (2*A_2+BA+Sabc)/(BA+C_2) ) )/(4*A_32);
    // console.log( BA+C_2 );
    return len;
}

var isStraightLine = function( jumpOne, jumpTwo ){
    if( jumpOne.rotation == jumpTwo.rotation ){
        console.log('same angle');

        var angle = jumpOne.rotation + 90;
        var distance = hypoteneus( jumpOne.x-jumpTwo.x, jumpOne.y-jumpTwo.y );

        if( angle % 90 == 0 ){ // jumping vertically or horizontally
            if( angle % 180 ){ // jumping vertically
                if( jumpOne.x == jumpTwo.x ){ // jumps are vertically alligned
                    console.log( 'jumping vertically');
                    return distance; 
                }
            } else{ // jumping horizontally
                if( jumpOne.y == jumpTwo.y ){ // jumps are horizontally alligned
                    console.log( 'jumping horizontally');
                    return distance; 
                 }
            }
        }

        var angleRads = toRadians( angle );

        var vOffset = distance * Math.sin( angleRads );
        var hOffset = distance * Math.cos( angleRads );

        var twoX = toFiveDecimals((jumpTwo.x).toFixed(5));
        var twoY = toFiveDecimals((jumpTwo.y).toFixed(5));

        // if( vOffset < 0 ) vOffset = Math.abs(vOffset + 1);
        // if( hOffset < 0 ) hOffset = Math.abs(hOffset + 1);

        console.log( 'Distance: '+distance+' Vertical: '+vOffset+' Horizontal: '+hOffset+ 'calc distance: '+ hypoteneus(hOffset, vOffset));
        // console.log( toFiveDecimals(jumpOne.y + vOffset ) + ' ' + twoY );
        // console.log( toFiveDecimals(jumpOne.x + hOffset ) + ' ' + twoX );

        if( toFiveDecimals(jumpOne.x + hOffset) == twoX && toFiveDecimals(jumpOne.y + vOffset) == twoY ) {
            console.log( 'inline ');
            return distance;
        } else if( toFiveDecimals(jumpOne.x - hOffset) == twoX && toFiveDecimals(jumpOne.y - vOffset) == twoY ) {
            console.log( 'inline ');
            return distance;
        } else if( toFiveDecimals(jumpOne.x + hOffset) == twoX && toFiveDecimals(jumpOne.y - vOffset) == twoY ){ 
            console.log( 'inline ');
            return distance;
        } else if( toFiveDecimals(jumpOne.x - hOffset) == twoX && toFiveDecimals(jumpOne.y + vOffset) == twoY ){
            console.log( 'inline ');
            return distance;
        } else return null;
    }
}

var toFiveDecimals = function( num ){
    return Number( parseFloat(num).toFixed(5) );
}
















