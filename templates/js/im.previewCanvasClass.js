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

var previewCanvasClass = Class.extend({

    canvasId:null,    
    canvasVectors:null,
    areaCount:null,
    areaObjects:null,
    areaObjectList:null,
    scale:null,
    
    init:function (id,scaleFactor){
        this.canvasId = "#" + id;
        this.scale = scaleFactor;
        this.canvasVectors = new jsGraphics(id);
        this.areaCount = 0;
        this.areaObjects = new Array();
        this.areaObjectList = new Array();
    },

    addArea:function(obj,coords,labelValue,linkValue,colorValue,prepend) {
        obj.init(this,this.getNextId(),coords,labelValue,linkValue,colorValue,{});
        obj.disableEdges();
        obj.setScale(this.scale);
        this.areaObjects[obj.getId()] = obj;
        if(prepend) {
            this.areaObjectList.push(obj.getId());
        } else {
            this.areaObjectList.unshift(obj.getId());
        }
        this.updateCanvas();
    },
    
    /**
    *  Re-Paint a canvas-layer for a single Area-Object.
    *
    * @param id     the object-id
    * @usage area*Classes
    */
    updateCanvas:function() {      
        this.canvasVectors.clear();
        var that = this;
        jQuery.each(this.areaObjectList, function(i, objId) {
            that.areaObjects[objId].drawSelection(that.canvasVectors);
        });    
        this.canvasVectors.paint();
    },
    
    
    /**
    * Generate a new object-id
    *
    * @usage internal
    */ 
    getNextId:function() {
        this.areaCount = this.areaCount + 1;
        return "Object" + this.areaCount;
    },
    
    getMaxW:function() {
        return jQuery(this.canvasId).width();
    },
    
    getMaxH:function() {
        return jQuery(this.canvasId).height();
    }

});