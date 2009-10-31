/***************************************************************
*  Copyright notice
*
*  (c) 2008 Tolleiv Nietsch (info@tolleiv.de)
*  All rights reserved
*
*  This script is part of the TYPO3 project. The TYPO3 project is
*  free software; you can redistribute it and/or modify
*  it under the terms of the GNU General Public License as published by
*  the Free Software Foundation; either version 2 of the License, or
*  (at your option) any later version.
*
*  The GNU General Public License can be found at
*  http://www.gnu.org/copyleft/gpl.html.
*
*  This script is distributed in the hope that it will be useful,
*  but WITHOUT ANY WARRANTY; without even the implied warranty of
*  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
*  GNU General Public License for more details.
*
*  This copyright notice MUST APPEAR in all copies of the script!
***************************************************************/

var canvasClass = Class.extend({
    canvasId:null,
    canvasVectors:null,
    pictureId:null,
    imageId:null,
    boxId:null,
    formsId:null,
    boxMarkerCount:null,
    areaCount:null,
    areaObjects:null,
    areaObjectList:null,
    formBlueprints:null,
    scaleFactor:1,
    imageOrigW:null,
    imageOrigH:null,
    mouseIsDown:false,
    mouseOverCanvas:false,
    mouseCurrentObjectDrag:-1,
    mouseCurrentEdgeDrag:-1,
    mouseCurrentBorderDrag:-1,
    mouseCurrentBorderDragX:-1,
    mouseCurrentBorderDragY:-1,
    /**
    *  Initialize basic-js Object which handles all the functionality
    * 
    * @param id     container which is supposed to contain all canvas-layers
    * @param picid  container which containes the picture itself
    * @param boxid  container which holds the Markerspoints
    * @param formid container which holds form-blueprints and which is supposed to containe the real forms aswell
    * @usage  external
    */
    init: function (id,picid,formid) {
        if(id == undefined || picid == undefined || formid == undefined) return false;
        this.canvasId = "#" + id;
        this.pictureId = "#" + picid;
        this.formsId = "#" + formid;
        this.boxMarkerCount = 0;
        this.areaCount = 0;
        this.canvasVectors = new Object();
        this.areaObjects = new Object();
        this.areaObjectList = new Array();
        this.imageOrigW = parseInt(jQuery(this.pictureId + " > #image > img").attr("width"));
        this.imageOrigH = parseInt(jQuery(this.pictureId + " > #image > img").attr("height"));
        this.formBlueprints = this.parseFormToBluePrint(this.formsId);
        jQuery(this.formsId).empty();
        this.setScale(1);
    },
    
    initializeScaling: function(maxWH) {
        var factW = parseInt(maxWH)/this.imageOrigW;
        var factH = parseInt(maxWH)/this.imageOrigH;
        // we're not scaling the image directly because there might be some session-interaction afterwards...
        return (factW>factH)?factH:factW;
    },
    
    setScale: function(scale) {
        this.scaleFactor = ((scale>1)?1:scale);
        jQuery(this.pictureId + " > #image > img").width(this.getMaxW());
        jQuery(this.pictureId + " > #image > img").height(this.getMaxH());
        jQuery(this.pictureId).width(this.getMaxW());
        jQuery(this.pictureId).height(this.getMaxH());
        var that = this;
        jQuery.each(this.areaObjectList, function(i, objId) {
            that.areaObjects[objId].setScale(that.scaleFactor);
            that.updateCanvas(objId);
        });      
        jQuery(this.canvasId).width(this.getMaxW()).height(this.getMaxH());                
    },
    
    /**
    * triggered form the outside whenever the mouse was clicked
    * tries to find the object which relates to the click-event
    *
    * @param Event
    */
    mousedown: function(event) {
        var x = event.pageX - jQuery(this.canvasId).offset().left;
        var y = event.pageY - jQuery(this.canvasId).offset().top;
        this.mouseIsDown = true;
        var that = this;
        jQuery.each(jQuery(this.formsId + " > div"), function(i, obj) {
            if((that.mouseCurrentObjectDrag==-1) && (that.mouseCurrentEdgeDrag==-1))  {
                var tmp = that.areaObjects[jQuery(this).attr("id")].hitOnObjectEdge(x,y,3);
                if(tmp != -1) {
                	that.areaObjects[jQuery(this).attr("id")].pushUndoableAction();
                    that.mouseCurrentObjectDrag=jQuery(this).attr("id");
                    that.mouseCurrentEdgeDrag=tmp;
                    event.stopPropagation();
                }
            }
            if((that.mouseCurrentObjectDrag==-1) && (that.mouseCurrentBorderDrag==-1)) {
                var tmp = that.areaObjects[jQuery(this).attr("id")].hitOnObjectBorder(x,y,5);
                if(tmp != -1) {
                	that.areaObjects[jQuery(this).attr("id")].pushUndoableAction();
                    that.mouseCurrentObjectDrag=jQuery(this).attr("id");
                    that.mouseCurrentBorderDrag=tmp;
                    that.mouseCurrentBorderDragX = x;
                    that.mouseCurrentBorderDragY = y;
                    event.stopPropagation();
                }
            }
        });
        return false;
    },    
 
    /**
    * triggered form the outside whenever the mouse was release
    * resets all states
    *
    * @param Event
    */
    mouseup: function(event){
        this.mouseIsDown = false;
        this.mouseCurrentObjectDrag = -1;
        this.mouseCurrentEdgeDrag = -1;
	    this.mouseCurrentBorderDrag = -1;
    },

    /**
    * triggered form the outside whenever the mouse was moved
    * validates coordinates and updates current objects (if any)
    *
    * @param Event
    */
    mousemove: function(event){       
        var x = event.pageX - jQuery(this.canvasId).offset().left;
        var y = event.pageY - jQuery(this.canvasId).offset().top;
        
        this.mouseOverCanvas = true;        
        if(x<0)                   { x=0;                  this.mouseOverCanvas=false; }
        if(x>this.getMaxW())     { x=this.getMaxW();    this.mouseOverCanvas=false; }
        if(y<0)                   { y=0;                  this.mouseOverCanvas=false; }
        if(y>this.getMaxH())     { y=this.getMaxH();    this.mouseOverCanvas=false; }
        
        if((this.mouseCurrentObjectDrag!=-1) && (this.mouseCurrentEdgeDrag!=-1)) {
            this.mouseCurrentEdgeDrag = this.areaObjects[this.mouseCurrentObjectDrag].performResizeAction(this.mouseCurrentEdgeDrag,x,y);
            this.updateCanvas(this.mouseCurrentObjectDrag);     
            this.updateForm(this.mouseCurrentObjectDrag);
            event.stopPropagation();
        } else if((this.mouseCurrentObjectDrag!=-1) && (this.mouseCurrentBorderDrag!=-1)) {
            this.mouseCurrentBorderDrag = this.areaObjects[this.mouseCurrentObjectDrag].performDragAction(this.mouseCurrentBorderDrag,x-this.mouseCurrentBorderDragX,y-this.mouseCurrentBorderDragY);
		    this.mouseCurrentBorderDragX = x;
		    this.mouseCurrentBorderDragY = y;
            this.updateCanvas(this.mouseCurrentObjectDrag);     
            this.updateForm(this.mouseCurrentObjectDrag);
            event.stopPropagation();
        }
       return false;
    },

    dblclick: function(event) {   
        var x = event.pageX - jQuery(this.canvasId).offset().left;
        var y = event.pageY - jQuery(this.canvasId).offset().top;
        var that = this;
        jQuery.each(jQuery(this.formsId + " > div"), function(i, obj) {
            var tmp = that.areaObjects[jQuery(this).attr("id")].hitOnObjectEdge(x,y,3);
            if(tmp != -1) {
                if(that.areaObjects[jQuery(this).attr("id")].edgeWasHit(tmp)) {
                    that.updateCanvas(jQuery(this).attr("id"));     
                    that.updateForm(jQuery(this).attr("id"));                
                }
            }
            var tmp = that.areaObjects[jQuery(this).attr("id")].hitOnObjectBorder(x,y,5);
            if(tmp != -1) {
                if(that.areaObjects[jQuery(this).attr("id")].borderWasHit(tmp,x,y)) {
                    that.updateCanvas(jQuery(this).attr("id"));     
                    that.updateForm(jQuery(this).attr("id"));                
                }
            }   
        });
    },

    /**
    *  Adds a Area Object and do all the coupling-stuff with the environment
    * 
    * @param obj the areaObject itself
    * @param coords initial coordinates
    * @param linkValue  typolink values
    * @param colorValue the hex-value of the color
    * @usage external
    */    
    addArea: function(obj,coords,labelValue,linkValue,colorValue,prepend,attributes) {
        if(coords == '') {
            coords = obj.getStartupCoords(this.getCenterCoords(),this.getDimensions())
        }
        obj.init(this,this.getNextId(),coords,labelValue,linkValue,colorValue,attributes);
        obj.setScale(this.scaleFactor);
        this.areaObjects[obj.getId()] = obj;
        this.areaObjectList.push(obj.getId());
        if(prepend) {
            jQuery(this.formsId).prepend(obj.formMarkup().replace(/OBJID/g,obj.getId()));
        } else {
            jQuery(this.formsId).append(obj.formMarkup().replace(/OBJID/g,obj.getId()));        
        }
        jQuery(this.formsId).data("parent",this).sortable({
            distance:3, 
            start:function(e) {
                jQuery("#" + jQuery(e.target).attr("id") + " > .sortbtn").css("visibility","hidden");  
                jQuery("#" + jQuery(e.target).attr("id") + " > div > .sortbtn").css("visibility","hidden");            
            },
            stop:function(e) {
                jQuery(this).data("parent").updateCanvasLayerOrder(); 
                jQuery(this).data("parent").fixSortbtnVisibility();
            }
        });
		this.areaObjects[obj.getId()].applyBasicAreaActions();
        this.updateForm(obj.getId());        
        this.addCanvasLayer(obj.getId());
        this.updateCanvas(obj.getId());
        this.updateCanvasLayerOrder();
        this.fixSortbtnVisibility();    
    },
    
    
    /**
    *  Adds a Rectangle-Area Object
    * 
    * @param id the area-id which should be removed
    * @usage area*Classes
    */ 
    removeArea: function (id) {
        var tmpArr = new Array();
        jQuery.each(this.areaObjectList, function(i, objId) {
            if(objId!=id) { tmpArr.push(objId); }
        });
        this.areaObjectList=tmpArr;
        this.removeCanvasLayer(id);
        this.fixSortbtnVisibility();
    },

    /**
    * triggered to move a single areaObject manually up - for assistance of sortable
    *
    * @param id ObjectID
    */
    areaUp: function(id) {
        var prev = -1;
        var self = -1;
        jQuery.each(jQuery(this.formsId + " > div"), function(i, obj) {
            if(jQuery(obj).attr("id")==id) {
                self = jQuery(obj).attr("id");                
            }
            if(self == -1) {
                prev = jQuery(obj).attr("id");
            }
        });    
        if(prev != -1) {
            jQuery("#" + self).insertBefore("#" + prev);
            this.updateCanvasLayerOrder();
        }
        this.fixSortbtnVisibility();
    },

    /**
    * triggered to move a single areaObject manually down - for assistance of sortable
    *
    * @param id ObjectID
    */
    areaDown: function(id) {
        var next = -1;
        var self = -1;
        jQuery.each(jQuery(this.formsId + " > div"), function(i, obj) {
            if((self != -1) && (next == -1)) {
                next = jQuery(obj).attr("id");
            }              
            if(jQuery(obj).attr("id")==id) {
                self= jQuery(obj).attr("id");
            }
        });    
        if(next != -1) {
            jQuery("#" + self).insertAfter("#" +next);
            this.updateCanvasLayerOrder();            
        }        
        this.fixSortbtnVisibility();
    },

    getCenterCoords: function() {
        return {x:(this.imageOrigW/2),y:(this.imageOrigH/2)};
    },

    getDimensions: function() {
        return {w:this.imageOrigW,h:this.imageOrigH};
    },

    /**
    * triggered to show/hide the buttons for manuell sorting (hide if options not available etc..)
    *
    */    
    fixSortbtnVisibility: function() {
        jQuery(this.formsId + " > div > .basicOptions > .sortbtn").css("visibility","visible");
        jQuery(this.formsId + " > div:first > .basicOptions > .upbtn").css("visibility","hidden");
        jQuery(this.formsId + " > div:last > .basicOptions > .downbtn").css("visibility","hidden");    
    },

    /**
    *  Creates valid XML from the current Area-Objects
    *
    * @returns XML-String
    * @usage external
    */
	persistanceXML: function() {
		var result = "";
        var tmpArr = new Array();
        var that = this;
        jQuery.each(jQuery(this.formsId + " > div"), function(i, obj) {
            if(typeof that.areaObjects[jQuery(obj).attr("id")] != 'undefined') {
                that.areaObjects[jQuery(obj).attr("id")].updateStatesFromForm();
                result = result + "\n" + that.areaObjects[jQuery(obj).attr("id")].persistanceXML();
            }
        });
        return result;
	},

    /**
    * Add a new canvas-layer and create a new Graphics-Objects.
    * This keeps canvases separate and adds to overall performance.
    *
    * @param id     the canvasId
    * @usage internal
    */
    addCanvasLayer: function(id) {
        jQuery(this.canvasId).append('<div id="' + id + '_canvas" class="canvas"><!-- --></div>');       
        this.canvasVectors[id] = new jsGraphics(id + '_canvas');
    } ,

    /**
    *  Re-Paint a canvas-layer for a single Area-Object.
    *
    * @param id     the object-id
    * @usage area*Classes
    */
    updateCanvas: function(id) {        
            this.canvasVectors[id].clear();
            this.areaObjects[id].drawSelection(this.canvasVectors[id]);
            this.canvasVectors[id].paint();
    },

    /**
    * Remove a canvas-layer and make sure that nothing is displayed anymore.
    *
    * @param id     the canvasId
    * @usage internal
    */    
    removeCanvasLayer: function(id) {
        this.canvasVectors[id].clear();
        jQuery('#' + id + '_canvas').remove();
    },

    /**
    * Adjust canvas-layer order analog to the order of the forms
    *
    * @usage internal
    */
    updateCanvasLayerOrder: function() {
        var z = 100;
        var that = this;
        jQuery.each(jQuery(this.formsId + " > div"), function(i, obj) {
            if(typeof that.areaObjects[jQuery(obj).attr("id")] != "undefined") {
                jQuery('#' + jQuery(obj).attr("id") + '_canvas').css("z-index",z--);
            }
        });
    },

    /**
    * Re-Sync the form-data with the Area-Object
    *
    * @param id     the object-id
    * @usage area*Classes
    */    
    updateForm: function(id) {
        var data = this.areaObjects[id].formUpdate();
        jQuery.each(data.split("\";"), function(elem, value) {
            var item = value.split("=\"");
            if(item[0]) {
            	jQuery("#" + item[0]).attr("value",item[1]);
            }
        });
    },

    refreshForm: function(id) {
		this.areaObjects[id].updateStatesFromForm();
        jQuery("#" + this.areaObjects[id].getFormId()).replaceWith(this.areaObjects[id].formMarkup().replace(/OBJID/g,id));
		this.areaObjects[id].applyBasicAreaActions(jQuery("#" + id));
        this.updateForm(this.areaObjects[id].getId());        
    },

    /**
    * Reload form from blueprint after the linkvalue was updated (Required since Link-Wizard URL need to change).
    *
    * @param id     the object-id
    * @usage external
    */ 
	triggerAreaLinkUpdate: function(id)  {
		this.refreshForm(id);
	},

    /**
    * Generate a new object-id
    *
    * @usage internal
    */ 
    getNextId: function() {
        this.areaCount = this.areaCount + 1;
        return "Object" + this.areaCount;
    },

    /**
    * Generate a new markerpoint-id
    *
    * @usage internal
    */ 
    getNextMarkerPointId: function() {
        this.boxMarkerCount = this.boxMarkerCount + 1;
        return "markerPoint" + this.boxMarkerCount
    },
    
    /**
    * Provides access to the form-blueprints
    *
    * @param id     the form-id
    * @usage area*Classes
    */ 
    getFormBlueprint: function(id) { return this.formBlueprints[id]; },
    
    /**
    * Parses form-blueprints which contain the basic structur of the different Area-Forms.
    *
    * @param id     the form-id
    * @usage internal
    */ 
    parseFormToBluePrint: function(id) {
        var result = new Array();
        jQuery(id + " > div").each(function(elem) {
            if(jQuery(this).attr("class") == "noIdWrap") {
                result[this.id] = jQuery("#" + this.id).html();
            } else {
                result[this.id] = "<div class=\"" +  this.id + " " + jQuery(this).attr("class") + "\" id=\"MAPFORMID\">"+ jQuery("#" + this.id).html() + "</div>";
            }
        });
        return result;
    },
    
    getMaxW: function() {
        return this.scaleFactor*this.imageOrigW;
    },
    
    getMaxH: function() {
        return this.scaleFactor*this.imageOrigH;
    }
});
