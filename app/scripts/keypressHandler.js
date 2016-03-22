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
		case 8: // backspace
			console.log( 'backspace' );
			if( $(':focus').length < 1 ){
				evt.preventDefault();
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
			$('#align-indicator').removeClass('hide');
			break;
		case 86: // v
			jumpType = 'vertical';
			$('#jumpType').text('Vertical');
			break;
		case 79: // o
			jumpType = 'oxer';
			$('#jumpType').text('Oxer');
			break;
		case 77: // m
		  measureClick();
			break;
		case 80: // p
			pathMeasureClick();
			break;
		case 221: // ]
			if( !jumpStack.isEmpty() ){
				var rotation = rails[jumpStack.peek()].rotation;
				rotation += 5;
				if ( rotation > 180 ) rails[jumpStack.peek()].rotation = rotation - 180;
				else if ( rotation < 0 ) rails[jumpStack.peek()].rotation = rotation + 180;
				else rails[jumpStack.peek()].rotation = rotation;
				update = true;
			}
			break;
		case 219: // [
			if( !jumpStack.isEmpty() ){
				var rotation = rails[jumpStack.peek()].rotation;
				rotation -= 5;
				if ( rotation > 180 ) rails[jumpStack.peek()].rotation = rotation - 180;
				else if ( rotation < 0 ) rails[jumpStack.peek()].rotation = rotation + 180;
				else rails[jumpStack.peek()].rotation = rotation;
				update = true;
			}
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
			modifier.shift = false;
			break;
		case 65: // a
			modifier.alignJumps = false;
			$('#align-indicator').addClass('hide');
			break;
		default: return;
	}
};
