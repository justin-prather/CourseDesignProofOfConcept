var update = false;
var canvas, stage;
var scale, railLength;
var template;

var activeRail;

var rails = [];

var dblClick = false;

var setRingParams = function(){
	var ringWidth = $('#widthInput').val();
	var ringHeight = $('#heightInput').val();
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

$(function(){

	template = Handlebars.compile($('#rails-template').html());

	$('#submit').click( setRingParams );
	
	canvas = document.getElementById('demoCanvas');
	canvas.addEventListener("mousewheel", MouseWheelHandler, false);
	setRingParams();

	stage = new createjs.Stage(canvas);

	stage.addEventListener("stagemousedown", function(event){
		if( !dblClick ){
			dblClick = true;
			setTimeout(function(){ dblClick = false}, 200);
			activeRail = null;
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

var newRail = function(color, selectColor, x, y) {
	var rect = new createjs.Shape();
	var circle = new createjs.Shape();

	rect.graphics.beginFill(color).drawRect(0, 0, railLength*scale, 1.5*scale);
	circle.graphics.beginFill(selectColor).drawCircle( 0, 0, railLength*scale/2 );

	circle.alpha = 0.3;
	circle.visible = false;

	rect.regX = railLength*scale/2;
	rect.regY = scale;

	rect.x = circle.x = x;
	rect.y = circle.y = y;

	rect.rotation = 90;

	rect.on("mousedown", function(evt){
		this.offset = {x: this.x - evt.stageX, y: this.y - evt.stageY};
	});

	rect.on("click", function(evt){
		console.log('hello');
		activeRail = this;
	});

	// the pressmove event is dispatched when the mouse moves after a mousedown on the target until the mouse is released.
	rect.on("pressmove", function (evt) {
		this.x = evt.stageX + this.offset.x;
		this.y = evt.stageY + this.offset.y;
		// indicate that the stage should be updated on the next tick:
		update = true;
	});

	stage.addChild(circle);
	stage.addChild(rect);

	return rect;
}

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