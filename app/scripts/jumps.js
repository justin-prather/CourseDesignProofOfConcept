 var jumps = {
 	'vertical' : function(index, color, selectColor, x, y, spread, rLength, angle, selected) {
		angle = typeof angle !== 'undefined'? angle : 0; // default angle if none supplied
		selected = typeof selected !== 'undefined'? selected : true;
		spread = 0;
		rLength = typeof rLength !== 'undefined'? rLength : railLength;

		var rect = new createjs.Shape();
		var circle = new createjs.Shape();
		var container = new createjs.Container();
		container.mouseChildren = false;

		rect.graphics.beginFill(color).drawRect(0, 0, rLength*scale, 1.5*scale);
		circle.graphics.beginRadialGradientFill([selectColor, 'rgba(255, 255, 255, 0)'], 
			[0.9,0.1], 0, 0, 0, 0, 0, rLength*scale*1.2).drawCircle( 0, 0, rLength*scale/2 );

		circle.alpha = 0.9;

		rect.regX = rLength*scale/2;
		rect.regY = 1.5*scale/2;

		container.x = x;
		container.y = y;

		container.addChild(circle);
		container.addChild(rect);

		container.rotation = angle;

		container.on("mousedown", function(evt){
			onContainerMouseDown(evt);
		});

		container.on("click", function(evt){
			onContainerClick(evt);
		});

		// the pressmove event is dispatched when the mouse moves after a mousedown on the target until the mouse is released.
		container.on("pressmove", function (evt) {
			onContainerPressMove(evt);
		});

		stage.addChild(container);

		circle.visible = false; 
		
		if ( selected ){
			jumpStack.replaceFirst(rails.length);
			circle.visible = true;
		}

		container.index = index;
		container.type = 'vertical';
		container.spread = spread;
		container.rLength = rLength;
		container.offset = {x: 0, y: 0};
		container.select = circle;

		return container;
	},

	'oxer' : function(index, color, selectColor, x, y, spread, rLength, angle, selected) {
		angle = typeof angle !== 'undefined'? angle : 0; // default angle if none supplied
		selected = typeof selected !== 'undefined'? selected : true;
		rLength = typeof rLength !== 'undefined'? rLength : railLength;

		var rectA = new createjs.Shape();
		var rectB = new createjs.Shape();
		var rectBack = new createjs.Shape();

		var circle = new createjs.Shape();
		var container = new createjs.Container();
		container.mouseChildren = false;

		rectA.graphics.beginFill(color).drawRect(0, 0, rLength*scale, 1.5*scale);
		rectB.graphics.beginFill(color).drawRect(0, 0, rLength*scale, 1.5*scale);
		rectBack.graphics.beginFill('White').drawRect(0, 0, rLength*scale, spread*scale);

		circle.graphics.beginRadialGradientFill([selectColor, 'rgba(255, 255, 255, 0)'], 
			[0.9,0.1], 0, 0, 0, 0, 0, rLength*scale*1.2).drawCircle( 0, 0, rLength*scale/2*(1+(0.5)*spread/rLength) );

		circle.alpha = 0.9;

		rectA.regX = rLength*scale/2;
		rectA.regY = (1.5*scale/2)+spread*scale/2;

		rectB.regX = rLength*scale/2;
		rectB.regY = (1.5*scale/2)-spread*scale/2;

		rectBack.regX = rLength*scale/2;
		rectBack.regY = spread*scale/2;

		container.x = x;
		container.y = y;

		container.addChild(rectBack);
		container.addChild(circle);
		container.addChild(rectA);
		container.addChild(rectB);

		container.rotation = angle;

		container.on("mousedown", function(evt){
			onContainerMouseDown(evt);
		});

		container.on("click", function(evt){
			onContainerClick(evt);
		});

		// the pressmove event is dispatched when the mouse moves after a mousedown on the target until the mouse is released.
		container.on("pressmove", function (evt) {
			onContainerPressMove(evt);
		});

		stage.addChild(container);

		circle.visible = false; 
		
		if ( selected ){
			jumpStack.replaceFirst(rails.length);
			circle.visible = true;
		}

		container.index = index;
		container.type = 'oxer';
		container.spread = spread;
		container.rLength = rLength;
		container.offset = {x: 0, y: 0};
		container.select = circle;

		return container;
	}
};

