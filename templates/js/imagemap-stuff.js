
//TODO validate coords
//TODO implement colorpicker

canvasClass = function () {
    var canvasId,canvasVectors,pictureId,boxId,formsId,boxMarkerCount,areaCount,areaObjects,areaObjectList,formBlueprints;

    this.init = function (id,picid,boxid,formid){
        canvasId = "#" + id;
        pictureId = "#" + picid;
        boxId = "#" + boxid;
        formsId = "#" + formid;
        boxMarkerCount = 0;
        areaCount = 0;
        canvasVectors = new jsGraphics(id);
        areaObjects = new Array();
        areaObjectList = new Array();

        formBlueprints = this.parseFormToBluePrint(formsId);
        $(formsId).empty();
        //TODO: find out where to put this :P
       // $(formsId).append("<span class=\"cc\"><!-- --></span>");
        $(canvasId).width($(pictureId).width()).height($(pictureId).height());
        $(boxId).width($(pictureId).width()+6).height($(pictureId).height()+6);
    }

    // called from outside...
    this.addRectArea = function (coords,linkValue,colorValue) {
		var tmp = new areaRectClass();
        var theId = this.getNextId();
        tmp.init(this,theId,coords,linkValue,colorValue);
        areaObjects[theId] = tmp;
        areaObjectList.push(theId);
        $(formsId).append(tmp.formMarkup().replace(/OBJID/g,theId));
        $(formsId).sortable({});
		areaObjects[theId].applyBasicAreaActions($("#" + theId));
        this.updateCanvas();
        this.updateForm(tmp.getId());
    }

	// called from outside
	this.persistanceXML = function() {
		var result = "";
        var tmpArr = new Array();
        jQuery.each(areaObjectList, function(i, objId) {
			result = result + "\n" + areaObjects[objId].persistanceXML();
        });
        return result;
	}
    // called from area*Class
    this.removeArea = function (id) {
        var tmpArr = new Array();
        jQuery.each(areaObjectList, function(i, objId) {
            if(objId!=id) { tmpArr.push(objId); }
        });
        areaObjectList=tmpArr;
        this.updateCanvas();
    }

    // called from area*Class
    this.addMarkerPoint = function(obj,id,x,y) {
        var markerId = this.getNextBoxMarkerId();
        $(boxId).append("<div class=\"point\" id=\"" + markerId + "\" style=\"left:"+ x +"px;top:"+ y +"px;\"><!-- --></div>");
        $("#" + markerId).data("canvas",obj);
        $("#" + markerId).data("parentId",id);

        $("#" + markerId).draggable({
            containment:'parent',
            refreshPositions:true,
/*
            drag:function(e,ui) {
            	$(this).data("canvas").updateCanvas();
            	$(this).data("canvas").updateForm($(this).data("parentId"));
            },
*/
//            start:function(e,ui) { },
            start:function(e,ui) {
                $(this).everyTime(40,"canvasFn", function() {
                    $(this).data("canvas").updateCanvas();
                    $(this).data("canvas").updateForm($(this).data("parentId"));
                }, 0 , false)

            },

            stop:function(e,ui) {
                $(this).stopTime("canvasFn");
                $(this).data("canvas").updateCanvas();
                $(this).data("canvas").updateForm($(this).data("parentId"));
            }
        });
        return "#" + markerId;
    }
    // called from area*Class
    this.removeMarkerPoint = function(id) {
        $(id).remove();
    }

    // called from area*Class
    this.updateCanvas = function() {
        canvasVectors.clear();
        jQuery.each(areaObjectList, function(i, objId) {
            areaObjects[objId].drawSelection(canvasVectors);
        });
        canvasVectors.paint();
    }
    this.updateForm = function(id) {
        var data = areaObjects[id].formUpdate();
        jQuery.each(data.split(";"), function(elem, value) {
            var item = value.split("=");
            $("#" + item[0]).attr("value",item[1]);
        });
    }

	this.triggerAreaLinkUpdate = function(id)  {
		areaObjects[id].updateStatesFromForm();
        $("#" + areaObjects[id].getFormId()).replaceWith(areaObjects[id].formMarkup().replace(/OBJID/g,id));
		areaObjects[id].applyBasicAreaActions($("#" + id));
        this.updateForm(areaObjects[id].getId());
	}

    this.getNextId = function() {
        areaCount = areaCount + 1;
        return "Object" + areaCount;
    }
    this.getNextBoxMarkerId = function() {
        boxMarkerCount = boxMarkerCount + 1;
        return "markerPoint" + boxMarkerCount
    }

    // called from area*Class
    this.getFormBlueprint = function(id) { return formBlueprints[id]; }

    this.parseFormToBluePrint = function(id) {
        var result = new Array();
        $(id + " > div").each(function(elem) {
            result[this.id] = "<div class=\"areaForm " +  this.id + "\" id=\"MAPFORMID\">"+ $("#" + this.id).html() + "</div>";
        });
        return result;
    }

}

