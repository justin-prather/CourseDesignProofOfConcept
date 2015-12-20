var vertical = function(index, color, selectColor, x, y, angle, selected) {
	angle = typeof angle !== 'undefined'? angle : 0; // default angle if none supplied
	selected = typeof selected !== 'undefined'? selected : true;

	var rect = new createjs.Shape();
	var circle = new createjs.Shape();
	var container = new createjs.Container();
	container.mouseChildren = false;

	rect.graphics.beginFill(color).drawRect(0, 0, railLength*scale, 1.5*scale);
	circle.graphics.beginRadialGradientFill([selectColor, 'rgba(255, 255, 255, 0)'], 
		[0.9,0.1], 0, 0, 0, 0, 0, railLength*scale*1.2).drawCircle( 0, 0, railLength*scale/2 );

	circle.alpha = 0.9;

	rect.regX = railLength*scale/2;
	rect.regY = scale;

	container.x = x;
	container.y = y;

	container.addChild(circle);
	container.addChild(rect);

	container.rotation = angle;

	container.on("mousedown", function(evt){
		this.offset = {x: this.x - evt.stageX, y: this.y - evt.stageY};
	});

	container.on("click", function(evt){
		if( mode == 0 ){ 
			activeRail = this.index;
			this.children[0].visible = true;
			update = true;
		}
		else if( mode == 1 ){
			if ( activeRail == -1 ){
				activeRail = this.index;
				this.children[0].visible = true;
				update = true;
			} else {
				var startX = rails[activeRail].x;
				var startY = rails[activeRail].y;
				var endX = this.x;
				var endY = this.y;

				var distance = Math.abs( hypoteneus( endX - startX, endY - startY ) );

				$('#measurment').text(parseFloat(distance / scale).toFixed(2) + ' Feet' );
				measureClick();
			}
		}
	});

	// the pressmove event is dispatched when the mouse moves after a mousedown on the target until the mouse is released.
	container.on("pressmove", function (evt) {
		this.x = evt.stageX + this.offset.x;
		this.y = evt.stageY + this.offset.y;
		// indicate that the stage should be updated on the next tick:
		update = true;
	});

	stage.addChild(container);

	circle.visible = false; 
	
	if ( selected ){
		activeRail = rails.length;
		circle.visible = true;
	}

	container.index = index;
	container.type = vertical;

	return container;
}