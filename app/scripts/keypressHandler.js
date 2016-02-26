var keydownHandler = function(evt){
	console.log(evt.which);

	switch( evt.which ){
		case 27: // escape
			console.log( 'escape' );
			mode = STATE_DEFAULT;
			$('#pathMeasure').removeClass('btn-success');
			$('#pathMeasure').addClass('btn-default');
			$('#measure').removeClass('btn-success');
			$('#measure').addClass('btn-default');
			stage.removeChild(measurePath);
			stage.removeChild(measureCurve);
			disselectAll();
			update = true;
			break;
		case 16: 
			console.log( 'shift' );
			modifier = true;
			break;
		default: return;
	}
};

var keyupHandler = function(evt){
	console.log(evt.which);

	switch( evt.which ){
		case 16: 
			console.log( 'shift' );
			modifier = false;
			break;
		default: return;
	}
};