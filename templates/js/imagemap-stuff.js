
//TODO validate coords

canvasClass = function () {
    var canvasId,canvasVectors,pictureId,boxId,formsId,boxMarkerCount,areaCount,areaObjects,areaObjectList,formBlueprints;
    
    var mouseIsDown = false;
    var mouseOverCanvas = false;
    var mouseCurrentObjectDrag = -1;
    var mouseCurrentEdgeDrag = -1;
    var mouseCurrentBorderDrag = -1;
    /**
    *  Initialize basic-js Object which handles all the functionality
    * 
    * @param id     container which is supposed to contain all canvas-layers
    * @param picid  container which containes the picture itself
    * @param boxid  container which holds the Markerspoints
    * @param formid container which holds form-blueprints and which is supposed to containe the real forms aswell
    * @usage  external
    */
    this.init = function (id,picid,formid){
        canvasId = "#" + id;
        pictureId = "#" + picid;
        formsId = "#" + formid;
        boxMarkerCount = 0;
        areaCount = 0;
        canvasVectors = new Array();
        areaObjects = new Array();
        areaObjectList = new Array();

        formBlueprints = this.parseFormToBluePrint(formsId);
        $(formsId).empty();
        $(canvasId).width($(pictureId).width()).height($(pictureId).height());
    }
    
    this.mousedown = function(e) {
        var x = e.pageX - $(canvasId).offset().left;
        var y = e.pageY - $(canvasId).offset().top;
        mouseIsDown = true;
        jQuery.each(areaObjectList, function(i, objId) {             
            if(mouseCurrentObjectDrag==-1) {
                var tmp = areaObjects[objId].hitOnObjectEdge(x,y,3);
                if(tmp != -1) {
                    mouseCurrentObjectDrag=objId;
                    mouseCurrentEdgeDrag=tmp;
                }
            }            
        });
    }
    

    this.mouseup = function(e){
        mouseIsDown = false;
        mouseCurrentObjectDrag = -1;
        mouseCurrentEdgeDrag = -1;
    }
    

    this.mousemove = function(e){       
        var x = e.pageX - $(canvasId).offset().left;
        var y = e.pageY - $(canvasId).offset().top;
        
        mouseOverCanvas = true;        
        if(x<0)                         { x=0;                        mouseOverCanvas=false; }
        if(x>$(pictureId).width())     { x=$(pictureId).width();    mouseOverCanvas=false; }
        if(y<0)                         { y=0;                        mouseOverCanvas=false; }
        if(y>$(pictureId).height())    { y=$(pictureId).height();    mouseOverCanvas=false; }
        
        if(mouseCurrentObjectDrag!=-1) {
            mouseCurrentEdgeDrag = areaObjects[mouseCurrentObjectDrag].performResizeAction(mouseCurrentEdgeDrag,x,y);
            this.updateCanvas(mouseCurrentObjectDrag);     
            this.updateForm(mouseCurrentObjectDrag);
        }
    }
    
    /**
    *  Adds a Rectangle-Area Object
    * 
    * @param coords initial coordinates
    * @param linkValue  typolink values
    * @param colorValue the hex-value of the color
    * @usage external
    */
    this.addRectArea = function (coords,linkValue,colorValue,prepend) {
		var tmp = new areaRectClass();
        tmp.init(this,this.getNextId(),coords,linkValue,colorValue);
        areaObjects[tmp.getId()] = tmp;
        areaObjectList.push(tmp.getId());
        if(prepend) {
            $(formsId).prepend(tmp.formMarkup().replace(/OBJID/g,tmp.getId()));
        } else {
            $(formsId).append(tmp.formMarkup().replace(/OBJID/g,tmp.getId()));        
        }
        $(formsId).data("parent",this).sortable({stop:function(e) { $(this).data("parent").updateCanvasLayerOrder(); } });
		areaObjects[tmp.getId()].applyBasicAreaActions($("#" + tmp.getId()));
        this.updateForm(tmp.getId());        
        this.addCanvasLayer(tmp.getId());
        this.updateCanvas(tmp.getId());
        this.updateCanvasLayerOrder();
    }
    
    /**
    *  Adds a Rectangle-Area Object
    * 
    * @param id the area-id which should be removed
    * @usage area*Classes
    */ 
    this.removeArea = function (id) {
        var tmpArr = new Array();
        jQuery.each(areaObjectList, function(i, objId) {
            if(objId!=id) { tmpArr.push(objId); }
        });
        areaObjectList=tmpArr;
        this.removeCanvasLayer(id);
    }

    /**
    *  Creates valid XML from the current Area-Objects
    *
    * @returns XML-String
    * @usage external
    */
	this.persistanceXML = function() {
		var result = "";
        var tmpArr = new Array();
        jQuery.each($(formsId + " > div"), function(i, obj) {
            if(typeof areaObjects[$(obj).attr("id")] != 'undefined') {
                result = result + "\n" + areaObjects[$(obj).attr("id")].persistanceXML();
            }
        });
        return result;
	}

    /**
    *  Removes Markerpoints
    *
    * @param id     the container-id
    * @usage area*Classes
    */
    this.removeMarkerPoint = function(id) {
        $(id).remove();
    }

    /**
    * Add a new canvas-layer and create a new Graphics-Objects.
    * This keeps canvases separate and adds to overall performance.
    *
    * @param id     the canvasId
    * @usage internal
    */
    this.addCanvasLayer = function(id) {
        $(canvasId).append('<div id="' + id + '_canvas" class="canvas"><!-- --></div>');
        canvasVectors[id] = new jsGraphics(id + '_canvas');
    } 

    /**
    *  Re-Paint a canvas-layer for a single Area-Object.
    *
    * @param id     the object-id
    * @usage area*Classes
    */
    this.updateCanvas = function(id) {        
            canvasVectors[id].clear();
            areaObjects[id].drawSelection(canvasVectors[id]);
            canvasVectors[id].paint();
    }

    /**
    * Remove a canvas-layer and make sure that nothing is displayed anymore.
    *
    * @param id     the canvasId
    * @usage internal
    */    
    this.removeCanvasLayer = function(id) {
        canvasVectors[id].clear();
        $('#' + id + '_canvas').remove();
    }

    /**
    * Adjust canvas-layer order analog to the order of the forms
    *
    * @usage internal
    */
    this.updateCanvasLayerOrder = function() {
        var z = 100;
        jQuery.each($(formsId + " > div"), function(i, obj) {
            if(typeof areaObjects[$(obj).attr("id")] != 'undefined') {
                $('#' + $(obj).attr("id") + '_canvas').css("z-index",z--);
            }
        });
    }

    /**
    * Re-Sync the form-data with the Area-Object
    *
    * @param id     the object-id
    * @usage area*Classes
    */    
    this.updateForm = function(id) {
        var data = areaObjects[id].formUpdate();
        jQuery.each(data.split(";"), function(elem, value) {
            var item = value.split("=");
            $("#" + item[0]).attr("value",item[1]);
        });
    }
    
    /**
    * Reload form from blueprint after the linkvalue was updated (Required since Link-Wizard URL need to change).
    *
    * @param id     the object-id
    * @usage external
    */ 
	this.triggerAreaLinkUpdate = function(id)  {
		areaObjects[id].updateStatesFromForm();
        $("#" + areaObjects[id].getFormId()).replaceWith(areaObjects[id].formMarkup().replace(/OBJID/g,id));
		areaObjects[id].applyBasicAreaActions($("#" + id));
        this.updateForm(areaObjects[id].getId());
	}

    /**
    * Generate a new object-id
    *
    * @usage internal
    */ 
    this.getNextId = function() {
        areaCount = areaCount + 1;
        return "Object" + areaCount;
    }

    /**
    * Generate a new markerpoint-id
    *
    * @usage internal
    */ 
    this.getNextMarkerPointId = function() {
        boxMarkerCount = boxMarkerCount + 1;
        return "markerPoint" + boxMarkerCount
    }
    
    /**
    * Provides access to the form-blueprints
    *
    * @param id     the form-id
    * @usage area*Classes
    */ 
    this.getFormBlueprint = function(id) { return formBlueprints[id]; }
    
    /**
    * Parses form-blueprints which contain the basic structur of the different Area-Forms.
    *
    * @param id     the form-id
    * @usage internal
    */ 
    this.parseFormToBluePrint = function(id) {
        var result = new Array();
        $(id + " > div").each(function(elem) {
            result[this.id] = "<div class=\"areaForm " +  this.id + "\" id=\"MAPFORMID\">"+ $("#" + this.id).html() + "</div>";
        });
        return result;
    }

}

