function checkLineIntersection(a,b,c,d,e,f,g,h){var i,j,k,l,m,n={x:null,y:null};return i=(h-f)*(c-a)-(g-e)*(d-b),1e-7>i&&i>-1e-7?n:(j=b-f,k=a-e,l=(g-e)*j-(h-f)*k,m=(c-a)*j-(d-b)*k,j=l/i,k=m/i,n.x=a+j*(c-a),n.y=b+j*(d-b),n)}function Stack(){this.stack=[],this.push=function(a){var b=$.inArray(a,this.stack);b>=0&&this.stack.splice(b,1),this.stack.push(a)},this.pop=function(){return this.stack.pop()},this.peek=function(a){var a="undefined"!=typeof a?a:0;return this.stack[a]},this.evict=function(a){var b=$.inArray(a,this.stack);return b>=0?this.stack.splice(b,1):void 0},this.length=function(){return this.stack.length},this.replaceFirst=function(a){return temp=this.stack[0],this.stack[0]=a,temp},this.empty=function(){return this.stack.splice(0,this.stack.length)},this.isEmpty=function(){return this.stack.length<1?!0:!1},this.contains=function(a){var b=$.inArray(a,this.stack);return b>=0?!0:!1},this.sortDescending=function(){this.stack.sort(function(a,b){return b-a})}}function tick(a){update&&(update=!1,updateList(),stage.update(a))}const STATE_DEFAULT=0,STATE_MEASURE=1,STATE_MEASURE_PATH=2;var keydownHandler=function(a){switch(a.which){case 27:console.log("escape"),mode=STATE_DEFAULT,$("#pathMeasure").removeClass("btn-success"),$("#pathMeasure").addClass("btn-default"),$("#measure").removeClass("btn-success"),$("#measure").addClass("btn-default"),stage.removeChild(measurePath),stage.removeChild(measureCurve),disselectAll(),update=!0;break;case 16:console.log("shift"),modifier=!0;break;case 8:if(console.log("delete"),$(":focus").length<1){jumpStack.sortDescending();for(var b=0;b<jumpStack.length();b++){var c=jumpStack.peek(b);stage.removeChild(rails[c]),rails.splice(c,1)}jumpStack.empty(),update=!0}break;default:return void console.log(a.which)}},keyupHandler=function(a){switch(a.which){case 16:modifier=!1;break;default:return}},hypoteneus=function(a,b){return Math.sqrt(a*a+b*b)},toDegrees=function(a){return a*(180/Math.PI)},toRadians=function(a){return a*(Math.PI/180)},curveLength=function(a,b,c,d,e,f){var g,h,i,j;g=a-2*c+e,h=b-2*d+f,i=2*c-2*a,j=2*d-2*b;var k=4*(g*g+h*h),l=4*(g*i+h*j),m=i*i+j*j,n=2*Math.sqrt(k+l+m),o=Math.sqrt(k),p=2*k*o,q=2*Math.sqrt(m),r=l/o,s=(p*n+o*l*(n-q)+(4*m*k-l*l)*Math.log((2*o+r+n)/(r+q)))/(4*p);return s},isStraightLine=function(a,b){if(a.rotation==b.rotation){console.log("same angle");var c=a.rotation+90,d=hypoteneus(a.x-b.x,a.y-b.y);if(c%90==0)if(c%180){if(a.x==b.x)return console.log("jumping vertically"),d}else if(a.y==b.y)return console.log("jumping horizontally"),d;var e=toRadians(c),f=d*Math.sin(e),g=d*Math.cos(e),h=toFiveDecimals(b.x.toFixed(5)),i=toFiveDecimals(b.y.toFixed(5));return console.log("Distance: "+d+" Vertical: "+f+" Horizontal: "+g+"calc distance: "+hypoteneus(g,f)),toFiveDecimals(a.x+g)==h&&toFiveDecimals(a.y+f)==i?(console.log("inline "),d):toFiveDecimals(a.x-g)==h&&toFiveDecimals(a.y-f)==i?(console.log("inline "),d):toFiveDecimals(a.x+g)==h&&toFiveDecimals(a.y-f)==i?(console.log("inline "),d):toFiveDecimals(a.x-g)==h&&toFiveDecimals(a.y+f)==i?(console.log("inline "),d):null}},toFiveDecimals=function(a){return Number(parseFloat(a).toFixed(5))},jumps={vertical:function(a,b,c,d,e,f,g,h,i){h="undefined"!=typeof h?h:0,i="undefined"!=typeof i?i:!0,f=0,g="undefined"!=typeof g?g:railLength;var j=new createjs.Shape,k=new createjs.Shape,l=new createjs.Container;return l.mouseChildren=!1,j.graphics.beginFill(b).drawRect(0,0,g*scale,1.5*scale),k.graphics.beginRadialGradientFill([c,"rgba(255, 255, 255, 0)"],[.9,.1],0,0,0,0,0,g*scale*1.2).drawCircle(0,0,g*scale/2),k.alpha=.9,j.regX=g*scale/2,j.regY=1.5*scale/2,l.x=d,l.y=e,l.addChild(k),l.addChild(j),l.rotation=h,l.on("mousedown",function(a){onContainerMouseDown(a)}),l.on("click",function(a){onContainerClick(a)}),l.on("pressmove",function(a){onContainerPressMove(a)}),stage.addChild(l),k.visible=!1,i&&(jumpStack.replaceFirst(rails.length),k.visible=!0),l.index=a,l.type="vertical",l.spread=f,l.rLength=g,l.offset={x:0,y:0},l.select=k,l},oxer:function(a,b,c,d,e,f,g,h,i){h="undefined"!=typeof h?h:0,i="undefined"!=typeof i?i:!0,g="undefined"!=typeof g?g:railLength;var j=new createjs.Shape,k=new createjs.Shape,l=new createjs.Shape,m=new createjs.Shape,n=new createjs.Container;return n.mouseChildren=!1,j.graphics.beginFill(b).drawRect(0,0,g*scale,1.5*scale),k.graphics.beginFill(b).drawRect(0,0,g*scale,1.5*scale),l.graphics.beginFill("White").drawRect(0,0,g*scale,f*scale),m.graphics.beginRadialGradientFill([c,"rgba(255, 255, 255, 0)"],[.9,.1],0,0,0,0,0,g*scale*1.2).drawCircle(0,0,g*scale/2*(1+.5*f/g)),m.alpha=.9,j.regX=g*scale/2,j.regY=1.5*scale/2+f*scale/2,k.regX=g*scale/2,k.regY=1.5*scale/2-f*scale/2,l.regX=g*scale/2,l.regY=f*scale/2,n.x=d,n.y=e,n.addChild(l),n.addChild(m),n.addChild(j),n.addChild(k),n.rotation=h,n.on("mousedown",function(a){onContainerMouseDown(a)}),n.on("click",function(a){onContainerClick(a)}),n.on("pressmove",function(a){onContainerPressMove(a)}),stage.addChild(n),m.visible=!1,i&&(jumpStack.replaceFirst(rails.length),m.visible=!0),n.index=a,n.type="oxer",n.spread=f,n.rLength=g,n.offset={x:0,y:0},n.select=m,n}},onContainerMouseDown=function(a){lastMousePos={x:a.stageX,y:a.stageY},a.target.offset={x:a.target.x-a.stageX,y:a.target.y-a.stageY},mode==STATE_DEFAULT&&(console.log(modifier),1==modifier?(jumpStack.push(a.target.index),console.log("pushed")):(jumpStack.replaceFirst(a.target.index),console.log("replaced")),a.target.select.visible=!0,update=!0)},onContainerClick=function(a){if(mode==STATE_MEASURE){jumpStack.push(a.target.index),a.target.select.visible=!0;var b=0,c=new createjs.Shape;c.graphics.setStrokeStyle(1),c.graphics.beginStroke("Black");for(var d=1;d<jumpStack.length();d++){var e=rails[jumpStack.peek(d-1)].x,f=rails[jumpStack.peek(d-1)].y,g=rails[jumpStack.peek(d)].x,h=rails[jumpStack.peek(d)].y;c.graphics.moveTo(e,f),c.graphics.lineTo(g,h),b+=Math.abs(hypoteneus(g-e,h-f))}stage.removeChild(measurePath),c.graphics.endStroke(),stage.addChild(c),measurePath=c,$("#measurment").text(parseFloat(b/scale).toFixed(2)+" Feet"),update=!0}else if(mode==STATE_MEASURE_PATH){jumpStack.push(a.target.index),a.target.select.visible=!0;var i=0,j=new createjs.Shape;j.graphics.setStrokeStyle(1),j.graphics.beginStroke("Black");for(var d=1;d<jumpStack.length();d++){var k=rails[jumpStack.peek(d-1)].x,l=rails[jumpStack.peek(d-1)].y,m=k+50*Math.cos(toRadians(rails[jumpStack.peek(d-1)].rotation+90)),n=l+50*Math.sin(toRadians(rails[jumpStack.peek(d-1)].rotation+90)),o=rails[jumpStack.peek(d)].x,p=rails[jumpStack.peek(d)].y,q=o+50*Math.cos(toRadians(rails[jumpStack.peek(d)].rotation+90)),r=p+50*Math.sin(toRadians(rails[jumpStack.peek(d)].rotation+90)),s=checkLineIntersection(k,l,m,n,o,p,q,r);if(j.graphics.moveTo(k,l),s.x&&s.y)j.graphics.quadraticCurveTo(s.x,s.y,o,p),i+=curveLength(k,l,s.x,s.y,o,p)-rails[jumpStack.peek(d-1)].spread*scale/2-rails[jumpStack.peek(d)].spread*scale/2,console.log("Curve Length: "+i/scale);else{var b=isStraightLine(rails[jumpStack.peek(d-1)],rails[jumpStack.peek(d)]);b&&(j.graphics.lineTo(o,p),i+=b-rails[jumpStack.peek(d-1)].spread*scale/2-rails[jumpStack.peek(d)].spread*scale/2)}}stage.removeChild(measureCurve),j.graphics.endStroke(),stage.addChild(j),measureCurve=j,$("#pathMeasurment").text(parseFloat(i/scale).toFixed(2)+" Feet"),update=!0}},onContainerPressMove=function(a){if(modifier){for(var b=a.stageX-lastMousePos.x,c=a.stageY-lastMousePos.y,d=0;d<jumpStack.length();d++){var e=rails[jumpStack.peek(d)];e.x=b+e.x,e.y=c+e.y}lastMousePos={x:a.stageX,y:a.stageY}}else a.target.x=a.stageX+a.target.offset.x,a.target.y=a.stageY+a.target.offset.y;update=!0},update=!1,canvas,stage,scale,railLength,spread,template,jumpType="vertical",measurePath,measureCurve,jumpStack=new Stack,rails=[],dblClick=!1,mode=STATE_DEFAULT,modifier=!1,lastMousePos={};$(function(){template=Handlebars.compile($("#rails-template").html()),$("#submit").click(setRingParams),$("#measure").click(measureClick),$("#pathMeasure").click(pathMeasureClick),canvas=document.getElementById("demoCanvas"),canvas.addEventListener("mousewheel",MouseWheelHandler,!1),setRingParams(),stage=new createjs.Stage(canvas),createjs.Touch.enable(stage),stage.on("stagemousedown",function(a){if(dblClick){if(mode==STATE_DEFAULT&&1!=modifier){var b=jumps[jumpType](rails.length,"Purple","red",a.stageX,a.stageY,spread);rails.push(b)}}else dblClick=!0,setTimeout(function(){dblClick=!1},200),mode==STATE_DEFAULT&&1!=modifier&&disselectAll();update=!0}),window.onkeydown=keydownHandler,window.onkeyup=keyupHandler,$("#rails").on("click",".delete",function(){var a=event.target,b=$(a).parent().parent().attr("id");stage.removeChild(rails[b]),rails.splice(b,1),jumpStack.evict(b),update=!0}),$("#rails").on("click",".update",function(){var a=event.target,b=$(a).parent().parent().attr("id"),c=Number($("#xCoordinate"+b).val())*scale,d=Number($("#yCoordinate"+b).val())*scale,e=Number($("#spread"+b).val()),f=Number($("#angle"+b).val()),g=Number($("#railLength"+b).val()),h=rails[b];h.spread!=e||h.rLength!=g?(stage.removeChild(h),h=jumps[jumpType](rails.length,"Purple","red",c,d,e,g,f,!0),rails[b]=h,jumpStack.replaceFirst(b)):(h.x=c,h.y=d,h.spread=e,h.rotation=f),update=!0}),$("#jumpTypes").on("click","a",function(){event.preventDefault();var a=event.target;jumpType=$(a).attr("id"),$("#jumpType").text($(a).text())}),stage.update(),createjs.Ticker.addEventListener("tick",tick)});var setRingParams=function(){var a=Number($("#widthInput").val()),b=Number($("#heightInput").val()),c=scale;if(b>a){var d=a;a=b,b=d,$("#widthInput").val(a),$("#heightInput").val(b)}railLength=$("#railLength").val(),spread=$("#spread").val();var e=b/a,f=$(".container").width();canvas.width=f,scale=f/a,canvas.height=f*e,jumpStack.empty();for(var g=rails.length,h=[],i=0;g>i;i++){var j=rails[i];h.push(jumps[j.type](i,"Purple","red",j.x/c*scale,j.y/c*scale,j.spread,j.rLength,j.rotation,!1)),stage.removeChild(j)}rails=h,update=!0},updateList=function(){var a={};$("#rails").empty();for(var b=0;b<rails.length;b++)a.index=b,a.x=parseFloat(rails[b].x/scale).toFixed(2),a.y=parseFloat(rails[b].y/scale).toFixed(2),a.angle=rails[b].rotation,a["class"]=jumpStack.contains(b)?"selected":"",a.spread=rails[b].spread,a.railLength=rails[b].rLength,$("#rails").append(template(a))},MouseWheelHandler=function(a){var b=Math.max(-1,Math.min(1,a.wheelDelta||-a.detail));if(!jumpStack.isEmpty()){var c=rails[jumpStack.peek()].rotation;c+=b,c>180?rails[jumpStack.peek()].rotation=c-180:0>c?rails[jumpStack.peek()].rotation=c+180:rails[jumpStack.peek()].rotation=c,update=!0}return a.preventDefault(),!1},measureClick=function(){mode!=STATE_MEASURE?(mode=STATE_MEASURE,$("#measure").addClass("btn-success"),$("#measure").removeClass("btn-default")):(mode=STATE_DEFAULT,$("#measure").removeClass("btn-success"),$("#measure").addClass("btn-default"),stage.removeChild(measurePath),disselectAll(),update=!0)},pathMeasureClick=function(){mode!=STATE_MEASURE_PATH?(mode=STATE_MEASURE_PATH,$("#pathMeasure").addClass("btn-success"),$("#pathMeasure").removeClass("btn-default")):(mode=STATE_DEFAULT,$("#pathMeasure").removeClass("btn-success"),$("#pathMeasure").addClass("btn-default"),stage.removeChild(measureCurve),disselectAll(),update=!0)},disselectAll=function(){for(;!jumpStack.isEmpty();)rails[jumpStack.pop()].select.visible=!1};