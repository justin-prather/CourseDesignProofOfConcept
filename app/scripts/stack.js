function Stack(){
	this.stack = [];

	this.push = function( obj ){
		var index = $.inArray(obj, this.stack);
		if( index >= 0){ // if the item exists, move it to the top of the stack
			this.stack.splice(index, 1);
		}
		this.stack.push(obj);
	};

	this.pop = function(){
		return this.stack.pop();
	};

	this.length = function(){
		return this.stack.length;
	}
};