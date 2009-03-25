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

var areaCircleClass = areaClass.extend({
    _coords:-1,

    initCoords: function(coords) {
        if(typeof coords == 'undefined') { return; }
        this._coords = new Array();
    	var tmpCoords = coords.split(",");
        this.setX(tmpCoords[0]);
        this.setY(tmpCoords[1]);    
        this.setRadius(tmpCoords[2]);
    },

    getStartupCoords: function(coords,dimensions) {
        var w = (dimensions.w>200)?100:(dimensions.w/2);
        var h = (dimensions.h>200)?100:(dimensions.h/2);
        return coords.x + ',' + coords.y + ',' + ((w>h)?h/2:w/2);
    },

    // called from canvasClass
	persistanceXML: function() {
		return "<area shape=\"circle\" coords=\""+this.getX(0)+","+this.getY(0)+","+this.getRadius(0)+"\" alt=\"" + this.getLabel() + "\" color=\""+this.getColor()+"\" " + this.getAdditionalAttributeXML() +">"+this.getLink()+"</area>";
	},

    // called from canvasClass
    drawSelection: function(vectorsObj) {
            vectorsObj.setColor(this.getColor());            
            vectorsObj.setStroke(1);
            vectorsObj.drawEllipse(this.getX(1)-this.getRadius(1),this.getY(1)-this.getRadius(1),2*this.getRadius(1),2*this.getRadius(1));  
            this.drawEdge(vectorsObj,this.getX(1),this.getY(1));
            if((this.getX(1)-this.getRadius(1)) > 0) {  this.drawEdge(vectorsObj,this.getX(1)-this.getRadius(1),this.getY(1)); }
            if((this.getX(1)+this.getRadius(1)) < this.getCanvas().getMaxW()) { this.drawEdge(vectorsObj,this.getX(1)+this.getRadius(1),this.getY(1)); }
            if((this.getY(1)-this.getRadius(1)) > 0) {  this.drawEdge(vectorsObj,this.getX(1),this.getY(1)-this.getRadius(1)); }
            if((this.getY(1)+this.getRadius(1)) < this.getCanvas().getMaxH()) { this.drawEdge(vectorsObj,this.getX(1),this.getY(1)+this.getRadius(1)); }
    },

    // called from canvasClass
    formMarkup: function(formBlueprints) {
        return this.getCanvas().getFormBlueprint("circForm").replace(/MAPFORMID/g,this.getFormId())
                     								 .replace(/MAPAREAVALUE_URL/g,escape(this.getLink()))
                     								 .replace(/MAPAREAVALUE/g,this.getLink());
    },

    // called from canvasClass
    formUpdate: function() {
        var result = this.getFormId() + "_x=" + this.getX(0) + ";" 
                    + this.getFormId() + "_y=" + this.getY(0) + ";"
                    + this.getFormId() + "_radius=" + this.getRadius(0) + ";"

        result = result + this.getCommonFormUpdateFields();
        return result;
    },
    
    
    applyBasicTypeActions: function() {
    
    },
    
    applyAdditionalTypeActions: function() {
    
    },
    
    updateCoordsFromForm: function(id) {
        this.setX(parseInt(jQuery("#" + this.getFormId() + "_x").val()));
        this.setY(parseInt(jQuery("#" + this.getFormId() + "_y").val()));
        this.setRadius(parseInt(jQuery("#" + this.getFormId() + "_radius").val()));
        this.getCanvas().updateCanvas(this.getId());
    },

 
    hitOnObjectEdge: function(mouseX,mouseY,edgeSize) {
        var result = -1;
        if(this.hitEdge(mouseX,mouseY,this.getX(1),this.getY(1),edgeSize)) {
            result = 0;
        } else if(this.hitEdge(mouseX,mouseY,this.getX(1)-this.getRadius(1),this.getY(1),edgeSize)) {
            result = 1;
        } else if(this.hitEdge(mouseX,mouseY,this.getX(1)+this.getRadius(1),this.getY(1),edgeSize)) {
            result = 2;
        } else if(this.hitEdge(mouseX,mouseY,this.getX(1),this.getY(1)-this.getRadius(1),edgeSize)) {
            result = 3;
        } else if(this.hitEdge(mouseX,mouseY,this.getX(1),this.getY(1)+this.getRadius(1),edgeSize)) {
            result = 4;
        }
        return result;
    },
    
       
    performResizeAction: function(edge,sx,sy) {
        var x = this.reverseScale(sx);
        var y = this.reverseScale(sy);    
        if(edge==0) {
            this.setX(x);
            this.setY(y);
        } else if(edge==1 || edge==2) {
            this.setRadius(this.getX(0)-x);
        } else if(edge==3 || edge==4) {
            this.setRadius(this.getY(0)-y);
        }
        return edge;
    },

  
    performDragAction: function(border,dX,dY){ 
    	this.setX(this.getX(0)+this.reverseScale(dX));
	    this.setY(this.getY(0)+this.reverseScale(dY));
        return border;
    },
    
    hitOnObjectBorder: function(x,y,s) { 
        var result = -1;
	if(this.hitBorder(this.getX(1),this.getY(1),this.getRadius(1),this.getRadius(1),x,y,s)) {
		result = 1;
	}
	return result;
    },
    
    hitBorder: function(x1,y1,r1,r2,mX,mY,size) {
        var d = Math.sqrt(Math.pow(mX-x1,2)+Math.pow(mY-y1,2));
        return (Math.abs(d)<(r1+(size/2)) && Math.abs(d)>(r1-(size/2)))?true:false;
    },

    getX: function(performScale) {
        return this.applyScale(this._coords[0],performScale);
    },
    setX: function(x)   {
        this._coords[0] = parseInt(x);
    },
    getY: function(performScale) {
        return this.applyScale(this._coords[1],performScale);
    },
    setY: function(x)   {
        this._coords[1] = parseInt(x);
    },
    getRadius: function(performScale) {
        return this.applyScale(this._coords[2],performScale);
    },
    setRadius: function(r)   {
          this._coords[2] = Math.abs(parseInt(r));
    }
});
