'use strict';
var update = false;
var canvas, stage;
var scale, railLength, spread;
var template;
var jumpType = 'vertical';

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

	stage.on("stagemousedown", function(event){
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
			var nRail = jumps[jumpType](rails.length, "Purple", "red", event.stageX, event.stageY, spread);
			rails.push( nRail );
			update = true;
		}
	});

	$('#rails').on( 'click', '.delete', function(){
		var btn = event.target;
		var index = $(btn).parent().parent().attr('id');

		stage.removeChild(rails[index]);
		rails.splice( index, 1 );
		activeRail = -1;
		update = true;
	});

	$('#rails').on( 'click', '.update', function(){
		var btn = event.target;
		var index = $(btn).parent().parent().attr('id');

		var x =  Number($('#xCoordinate'+index).val())*scale;
		var y =  Number($('#yCoordinate'+index).val())*scale;
		var spread =  Number($('#spread'+index).val());
		var rotation =  Number($('#angle'+index).val());
		var rLength =  Number($('#railLength'+index).val());

		var jump = rails[index];
		if( jump.spread != spread  || jump.rLength != rLength){
			stage.removeChild(jump);
			jump = jumps[jumpType](rails.length, "Purple", "red", x, y, spread, rLength, rotation, true);
			rails[index] = jump;
			activeRail = index;
		} else{
			jump.x =  x;
			jump.y =  y;
			jump.spread =  spread;
			jump.rotation =  rotation;
		}

		update = true;
	});

	$('#jumpTypes').on( 'click', 'a', function(){
		event.preventDefault();
		var type = event.target;
		jumpType = $(type).attr('id');
		$('#jumpType').text($(type).text());
	});

	stage.update();

	createjs.Ticker.addEventListener("tick", tick);
});

var setRingParams = function(){
	var ringWidth = Number($('#widthInput').val());
	var ringHeight = Number($('#heightInput').val());
	var oldScale = scale;

	if( ringHeight > ringWidth ){
		var temp = ringWidth;
		ringWidth = ringHeight;
		ringHeight = temp;
		$('#widthInput').val(ringWidth);
		$('#heightInput').val(ringHeight);
	}

	railLength = $('#railLength').val();
	spread = $('#spread').val();
	var ratio = ringHeight/ringWidth;

	var windowWidth = $('.container').width();
	canvas.width = windowWidth;

	scale = windowWidth/ringWidth;

	canvas.height = windowWidth*ratio;

	activeRail = -1; 

	var length = rails.length;
	var tempRails = [];
	for ( var i = 0; i < length; i++ ){
		var jump = rails[i];
		tempRails.push(jumps[jump.type](i, "Purple", "red", jump.x/oldScale*scale, jump.y/oldScale*scale,
			jump.spread, jump.rLength, jump.rotation, false));
		stage.removeChild(jump);
	}
	rails = tempRails;
	update = true;
};

var updateList = function(){
	var data = {};
	$('#rails').empty();
	for ( var i = 0; i < rails.length; i++ ){
		data.index = i;
		data.x = parseFloat(rails[i].x/scale).toFixed(2);
		data.y = parseFloat(rails[i].y/scale).toFixed(2);
		data.angle = rails[i].rotation;
		data.class = activeRail == i ? 'selected' : '';
		data.spread = rails[i].spread;
		data.railLength = rails[i].rLength
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