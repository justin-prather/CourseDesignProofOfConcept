'use strict';
var update = false;
var canvas, stage;
var scale, railLength;
var template;

var activeRail = -1;


var rails = [];

var dblClick = false;
/*
	0 = normal
	1 = measure
*/
var mode = 0;

$(function(){

	template = Handlebars.compile($('#rails-template').html());

	$('#submit').click( setRingParams );
	$('#measure').click( event, measureClick );
	
	canvas = document.getElementById('demoCanvas');
	canvas.addEventListener("mousewheel", MouseWheelHandler, false);
	setRingParams();

	stage = new createjs.Stage(canvas);
	createjs.Touch.enable(stage);

	stage.addEventListener("stagemousedown", function(event){
		if( !dblClick ){
			dblClick = true;
			setTimeout(function(){ dblClick = false}, 200);
			
			if( mode == 0 ){
				if ( activeRail != -1 ) rails[activeRail].children[0].visible = false;
				activeRail = -1;
				update = true;
			}
		}
		else{
			var nRail = newRail("Purple", "red", event.stageX, event.stageY);
			nRail.index = rails.length;
			rails.push( nRail );
			update = true;
		}
	});

	$('#rails').on( 'click', '.delete', function(){
		var btn = event.target;
		var index = $(btn).parent().attr('id');

		stage.removeChild(rails[index]);
		rails.splice( index, 1 );
		update = true;
	});

	stage.update();

	createjs.Ticker.addEventListener("tick", tick);
});

var setRingParams = function(){
	var ringWidth = Number($('#widthInput').val());
	var ringHeight = Number($('#heightInput').val());

	if( ringHeight > ringWidth ){
		var temp = ringWidth;
		ringWidth = ringHeight;
		ringHeight = temp;
		$('#widthInput').val(ringWidth);
		$('#heightInput').val(ringHeight);
	}

	railLength = $('#railLength').val();
	var ratio = ringHeight/ringWidth;

	var windowWidth = $('.container').width();
	canvas.width = windowWidth;

	scale = windowWidth/ringWidth;

	canvas.height = windowWidth*ratio;

	activeRail = -1; 

	var length = rails.length;
	var tempRails = [];
	for ( var i = 0; i < length; i++ ){
		tempRails.push(newRail("Purple", "red", rails[i].x, rails[i].y,
			rails[i].rotation, false));
		stage.removeChild(rails[i]);
	}
	rails = tempRails;
	update = true;
};

var newRail = function(color, selectColor, x, y, angle, selected) {
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

	return container;
}

var updateList = function(){
	var data = {};
	$('#rails').empty();
	for ( var i = 0; i < rails.length; i++ ){
		data.index = i;
		data.x = parseFloat(rails[i].x/scale).toFixed(2);
		data.y = parseFloat(rails[i].y/scale).toFixed(2);
		data.angle = rails[i].rotation;
		data.class = activeRail == i ? 'selected' : '';
		$('#rails').append(template(data));
	}
};

var MouseWheelHandler = function(event){
	var delta = Math.max(-1, Math.min(1, (event.wheelDelta || -event.detail)));
	if( activeRail != -1 ){
		var rotation = rails[activeRail].rotation;
		rotation += delta;
		if ( rotation > 180 ) rails[activeRail].rotation = rotation - 180;
		else if ( rotation < 0 ) rails[activeRail].rotation = rotation + 180;
		else rails[activeRail].rotation = rotation;
		update = true;
	}
	event.preventDefault();
	return false;
};

var measureClick = function(){
	if ( mode != 1 ){
		mode = 1;
		$('#measure').addClass('btn-success');
		$('#measure').removeClass('btn-default');
	} else {
		mode = 0;
		$('#measure').removeClass('btn-success');
		$('#measure').addClass('btn-default');
	}
}

function tick(event) {
	// this set makes it so the stage only re-renders when an event handler indicates a change has happened.
	if (update) {
		update = false; // only update once
		updateList();
		stage.update(event);
	}
}