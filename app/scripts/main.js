var update = false;
var canvas, stage;
var scale, railLength;
var template;

var activeRail = null;

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
	$('#measure').click( event, measure );
	
	canvas = document.getElementById('demoCanvas');
	canvas.addEventListener("mousewheel", MouseWheelHandler, false);
	setRingParams();

	stage = new createjs.Stage(canvas);

	stage.addEventListener("stagemousedown", function(event){
		if( !dblClick ){
			dblClick = true;
			setTimeout(function(){ dblClick = false}, 200);
			
			if( mode == 0 ){
				if ( activeRail != null ) activeRail.children[0].visible = false;
				activeRail = null;
				update = true;
			}
		}
		else{
			rails.push(newRail("Purple", "red", event.stageX, event.stageY));
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

function tick(event) {
	// this set makes it so the stage only re-renders when an event handler indicates a change has happened.
	if (update) {
		update = false; // only update once
		updateList();
		stage.update(event);
	}
}

var setRingParams = function(){
	var ringWidth = $('#widthInput').val();
	var ringHeight = $('#heightInput').val();

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
	console.log(railLength*scale);

	canvas.height = windowWidth*ratio;

	var length = rails.length;
	for ( var i = 0; i < length; i++ ){
		rails.push(newRail("Purple", "red", rails[i].x, rails[i].y));
		stage.removeChild(rails[i]);
		rails.splice( i, 1 );
	}
	update = true;
};

var newRail = function(color, selectColor, x, y) {
	var rect = new createjs.Shape();
	var circle = new createjs.Shape();
	var container = new createjs.Container();
	container.mouseChildren = false;

	rect.graphics.beginFill(color).drawRect(0, 0, railLength*scale, 1.5*scale);
	circle.graphics.beginRadialGradientFill([selectColor, 'rgba(255, 255, 255, 0)'], [0.9,0.1], 0, 0, 0, 0, 0, railLength*scale*1.2)
		.drawCircle( 0, 0, railLength*scale/2 );

	circle.alpha = 0.9;

	rect.regX = railLength*scale/2;
	rect.regY = scale;

	container.x = x;
	container.y = y;

	rect.rotation = 90;

	container.addChild(circle);
	container.addChild(rect);

	container.on("mousedown", function(evt){
		this.offset = {x: this.x - evt.stageX, y: this.y - evt.stageY};
	});

	container.on("click", function(evt){
		if( mode == 0 ){ 
			activeRail = this;
			this.children[0].visible = true;
			update = true;
		}
		else if( mode == 1 ){
			if ( activeRail == null || activeRail == undefined ){
				activeRail = this;
				this.children[0].visible = true;
				update = true;
			} else {
				var startX = activeRail.x;
				var startY = activeRail.y;
				var endX = this.x;
				var endY = this.y;

				var distance = Math.abs( hypoteneus( endX - startX, endY - startY ) );

				$('#measurment').toggleClass('hidden').text(parseFloat(distance / scale).toFixed(2) + ' Feet' );
				measure();
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

	activeRail = container;

	return container;
}

var hypoteneus = function( x, y ){
	return Math.sqrt( (x*x) + (y*y) );
};

var updateList = function(){
	var data = {};
	$('#rails').empty();
	for ( var i = 0; i < rails.length; i++ ){
		data.index = i;
		data.x = parseFloat(rails[i].x/scale).toFixed(2);
		data.y = parseFloat(rails[i].y/scale).toFixed(2);
		data.angle = rails[i].rotation;
		$('#rails').append(template(data));
	}
};

var MouseWheelHandler = function(event){
	var delta = Math.max(-1, Math.min(1, (event.wheelDelta || -event.detail)));
	if( activeRail != null && activeRail != undefined ){
		var rotation = activeRail.rotation;
		rotation += delta*5;
		if ( rotation > 360 ) activeRail.rotation = rotation - 360;
		else if ( rotation < 0 ) activeRail.rotation = rotation + 360;
		else activeRail.rotation = rotation;
		update = true;
	}
	event.preventDefault();
	return false;
};

var measure = function(){
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