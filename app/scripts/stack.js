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

	this.peek = function( index ){
		var index = typeof index !== 'undefined' ? index : 0; 
		return this.stack[index];
	};

	this.evict = function( obj ){
		var index = $.inArray(obj, this.stack);
		if( index >= 0){ // if the item exists, move it to the top of the stack
			return this.stack.splice(index, 1);
		}
		return undefined;
	};

	this.length = function(){
		return this.stack.length;
	};

	this.replaceFirst = function(obj){
		temp = this.stack[0];
		this.stack[0] = obj;
		return temp;
	};

	this.empty = function(){
		return this.stack.splice(0, this.stack.length );
	};

	this.isEmpty = function(){
		return this.stack.length < 1 ? true : false;
	};

	this.contains = function( obj ){
		var index = $.inArray(obj, this.stack);
		return index >= 0 ? true : false;
	};

	this.sortDescending = function(){
		this.stack.sort(function(a,b) {
		    return b - a;
		});
	}
};