/*
	Event Functions for jumps
*/
var onContainerMouseDown = function(evt){
	lastMousePos = {x: evt.stageX, y: evt.stageY};
	evt.target.offset = {x: evt.target.x - evt.stageX, y: evt.target.y - evt.stageY};
	if( mode == STATE_DEFAULT ){ 
		console.log( modifier );
		if(modifier == true){ 
			jumpStack.push(evt.target.index);
			console.log('pushed');
		}
		else{ 
			jumpStack.replaceFirst(evt.target.index);
			console.log('replaced');
		}
		evt.target.select.visible = true;
		update = true;
	}
}

var onContainerClick = function(evt){
	if( mode == STATE_MEASURE ){
		
		jumpStack.push(evt.target.index);
		evt.target.select.visible = true;

		var distance = 0;
		var line = new createjs.Shape();

		line.graphics.setStrokeStyle(1);
		line.graphics.beginStroke('Black');

		for( var i = 1; i < jumpStack.length(); i++ ){
			var startX = rails[jumpStack.peek(i-1)].x;
			var startY = rails[jumpStack.peek(i-1)].y;
			var endX = rails[jumpStack.peek(i)].x;
			var endY = rails[jumpStack.peek(i)].y;

			line.graphics.moveTo(startX, startY);
			line.graphics.lineTo(endX, endY);

			distance += Math.abs( hypoteneus( endX - startX, endY - startY ) );
		}

		stage.removeChild(measurePath);
		line.graphics.endStroke();
		stage.addChild(line);
		measurePath = line;

		$('#measurment').text(parseFloat(distance / scale).toFixed(2) + ' Feet' );
		
		update = true;
	} else if ( mode == STATE_MEASURE_PATH ){
		jumpStack.push(evt.target.index);
		evt.target.select.visible = true;

		var length = 0;
		var curve = new createjs.Shape();

		curve.graphics.setStrokeStyle(1);
		curve.graphics.beginStroke('Black');

		for( var i = 1; i < jumpStack.length(); i++ ){
			var startX1 = rails[jumpStack.peek(i-1)].x;
			var startY1 = rails[jumpStack.peek(i-1)].y;
			var endX1 = startX1 + 50*Math.cos(toRadians(rails[jumpStack.peek(i-1)].rotation + 90));
			var endY1 = startY1 + 50*Math.sin(toRadians(rails[jumpStack.peek(i-1)].rotation + 90));

			var startX2 = rails[jumpStack.peek(i)].x;
			var startY2 = rails[jumpStack.peek(i)].y;
			var endX2 = startX2 + 50*Math.cos(toRadians(rails[jumpStack.peek(i)].rotation + 90));
			var endY2 = startY2 + 50*Math.sin(toRadians(rails[jumpStack.peek(i)].rotation + 90));

			var intersect = checkLineIntersection(startX1, startY1, endX1, endY1, startX2, startY2, endX2, endY2);

			curve.graphics.moveTo(startX1, startY1);

			if( !intersect.x || !intersect.y){
				var distance = isStraightLine( rails[jumpStack.peek(i-1)], rails[jumpStack.peek(i)] );
				if ( distance ){
					curve.graphics.lineTo(startX2, startY2);
					length += distance - (rails[jumpStack.peek(i-1)].spread*scale / 2) - (rails[jumpStack.peek(i)].spread*scale / 2);
				}
			} else{
				curve.graphics.quadraticCurveTo(intersect.x, intersect.y, startX2, startY2);

				length += curveLength( startX1, startY1, intersect.x, intersect.y, startX2, startY2 ) - 
					(rails[jumpStack.peek(i-1)].spread*scale / 2) - (rails[jumpStack.peek(i)].spread*scale / 2);
				console.log( 'Curve Length: ' + length/scale );
			}
		}

		stage.removeChild(measureCurve);
		curve.graphics.endStroke();
		stage.addChild(curve);
		measureCurve = curve;

		$('#pathMeasurment').text(parseFloat(length / scale).toFixed(2) + ' Feet' );
		update = true;
	}
}

var onContainerPressMove = function(evt){
	if(!modifier){
		evt.target.x = evt.stageX + evt.target.offset.x;
		evt.target.y = evt.stageY + evt.target.offset.y;
	} else{
		var deltaX = evt.stageX - lastMousePos.x;
		var deltaY = evt.stageY - lastMousePos.y;
	
	
		for( var i = 0; i < jumpStack.length(); i++){
			var jump = rails[jumpStack.peek(i)];
			jump.x =  deltaX + jump.x;
			jump.y = deltaY + jump.y;
		}
	
		lastMousePos = {x: evt.stageX, y: evt.stageY};
	}
	// console.log( 'last x: %d last y: %d, new x: %d new y: %d delta x: %d delta y: %d', lastMousePos.x, lastMousePos.y, evt.stageX, evt.stageY, deltaX, deltaY);

	update = true;
}






