areaRectClass = function () {
    var canvasObj,_id,_link,_color,_moreOptionsVisible,_moreOptionsInitFlag;
    var _coords;
	var _colors =
		['ff9999','993366','ff66cc','ff0066','ff00cc','cc0099','cc99ff',
		'cc00cc','cc99cc','9933cc','9966cc','6600cc','6633ff','6666cc','333399',
		'3333ff','3366ff','0000ff','336699','003366','0099cc','0099ff','66ffff',
		'009999','33cccc','006666','33cc99','00ff99','669966','339933','33cc66',
		'009933','ccff99','33ff33','00ff00','009900','66cc00','99cc66','669900',
		'ccff00','333300','666633','ffff99','ffcc00','996600','993300','ff6633',
		'996633','cc9999','ff3333','990000','cc9966', 'eeeeee','999999','666666','333333','000000'];

    // called from canvasClass
    this.init = function(canvas,id,coords,link,color) {
        canvasObj = canvas;
        _id = id;
        _link = link;
		_color = (color && color.match(/^#\S{6}$/g))?color:("#" + _colors[parseInt(Math.random()*57)]);
        _moreOptionsVisible = false;
        _coords = new Array();
    	var tmpCoords = coords.split(",");
        this.setX(tmpCoords[0],tmpCoords[2]);
        this.setY(tmpCoords[1],tmpCoords[3]);
    }

    // called from canvasClass
    this.remove = function() {
        $("#" + this.getFormId()).remove();
        canvasObj.removeArea(this.getId());
    }

    // called from canvasClass
	this.persistanceXML = function() {
		return "<area shape=\"rect\" coords=\""+this.getLeftX()+","+this.getTopY()+","+this.getRightX()+","+this.getBottomY()+"\" color=\""+_color+"\">"+_link+"</area>";
	}

    // called from canvasClass
    this.drawSelection = function(vectorsObj) {
            vectorsObj.setColor(_color);
            vectorsObj.drawRect(this.getLeftX(),this.getTopY(),this.getWidth(),this.getHeight());
            vectorsObj.fillRect(this.getLeftX()-3,this.getTopY()-3,7,7);
            vectorsObj.fillRect(this.getRightX()-3,this.getTopY()-3,7,7);
            vectorsObj.fillRect(this.getRightX()-3,this.getBottomY()-3,7,7);
            vectorsObj.fillRect(this.getLeftX()-3,this.getBottomY()-3,7,7);
            vectorsObj.setColor("#ffffff");
            vectorsObj.fillRect(this.getLeftX()-2,this.getTopY()-2,5,5);
            vectorsObj.fillRect(this.getRightX()-2,this.getTopY()-2,5,5);
            vectorsObj.fillRect(this.getRightX()-2,this.getBottomY()-2,5,5);
            vectorsObj.fillRect(this.getLeftX()-2,this.getBottomY()-2,5,5);
    }

    // called from canvasClass
    this.formMarkup = function(formBlueprints) {
        return canvasObj.getFormBlueprint("rectForm").replace(/MAPFORMID/g,this.getFormId())
                     								 .replace(/MAPAREAVALUE_URL/g,escape(_link))
                     								 .replace(/MAPAREAVALUE/g,_link);
    }

    // called from canvasClass
	// most of the operations can't be called earlier since we need the form-markup to be loaded
    this.applyBasicAreaActions = function(jq) {

    	_moreOptionsInitFlag = false;
        $("#" + this.getFormId() + "_upd").data("area",this).click(function(event) {
            $(this).data("area").updateCoordsFromForm();
        });
        $("#" + this.getFormId() + "_del").data("area",this).click(function(event) {
            $(this).data("area").remove();
        });
        $("#" + this.getFormId() + " > .basicOptions > .exp > img")
        	.data("obj",this)
        	.data("rel","#" + this.getFormId() +" > .moreOptions")
        	.click(function(event) {
                if ($($(this).data("rel")).is(":hidden")) {
                    $($(this).data("rel")).slideDown("fast");
                    $(this).attr("src",$(this).attr("src").replace(/down/,"up"));
                    $(this).data("obj").applyAdditionalAreaActions();
                } else {
                    $($(this).data("rel")).slideUp("fast");
                    $(this).attr("src",$(this).attr("src").replace(/up/,"down"));
                }
        });
        $("#" + this.getFormId() + "_link")
           	.data("obj",this)
    	    .change(function(event) {
    	        $(this).data("obj").updateStatesFromForm();
    	    });

        if(!_moreOptionsVisible)	$("#" + this.getFormId() + " > .moreOptions").hide();
		else						this.applyAdditionalAreaActions();

        this.updateColor(_color,0);
    }

    this.applyAdditionalAreaActions = function() {
    	if(_moreOptionsInitFlag==true) return;
        $("#" + this.getFormId() + "_color > .colorPicker")
        		.data("area",this)
        		.simpleColor({colors:_colors})
        		.click(function(event,data) {
        			if(typeof data == 'undefined') return;
        			$(this).data("area").updateColor(data,1);
        		});
		_moreOptionsInitFlag=true;
    }

    this.updateColor = function(color,updateCanvas) {
  		        _color = color;
		        $("#" + this.getFormId() + "_main > .colorPreview > div").css("backgroundColor", color);
		        $("#" + this.getFormId() + "_color > .colorBox > div").css("backgroundColor", color);
		        if(updateCanvas==1) canvasObj.updateCanvas(this.getId());
    }

    // called from canvasClass
    this.formUpdate = function() {
        return this.getFormId() + "_x1=" + this.getLeftX() + ";" + this.getFormId() + "_y1=" + this.getTopY() + ";" + this.getFormId() + "_x2=" + this.getRightX() + ";" + this.getFormId() + "_y2=" + this.getBottomY() +  ";" + this.getFormId() + "_link=" + _link;
    }
    this.updateCoordsFromForm = function(id) {
        this.setX(parseInt($("#" + this.getFormId() + "_x1").val()), parseInt($("#" + this.getFormId() + "_x2").val()));
        this.setY(parseInt($("#" + this.getFormId() + "_y1").val()), parseInt($("#" + this.getFormId() + "_y2").val()));
        canvasObj.updateCanvas(this.getId());
    }

    // called from canvasClass
    this.updateStatesFromForm = function() {
		_link = document.forms[0].elements[this.getFormId() + "_link"].value;
		_moreOptionsVisible = $("#" + this.getFormId() +" > .moreOptions").is(":visible");
    }

    this.getId = function()         {   return _id;  }
    // called from canvasClass
    this.getFormId = function()     {   return this.getId();   }
  
    this.hitOnObjectEdge = function(mouseX,mouseY,edgeSize) {
        var result = -1;
        if(this.hitEdge(mouseX,mouseY,this.getLeftX(),this.getTopY(),edgeSize)) {
            result = 0;
        } else if(this.hitEdge(mouseX,mouseY,this.getRightX(),this.getTopY(),edgeSize)) {
            result = 1;
        } else if(this.hitEdge(mouseX,mouseY,this.getRightX(),this.getBottomY(),edgeSize)) {
            result = 2;
        } else if(this.hitEdge(mouseX,mouseY,this.getLeftX(),this.getBottomY(),edgeSize)) {
            result = 3;
        }
        return result;
    }
    
    this.hitEdge = function(mX,mY,bX,bY,edgeSize) {    
        return ((Math.abs(mX-bX)<=(edgeSize)) && (Math.abs(mY-bY)<=(edgeSize)));    
    }
    
       
    this.performResizeAction = function(edge,x,y) {
        var tx = this.getLeftX();
        var ty = this.getTopY();
        var tw = this.getWidth();
        var th = this.getHeight();
        /* calculate new size */
        if(edge==0 || edge==3) {    tw = tw-(x-tx);   }
        if(edge==0 || edge==1) {    th = th-(y-ty);   }
        if(edge==2 || edge==1) {    tw = x-tx;  }
        if(edge==2 || edge==3) {    th = y-ty;  }
        if(edge==0 || edge==3) {    tx = x;   }
        if(edge==0 || edge==1) {    ty = y;   }
        /* handle negativ width values */
        if(tw<0) {
            tx=tx+tw;
            tw=-tw;
            if(edge==0) {       edge=1; }
            else if(edge==1) {  edge=0; }
            else if(edge==2) {  edge=3; }
            else if(edge==3) {  edge=2; }
        }
        /* handle negativ height values */
        if(th<0) {
            ty=ty+th;
            th=-th;
            if(edge==0) {       edge=3; }
            else if(edge==1) {  edge=2; }
            else if(edge==2) {  edge=1; }
            else if(edge==3) {  edge=0; }            
        }
        this.setX(tx,tx+tw);
        this.setY(ty,ty+th);
        return edge;
    }
    
    this.getLeftX = function()          {  return parseInt(_coords[0]); }
    this.getTopY = function()          {  return parseInt(_coords[1]);  }
    this.getRightX = function()      {  return parseInt(_coords[2]);  }
    this.getBottomY = function()      {  return parseInt(_coords[3]); }

	this.getWidth = function()	{ return this.getRightX()-this.getLeftX(); }
	this.getHeight = function()	{ return this.getBottomY()-this.getTopY(); }
    
    this.setX = function(x1,x2)   {
          _coords[0] = parseInt(parseInt(x1)>parseInt(x2)?x2:x1);
          _coords[2] = parseInt(parseInt(x1)>parseInt(x2)?x1:x2);
    }
    this.setY = function(y1,y2)   {
          _coords[1] = parseInt(parseInt(y1)>parseInt(y2)?y2:y1);
          _coords[3] = parseInt(parseInt(y1)>parseInt(y2)?y1:y2);  
    }
    this.setW = function(value)     {   var x = this.getLeftX();    this.setX(x,x+value);     }
    this.setH = function(value)     {   var y = this.getTopY();    this.setY(y,y+value);     }
}


