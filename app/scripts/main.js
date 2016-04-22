'use strict';
var update = false;
var canvas, stage;
var scale, railLength, spread, snap, gridSpacing;
var template;
var jumpType = 'vertical';
var measurePath, measureCurve, gridLines;

var jumpStack = new Stack();


var rails = [];

var dblClick = false;
/*
	0 = normal
	1 = measure
*/
var mode = STATE_DEFAULT;
var modifier = { shift: false, snap: false, alignJumps: false };
var lastMousePos = {};

$(function(){

	template = Handlebars.compile($('#rails-template').html());
	$('[data-toggle="tooltip"]').tooltip();

	$('#submit').click( setRingParams );
	$('#measure').click( measureClick );
	$('#pathMeasure').click( pathMeasureClick );
	$('#save').click( saveClick );
	$('#toggle-left-sidebar').click( function(){
		disselectAll();
		updateList();
		$('#toggle-left-sidebar span').toggleClass('glyphicon-chevron-right').toggleClass('glyphicon-chevron-left');
		$('#sidebar_left').toggleClass('open').toggleClass('closed');
		$('.jump-info-row *').on('focus', function(evt){
			var parent = $(evt.target).closest('.jump-info-row');
			parent.addClass('selected');
			console.log(Number(parent.attr('id')))
			jumpStack.replaceFirst(Number(parent.attr('id')));
			rails[Number(parent.attr('id'))].select.visible = true;
			update = true;
		}).on('blur', function(evt){
			var parent = $(evt.target).closest('.jump-info-row');
			parent.removeClass('selected');
			jumpStack.evict(Number(parent.attr('id')));
			rails[Number(parent.attr('id'))].select.visible = false;
			update = true;
		});
	});

	canvas = document.getElementById('demoCanvas');
	canvas.addEventListener("mousewheel", MouseWheelHandler, false);

	stage = new createjs.Stage(canvas);
	createjs.Touch.enable(stage);

	setRingParams();

	stage.on("stagemousedown", function(event){
		if( !dblClick ){
			dblClick = true;
			setTimeout(function(){ dblClick = false}, 200);

			if( mode == STATE_DEFAULT && modifier.shift != true && modifier.alignJumps != true){
				disselectAll();
			}
		}
		else if( mode == STATE_DEFAULT && modifier.shift != true ){
			var nRail = jumps[jumpType](rails.length, "Purple", "red", event.stageX, event.stageY, spread);
			rails.push( nRail );
		}
		update = true;
	});

	window.onkeydown = keydownHandler;
	window.onkeyup = keyupHandler;

	$('#delete').on( 'click', function(){
		jumpStack.sortDescending();
		for( var i = 0; i < jumpStack.length(); i++ ){
			var index = jumpStack.peek(i);
			stage.removeChild(rails[index]);
			rails.splice( index, 1 );
		}
		jumpStack.empty();
		update = true;
	});

	$('#rails').on( 'click', '.update', function(){
		var btn = event.target;
		var index = $(btn).closest('.jump-info-row').attr('id');

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
			jumpStack.replaceFirst(index);
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
		$('#jumpType').removeClass();
		$('#jumpType').addClass(jumpType);
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
	spread = Number($('#spread').val());
	snap = Number($('#snap').val());
	gridSpacing = Number($('#grid').val());
	var ratio = ringHeight/ringWidth;

	var windowWidth = $('.canvas-wrapper').width();
	var windowHeight = $('.canvas-wrapper').height();
	console.log( windowHeight );

	scale = windowWidth/ringWidth;

	if( windowWidth*ratio < windowHeight ){
		canvas.width = windowWidth;
		canvas.height = windowWidth*ratio;
	} else {
		canvas.height = windowHeight;
		canvas.width = windowHeight*ratio;
	}

	drawGrid( gridSpacing * scale );

	jumpStack.empty();

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
		data.class = jumpStack.contains(i) ? 'selected' : '';
		data.spread = rails[i].spread;
		data.railLength = rails[i].rLength
		data.humanIndex = i+1;
		$('#rails').append(template(data));
	}
};

var MouseWheelHandler = function(event){
	var delta = Math.max(-1, Math.min(1, (event.wheelDelta || -event.detail)));
	if( !jumpStack.isEmpty() ){
		var rotation = rails[jumpStack.peek()].rotation;
		rotation += delta;
		if ( rotation > 180 ) rails[jumpStack.peek()].rotation = rotation - 180;
		else if ( rotation < 0 ) rails[jumpStack.peek()].rotation = rotation + 180;
		else rails[jumpStack.peek()].rotation = rotation;
		update = true;
	}
	event.preventDefault();
	return false;
};

var measureClick = function(){
	if ( mode != STATE_MEASURE ){
		mode = STATE_MEASURE;
		$('#measure').addClass('btn-active');
	} else {
		mode = STATE_DEFAULT;
		$('#measure').removeClass('btn-active');
		stage.removeChild(measurePath);
		disselectAll();
		update = true;
	}
}

var pathMeasureClick = function(){
	if ( mode != STATE_MEASURE_PATH ){
		mode = STATE_MEASURE_PATH;
		$('#pathMeasure').addClass('btn-active');
	} else {
		mode = STATE_DEFAULT;
		$('#pathMeasure').removeClass('btn-active');
		stage.removeChild(measureCurve);
		disselectAll();
		update = true;
	}
}

var saveClick = function(){
	disselectAll();
	$('#save-anchor').attr('href', canvas.toDataURL('image/png'));
	$('#save-anchor')[0].click();
	console.log('save');
}

var disselectAll = function(){
	while ( !jumpStack.isEmpty() ){
		rails[jumpStack.pop()].select.visible = false;
	}
	update = true;
}

var drawGrid = function( spacing ){
	var grid = new createjs.Shape();

	var rect = new createjs.Shape();
	rect.graphics.beginFill('#FFFFFF').drawRect(0, 0, canvas.width, canvas.height);
	stage.addChild(rect);

	grid.graphics.setStrokeStyle(1);
	grid.graphics.beginStroke('#CCCCCC');

	for( var i = 0; i < canvas.height; i += spacing ){
		grid.graphics.moveTo(0,i);
		grid.graphics.lineTo(canvas.width, i);
	}

	for( var i = 0; i < canvas.width; i += spacing ){
		grid.graphics.moveTo(i,0);
		grid.graphics.lineTo(i, canvas.height);
	}

	grid.graphics.endStroke();

	grid.graphics.beginStroke('#000000');
	grid.graphics.moveTo( 0, 0 );
	grid.graphics.lineTo(canvas.width, 0);
	grid.graphics.lineTo(canvas.width, canvas.height);
	grid.graphics.lineTo(0, canvas.height);
	grid.graphics.lineTo(0, 0);
	stage.removeChild(gridLines);
	stage.addChild(grid);
	gridLines = grid;
}

function tick(event) {
	// this set makes it so the stage only re-renders when an event handler indicates a change has happened.
	if (update) {
		update = false; // only update once
		stage.update(event);
	}
}
