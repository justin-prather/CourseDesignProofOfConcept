var update = false;
var canvas, stage;
var scale, railLength;

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

	update = true;
};

$(function(){

	$('#submit').click( setRingParams );
	
	canvas = document.getElementById('demoCanvas');
	canvas.addEventListener("mousewheel", MouseWheelHandler, false);
	setRingParams();

	console.log(canvas);
	stage = new createjs.Stage(canvas);

	stage.addEventListener("stagemousedown", function(event){
		if( !dblClick ){
			dblClick = true;
			setTimeout(function(){ dblClick = false}, 200);
		}
		else{
			rails.push(newRail("Red", event.stageX, event.stageY));
			update = true;
		}
	});

	stage.update();

	createjs.Ticker.addEventListener("tick", tick);
});

function tick(event) {
	// this set makes it so the stage only re-renders when an event handler indicates a change has happened.
	if (update) {
		update = false; // only update once
		stage.update(event);
	}
}

var newRail = function(color, x, y) {
	var rect = new createjs.Shape();
	rect.graphics.beginFill(color).drawRect(0, 0, railLength*scale, 2*scale);

	rect.regX = railLength*scale/2;
	rect.regY = scale;

	rect.x = x;
	rect.y = y;

	rect.rotation = 90;

	rect.on("mousedown", function(evt){
		this.offset = {x: this.x - evt.stageX, y: this.y - evt.stageY};
		activeRail = this;
	});

	rect.on("mouseup", function(evt){
		activeRail = null;
	});

	// the pressmove event is dispatched when the mouse moves after a mousedown on the target until the mouse is released.
	rect.on("pressmove", function (evt) {
		this.x = evt.stageX + this.offset.x;
		this.y = evt.stageY + this.offset.y;
		// indicate that the stage should be updated on the next tick:
		update = true;
	});

	stage.addChild(rect);
	return rect;
}

var MouseWheelHandler = function(event){
	var delta = Math.max(-1, Math.min(1, (event.wheelDelta || -event.detail)));
	if( activeRail != null && activeRail != undefined ){
		activeRail.rotation += delta*5;
	}
	event.preventDefault();
	return false;
};