canvasClass = function () {
    var canvasId,canvasVectors,pictureId,boxId,formsId,boxMarkerCount,areaCount,areaObjects,areaObjectList,formBlueprints,maxW,maxH;
    
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
        maxW = $(pictureId).width();
        maxH = $(pictureId).height();
        formBlueprints = this.parseFormToBluePrint(formsId);
        $(formsId).empty();
        $(canvasId).width($(pictureId).width()).height($(pictureId).height());        
    }
    
    
    /**
    * triggered form the outside whenever the mouse was clicked
    * tries to find the object which relates to the click-event
    *
    * @param Event
    */
    this.mousedown = function(event) {
        var x = event.pageX - $(canvasId).offset().left;
        var y = event.pageY - $(canvasId).offset().top;
        mouseIsDown = true;
        jQuery.each($(formsId + " > div"), function(i, obj) {
            if(mouseCurrentObjectDrag==-1) {
                var tmp = areaObjects[$(this).attr("id")].hitOnObjectEdge(x,y,3);
                if(tmp != -1) {
                    mouseCurrentObjectDrag=$(this).attr("id");
                    mouseCurrentEdgeDrag=tmp;
                    event.stopPropagation();

                }
            } 
        });          
    }    
 
    /**
    * triggered form the outside whenever the mouse was release
    * resets all states
    *
    * @param Event
    */
    this.mouseup = function(event){
        mouseIsDown = false;
        mouseCurrentObjectDrag = -1;
        mouseCurrentEdgeDrag = -1;
    }    

    /**
    * triggered form the outside whenever the mouse was moved
    * validates coordinates and updates current objects (if any)
    *
    * @param Event
    */
    this.mousemove = function(event){       
        var x = event.pageX - $(canvasId).offset().left;
        var y = event.pageY - $(canvasId).offset().top;
        
        mouseOverCanvas = true;        
        if(x<0)                   { x=0;                  mouseOverCanvas=false; }
        if(x>this.getMaxW())     { x=this.getMaxW();    mouseOverCanvas=false; }
        if(y<0)                   { y=0;                  mouseOverCanvas=false; }
        if(y>this.getMaxH())     { y=this.getMaxH();    mouseOverCanvas=false; }
        
        if(mouseCurrentObjectDrag!=-1) {
            mouseCurrentEdgeDrag = areaObjects[mouseCurrentObjectDrag].performResizeAction(mouseCurrentEdgeDrag,x,y);
            this.updateCanvas(mouseCurrentObjectDrag);     
            this.updateForm(mouseCurrentObjectDrag);
            event.stopPropagation();
        }
        return false;
    }

    /**
    *  Adds a Area Object and do all the coupling-stuff with the environment
    * 
    * @param obj the areaObject itself
    * @param coords initial coordinates
    * @param linkValue  typolink values
    * @param colorValue the hex-value of the color
    * @usage external
    */    
    this.addArea = function(obj,coords,labelValue,linkValue,colorValue,prepend) {
        obj.init(this,this.getNextId(),coords,labelValue,linkValue,colorValue);
        areaObjects[obj.getId()] = obj;
        areaObjectList.push(obj.getId());
        if(prepend) {
            $(formsId).prepend(obj.formMarkup().replace(/OBJID/g,obj.getId()));
        } else {
            $(formsId).append(obj.formMarkup().replace(/OBJID/g,obj.getId()));        
        }
        $(formsId).data("parent",this).sortable({
            distance:3, 
            start:function(e) {
                $("#" + $(e.target).attr("id") + " > .sortbtn").css("visibility","hidden");  
                $("#" + $(e.target).attr("id") + " > div > .sortbtn").css("visibility","hidden");            
            },
            stop:function(e) {
                $(this).data("parent").updateCanvasLayerOrder(); 
                $(this).data("parent").fixSortbtnVisibility();
            }
        });
		areaObjects[obj.getId()].applyBasicAreaActions();
        this.updateForm(obj.getId());        
        this.addCanvasLayer(obj.getId());
        this.updateCanvas(obj.getId());
        this.updateCanvasLayerOrder();
        this.fixSortbtnVisibility();    
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
        this.fixSortbtnVisibility();
    }

    /**
    * triggered to move a single areaObject manually up - for assistance of sortable
    *
    * @param id ObjectID
    */
    this.areaUp = function(id) {
        var prev = -1;
        var self = -1;
        jQuery.each($(formsId + " > div"), function(i, obj) {
            if($(obj).attr("id")==id) {
                self = $(obj).attr("id");                
            }
            if(self == -1) {
                prev = $(obj).attr("id");
            }
        });    
        if(prev != -1) {
            $("#" + self).insertBefore("#" + prev);
            this.updateCanvasLayerOrder();
        }
        this.fixSortbtnVisibility();
    }

    /**
    * triggered to move a single areaObject manually down - for assistance of sortable
    *
    * @param id ObjectID
    */
    this.areaDown = function(id) {
        var next = -1;
        var self = -1;
        jQuery.each($(formsId + " > div"), function(i, obj) {
            if((self != -1) && (next == -1)) {
                next = $(obj).attr("id");
            }              
            if($(obj).attr("id")==id) {
                self= $(obj).attr("id");
            }
        });    
        if(next != -1) {
            $("#" + self).insertAfter("#" +next);
            this.updateCanvasLayerOrder();            
        }        
        this.fixSortbtnVisibility();
    }

    /**
    * triggered to show/hide the buttons for manuell sorting (hide if options not available etc..)
    *
    */    
    this.fixSortbtnVisibility = function() {
        $(formsId + " > div > .basicOptions > .sortbtn").css("visibility","visible");
        $(formsId + " > div:first > .basicOptions > .upbtn").css("visibility","hidden");
        $(formsId + " > div:last > .basicOptions > .downbtn").css("visibility","hidden");    
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
                areaObjects[$(obj).attr("id")].updateStatesFromForm();
                result = result + "\n" + areaObjects[$(obj).attr("id")].persistanceXML();
            }
        });
        return result;
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

    this.refreshForm = function(id) {
		areaObjects[id].updateStatesFromForm();
        $("#" + areaObjects[id].getFormId()).replaceWith(areaObjects[id].formMarkup().replace(/OBJID/g,id));
		areaObjects[id].applyBasicAreaActions($("#" + id));
        this.updateForm(areaObjects[id].getId());        
    }

    /**
    * Reload form from blueprint after the linkvalue was updated (Required since Link-Wizard URL need to change).
    *
    * @param id     the object-id
    * @usage external
    */ 
	this.triggerAreaLinkUpdate = function(id)  {
		this.refreshForm(id);
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
            if($(this).attr("class") == "noIdWrap") {
                result[this.id] = $("#" + this.id).html();
            } else {
                result[this.id] = "<div class=\"" +  this.id + " " + $(this).attr("class") + "\" id=\"MAPFORMID\">"+ $("#" + this.id).html() + "</div>";
            }
        });
        return result;
    }
    this.getMaxW = function() {
        return maxW;
    }
    this.getMaxH = function() {
        return maxH;
    }
};