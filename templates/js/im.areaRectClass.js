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

var areaRectClass = areaClass.extend({
    _coords:-1,

    initCoords: function(coords) {
        if(typeof coords == 'undefined') { return; }
        this._coords = new Array();
    	var tmpCoords = coords.split(",");
        this.setX(tmpCoords[0],tmpCoords[2]);
        this.setY(tmpCoords[1],tmpCoords[3]);    
    },

    getStartupCoords: function(coords,dimensions) {
        var w = (dimensions.w>200)?100:(dimensions.w/2);
        var h = (dimensions.h>200)?100:(dimensions.h/2);
        return (coords.x-(w/2)) + ',' + (coords.y-(h/2)) + ',' + (coords.x+(w/2)) + ',' + (coords.y+(h/2));
    },

    // called from canvasClass
	persistanceXML: function() {
		return "<area shape=\"rect\" coords=\""+this.getLeftX(0)+","+this.getTopY(0)+","+this.getRightX(0)+","+this.getBottomY(0)+"\" alt=\"" + this.getLabel() + "\" color=\""+this.getColor()+"\">"+this.getLink()+"</area>";
	},

    // called from canvasClass
    drawSelection: function(vectorsObj) {
            vectorsObj.setColor(this.getColor());            
            vectorsObj.setStroke(1);
            vectorsObj.drawRect(this.getLeftX(1),this.getTopY(1),this.getWidth(1),this.getHeight(1));
            /*vectorsObj.setStroke(Stroke.DOTTED);
            vectorsObj.setColor("#ffffff");         
            vectorsObj.drawRect(this.getLeftX(),this.getTopY(),this.getWidth(),this.getHeight());
            vectorsObj.setColor(_color);         */
            
            this.drawEdge(vectorsObj,this.getLeftX(1),this.getTopY(1));
            this.drawEdge(vectorsObj,this.getRightX(1),this.getTopY(1));
            this.drawEdge(vectorsObj,this.getRightX(1),this.getBottomY(1));
            this.drawEdge(vectorsObj,this.getLeftX(1),this.getBottomY(1));          
    },

    // called from canvasClass
    formMarkup: function(formBlueprints) {
        return this.getCanvas().getFormBlueprint("rectForm").replace(/MAPFORMID/g,this.getFormId())
                     								 .replace(/MAPAREAVALUE_URL/g,escape(this.getLink()))
                     								 .replace(/MAPAREAVALUE/g,this.getLink());
    },

    // called from canvasClass
    formUpdate: function() {
        var result = this.getFormId() + "_x1=" + this.getLeftX(0) + ";" 
                    + this.getFormId() + "_y1=" + this.getTopY(0) + ";"
                    + this.getFormId() + "_x2=" + this.getRightX(0) + ";"
                    + this.getFormId() + "_y2=" + this.getBottomY(0) +  ";";
        
        
        result = result  + this.getFormId() + "_link=" + this.getLink() + ";";
        result = result  + this.getFormId() + "_label=" + this.getLabel() + ";";
        return result;
    },
    
    
    applyBasicTypeActions: function() {
    
    },
    
    applyAdditionalTypeActions: function() {
    
    },
    
    updateCoordsFromForm: function(id) {
        this.setX(parseInt(jQuery("#" + this.getFormId() + "_x1").val()), parseInt(jQuery("#" + this.getFormId() + "_x2").val()));
        this.setY(parseInt(jQuery("#" + this.getFormId() + "_y1").val()), parseInt(jQuery("#" + this.getFormId() + "_y2").val()));
        this.getCanvas().updateCanvas(this.getId());
    },

 
    hitOnObjectEdge: function(mouseX,mouseY,edgeSize) {
        var result = -1;
        if(this.hitEdge(mouseX,mouseY,this.getLeftX(1),this.getTopY(1),edgeSize)) {
            result = 0;
        } else if(this.hitEdge(mouseX,mouseY,this.getRightX(1),this.getTopY(1),edgeSize)) {
            result = 1;
        } else if(this.hitEdge(mouseX,mouseY,this.getRightX(1),this.getBottomY(1),edgeSize)) {
            result = 2;
        } else if(this.hitEdge(mouseX,mouseY,this.getLeftX(1),this.getBottomY(1),edgeSize)) {
            result = 3;
        }
        return result;
    },
    
    performResizeAction: function(edge,sx,sy) {
        var x = this.reverseScale(sx);
        var y = this.reverseScale(sy);
        var tx = this.getLeftX(0);
        var ty = this.getTopY(0);
        var tw = this.getWidth(0);
        var th = this.getHeight(0);
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
    },  

    hitOnObjectBorder: function(mX,mY,size) { 
        var result = -1;
        if(this.hitBorder(this.getLeftX(1),this.getTopY(1),this.getRightX(1),this.getTopY(1),mX,mY,size)) {
            result = 1;
        }
        if(this.hitBorder(this.getRightX(1),this.getTopY(1),this.getRightX(1),this.getBottomY(1),mX,mY,size)) {
            result = 2;
        }
        if(this.hitBorder(this.getLeftX(1),this.getBottomY(1),this.getRightX(1),this.getBottomY(1),mX,mY,size)) {
            result = 3;
        }
        if(this.hitBorder(this.getLeftX(1),this.getTopY(1),this.getLeftX(1),this.getBottomY(1),mX,mY,size)) {
            result = 4;
        }
        return result;
    },   
   
    performDragAction: function(border,dX,dY){
        var x = this.getLeftX(0);
        var y = this.getTopY(0);
        var tdX = this.reverseScale(dX);
        var tdY = this.reverseScale(dY);
        this.setX(x+tdX,x+tdX+this.getWidth(0));
        this.setY(y+tdY,y+tdY+this.getHeight(0));
        return border;
    },
    
    getLeftX: function(performScale)        {  return this.applyScale(this._coords[0],performScale); },
    getTopY: function(performScale)         {  return this.applyScale(this._coords[1],performScale); },
    getRightX: function(performScale)       {  return this.applyScale(this._coords[2],performScale); },
    getBottomY: function(performScale)      {  return this.applyScale(this._coords[3],performScale); },

	getWidth: function(performScale)	{ return this.applyScale(this.getRightX(0)-this.getLeftX(0),performScale); },
	getHeight: function(performScale)	{ return this.applyScale(this.getBottomY(0)-this.getTopY(0),performScale); },
    
    setX: function(x1,x2)   {
          this._coords[0] = parseInt(parseInt(x1)>parseInt(x2)?x2:x1);
          this._coords[2] = parseInt(parseInt(x1)>parseInt(x2)?x1:x2);
    },
    setY: function(y1,y2)   {
          this._coords[1] = parseInt(parseInt(y1)>parseInt(y2)?y2:y1);
          this._coords[3] = parseInt(parseInt(y1)>parseInt(y2)?y1:y2);  
    },
    setW: function(value)     {   var x = this.getLeftX(0);    this.setX(x,x+value);     },
    setH: function(value)     {   var y = this.getTopY(0);    this.setY(y,y+value);     }
});

