var vertical = function(index, color, selectColor, x, y, spread, angle, selected) {
	angle = typeof angle !== 'undefined'? angle : 0; // default angle if none supplied
	selected = typeof selected !== 'undefined'? selected : true;
	spread = typeof spread !== 'undefined'? spread : 0;

	var rect = new createjs.Shape();
	var circle = new createjs.Shape();
	var container = new createjs.Container();
	container.mouseChildren = false;

	rect.graphics.beginFill(color).drawRect(0, 0, railLength*scale, 1.5*scale);
	circle.graphics.beginRadialGradientFill([selectColor, 'rgba(255, 255, 255, 0)'], 
		[0.9,0.1], 0, 0, 0, 0, 0, railLength*scale*1.2).drawCircle( 0, 0, railLength*scale/2 );

	circle.alpha = 0.9;

	rect.regX = railLength*scale/2;
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
		activeRail = rails.length;
		circle.visible = true;
	}

	container.index = index;
	container.type = vertical;
	container.spread = spread;

	return container;
}

var oxer = function(index, color, selectColor, x, y, spread, angle, selected) {
	angle = typeof angle !== 'undefined'? angle : 0; // default angle if none supplied
	selected = typeof selected !== 'undefined'? selected : true;

	var rectA = new createjs.Shape();
	var rectB = new createjs.Shape();
	var rectBack = new createjs.Shape();

	var circle = new createjs.Shape();
	var container = new createjs.Container();
	container.mouseChildren = false;

	rectA.graphics.beginFill(color).drawRect(0, 0, railLength*scale, 1.5*scale);
	rectB.graphics.beginFill(color).drawRect(0, 0, railLength*scale, 1.5*scale);
	rectBack.graphics.beginFill('White').drawRect(0, 0, railLength*scale, spread*scale);

	circle.graphics.beginRadialGradientFill([selectColor, 'rgba(255, 255, 255, 0)'], 
		[0.9,0.1], 0, 0, 0, 0, 0, railLength*scale*1.2).drawCircle( 0, 0, railLength*scale/2*(1+(0.5)*spread/railLength) );

	circle.alpha = 0.9;

	rectA.regX = railLength*scale/2;
	rectA.regY = (1.5*scale/2)+spread*scale/2;

	rectB.regX = railLength*scale/2;
	rectB.regY = (1.5*scale/2)-spread*scale/2;

	rectBack.regX = railLength*scale/2;
	rectBack.regY = spread*scale/2;

	container.x = x;
	container.y = y;

	container.addChild(circle);
	container.addChild(rectBack);
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
		activeRail = rails.length;
		circle.visible = true;
	}

	container.index = index;
	container.type = oxer;
	container.spread = spread;

	return container;
}

/*
	Event Functions for jumps
*/
var onContainerMouseDown = function(evt){
	console.log("Jump Clicked");
	evt.target.offset = {x: evt.target.x - evt.stageX, y: evt.target.y - evt.stageY};
	if( mode == 0 ){ 
		activeRail = evt.target.index;
		evt.target.children[0].visible = true;
		update = true;
	}
}

var onContainerClick = function(evt){
	if( mode == 1 ){
		if ( activeRail == -1 ){
			activeRail = evt.target.index;
			evt.target.children[0].visible = true;
			update = true;
		} else {
			var startX = rails[activeRail].x;
			var startY = rails[activeRail].y;
			var endX = evt.target.x;
			var endY = evt.target.y;

			var distance = Math.abs( hypoteneus( endX - startX, endY - startY ) );

			$('#measurment').text(parseFloat(distance / scale).toFixed(2) + ' Feet' );
			measureClick();
		}
	}
}

var onContainerPressMove = function(evt){
	evt.target.x = evt.stageX + evt.target.offset.x;
	evt.target.y = evt.stageY + evt.target.offset.y;
	// indicate that the stage should be updated on the next tick:
	update = true;
}






















