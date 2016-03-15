var keydownHandler = function(evt){

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
		case 16: // shift
			console.log( 'shift' );
			modifier.shift = true;
			break;
		case 8: // delete
			console.log( 'delete' );
			if( $(':focus').length < 1 ){
				jumpStack.sortDescending();
				for( var i = 0; i < jumpStack.length(); i++ ){
					var index = jumpStack.peek(i);
					stage.removeChild(rails[index]);
					rails.splice( index, 1 );
				}
				jumpStack.empty();
				update = true;
			}
			break;
		case 83: // s
			modifier.snap = !modifier.snap;
			$('#snapping-indicator').toggleClass('hide');
			break;
		case 65: // a
			modifier.alignJumps = true;
			break;
		default:
			console.log(evt.which);
			return;
	}
};

var keyupHandler = function(evt){
	switch( evt.which ){
		case 16:
			// console.log( 'shift' );
			modifier = false;
			break;
		case 65: // a
			modifier.alignJumps = false;
			break;
		default: return;
	}
};
