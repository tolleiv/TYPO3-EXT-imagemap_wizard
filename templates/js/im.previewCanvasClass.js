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

canvasClass = function () {

    var canvasId,canvasVectors,areaCount,areaObjects,areaObjectList,scale;
    this.init = function (id,scaleFactor){
        canvasId = "#" + id;
        scale = scaleFactor;
        canvasVectors = new jsGraphics(id);
        areaCount = 0;
        areaObjects = new Array();
        areaObjectList = new Array();
    }

    this.addArea = function(obj,coords,labelValue,linkValue,colorValue) {
        obj.init(this,this.getNextId(),coords,labelValue,linkValue,colorValue);
        obj.disableEdges();
        obj.setScale(scale);
        areaObjects[obj.getId()] = obj;
        areaObjectList.push(obj.getId());
        this.updateCanvas(obj.getId());
    }
    
    /**
    *  Re-Paint a canvas-layer for a single Area-Object.
    *
    * @param id     the object-id
    * @usage area*Classes
    */
    this.updateCanvas = function(id) {       
            areaObjects[id].drawSelection(canvasVectors);
            canvasVectors.paint();
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
    
    this.getMaxW = function() {
        return jQuery(canvasId).width();
    }
    this.getMaxH = function() {
        return jQuery(canvasId).height();
    }

};