areaRectClass = function () {
    var markers,canvasObj,_id,_link,_color,_moreOptionsVisible,_moreOptionsInitFlag;

	var _colors =
		['990033','ff9999','993366','ff66cc','ff0066','ff00cc','cc0099','cc99ff',
		'cc00cc','cc99cc','9933cc','9966cc','6600cc','6633ff','6666cc','333399',
		'3333ff','3366ff','0000ff','336699','003366','0099cc','0099ff','66ffff',
		'009999','33cccc','006666','33cc99','00ff99','669966','339933','33cc66',
		'009933','ccff99','33ff33','00ff00','009900','66cc00','99cc66','669900',
		'ccff00','333300','666633','ffff99','ffcc00','996600','993300','ff6633',
		'996633','cc9999','ff3333','990000','cc9966','999999','666666','333333','000000'];



    // called from canvasClass
    this.init = function(canvas,id,coords,link,color) {
        canvasObj = canvas;
        _id = id;
        _link = link;
		_color = (color && color.match(/^#\S{6}$/g))?color:("#" + _colors[parseInt(Math.random()*57)]);
        _moreOptionsVisible = false;
    	var tmpcoords = coords.split(",");
    	markers = new Array();
        markers.push(canvasObj.addMarkerPoint(canvasObj,_id,tmpcoords[0],tmpcoords[1]));
        markers.push(canvasObj.addMarkerPoint(canvasObj,_id,tmpcoords[2],tmpcoords[3]));
    }

    // called from canvasClass
    this.remove = function() {
        canvasObj.removeMarkerPoint(markers[0]);
        canvasObj.removeMarkerPoint(markers[1]);
        $("#" + this.getFormId()).remove();
        canvasObj.removeArea(this.getId());
    }

    // called from canvasClass
	this.persistanceXML = function() {
		return "<area shape=\"rect\" coords=\""+this.getLeftX()+","+this.getTopY()+","+this.getRightX()+","+this.getBottomY()+"\" color=\""+_color+"\">"+_link+"</area>";
	}

    // called from canvasClass
    this.drawSelection = function(vectorsObj) {
        vectorsObj.setStroke(1);
        vectorsObj.setColor(_color);
        vectorsObj.drawRect(this.getLeftX(), this.getTopY(), this.getW(),  this.getH());
// removed to get some more performance
//        vectorsObj.setStroke(Stroke.DOTTED);
//        vectorsObj.setColor("#000000");
//        vectorsObj.drawRect(this.getLeftX(), this.getTopY(), this.getW(),  this.getH());
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

//        $(formsId).sortable({containment:"parent"});
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
    	    	//$(this).data("obj").updateLink($(this).val());
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

    this.updateColor = function(color,realChange) {
  		        _color = color;
		        $("#" + this.getFormId() + "_main > .colorPreview > div").css("backgroundColor", color);
		        $("#" + this.getFormId() + "_color > .colorBox > div").css("backgroundColor", color);
		        if(realChange==1) canvasObj.updateCanvas();
    }

    // called from canvasClass
    this.formUpdate = function() {
        return this.getFormId() + "_x1=" + this.getLeftX() + ";" + this.getFormId() + "_y1=" + this.getTopY() + ";" + this.getFormId() + "_x2=" + this.getRightX() + ";" + this.getFormId() + "_y2=" + this.getBottomY() +  ";" + this.getFormId() + "_link=" + _link;
    }
    this.updateCoordsFromForm = function(id) {
        this.setX(parseInt($("#" + this.getFormId() + "_x1").val()), parseInt($("#" + this.getFormId() + "_x2").val()));
        this.setY(parseInt($("#" + this.getFormId() + "_y1").val()), parseInt($("#" + this.getFormId() + "_y2").val()));
        canvasObj.updateCanvas();
    }

    // called from canvasClass
    this.updateStatesFromForm = function() {
		_link = document.forms[0].elements[this.getFormId() + "_link"].value;
		_moreOptionsVisible = $("#" + this.getFormId() +" > .moreOptions").is(":visible");
    }

    this.getId = function()         {   return _id;  }

    // called from canvasClass
    this.getFormId = function()     {   return "area" + this.getId();   }
    this.getLeftX = function()          {   var x1 = $(markers[0]).position().left; var x2 = $(markers[1]).position().left;     return parseInt(x1>x2?x2:x1); }
    this.getTopY = function()          {   var y1 = $(markers[0]).position().top ; var y2 = $(markers[1]).position().top ;     return parseInt(y1>y2?y2:y1); }
    this.getRightX = function()      {   var x1 = $(markers[0]).position().left; var x2 = $(markers[1]).position().left;     return parseInt(x1>x2?x1:x2); }
    this.getBottomY = function()      {   var y1 = $(markers[0]).position().top ; var y2 = $(markers[1]).position().top ;     return parseInt(y1>y2?y1:y2); }

	this.getW = function()	{ return this.getRightX()-this.getLeftX(); }
	this.getH = function()	{ return this.getBottomY()-this.getTopY(); }


    this.setX = function(x1,x2)   {
        $(markers[0]).css("left",parseInt(x1>x2?x2:x1) + "px");
        $(markers[1]).css("left",parseInt(x1>x2?x1:x2) + "px");
    }
    this.setY = function(y1,y2)   {
        $(markers[0]).css("top",parseInt(y1>y2?y2:y1) + "px");
        $(markers[1]).css("top",parseInt(y1>y2?y1:y2) + "px");
    }
    this.setW = function(value)     {   var x = this.getLeftX();    this.setX(x,x+value);     }
    this.setH = function(value)     {   var y = this.getTopY();    this.setY(y,y+value);     }
}


