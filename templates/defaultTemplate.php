<?php
$this->addExternalJS("templates/js/jquery-1.2.6.js");
$this->addExternalJs("templates/js/ui.core.js");
$this->addExternalJs("templates/js/ui.sortable.js");
$this->addExternalJs("templates/js/jquery.timers.js");
$this->addExternalJs("templates/js/jquery.simpleColor.mod.js");
$this->addExternalJs("templates/js/wz_jsgraphics.js");
$this->addExternalJs("templates/js/im.canvasClass.js");
$this->addExternalJs("templates/js/js.inheritance.js");
$this->addExternalJs("templates/js/im.areaClass.js");
$this->addExternalJs("templates/js/im.areaRectClass.js");
$this->addExternalJs("templates/js/im.areaCircleClass.js");
$this->addExternalJs("templates/js/im.areaPolyClass.js");
$this->addExternalCSS("templates/default.css");

$existingFields = $this->data->listAreas("\tcanvasObject.addArea(new area##shape##Class(),'##coords##','##alt##','##link##','##color##',0);\n");

$this->addInlineJs('
$(document).ready(function(){
    canvasObject = new canvasClass();
    canvasObject.init("canvas","picture","areaForms");
	 // add existing stuff
	'.$existingFields.'

    // add Button-Actions
    $("#addRect").click(function(event) {
    	//TODO find useful default???
        canvasObject.addArea(new areaRectClass(),\'100,100,50,50\',\'\',\'\',\'\',1);
    });
    $("#addPoly").click(function(event) {
    	//TODO find useful default???
        canvasObject.addArea(new areaPolyClass(),\'100,100,75,75,50,100\',\'\',\'\',\'\',1);
    });
    $("#addCirc").click(function(event) {
    	//TODO find useful default???
        canvasObject.addArea(new areaCircleClass(),\'100,100,50\',\'\',\'\',\'\',1);
    });
    $(".niy").click(function(event) {
    	alert("Not implemented yet - but would be cool to have it :)");
    });
    $("#submit").click(function(event) {
    	setValue("<map>" + canvasObject.persistanceXML() + "\n</map>");
    	close();
    });
    $("#canvas").mousedown(function(e){
        canvasObject.mousedown(e);
    });
    $(document).mouseup(function(e){
        canvasObject.mouseup(e);
    });
    $(document).mousemove(function(e){       
        canvasObject.mousemove(e);
    });
});
');

 ?>
<div id="root">

    <div id="picture">
        <div id="image"><? echo $this->data->renderImage(); ?></div>
        <div id="canvas" class="canvas"><!-- --></div>
    </div>
	<div id="actions">
    <input type="button" id="addRect" value="Add Rect-Area" />
    <input type="button" id="addCirc" value="Add Circ-Area" />
    <input type="button" id="addPoly" value="Add Poly-Area" />
    <input type="button" id="submit" value="Save &amp; Close" />
    </div>
    <div id="info"><!-- --></div>
    <div id="areaForms">
        <div id="rectForm" class="areaForm bgColor5">
            <div id="MAPFORMID_main" class="basicOptions">
            	<div class="colorPreview ptr"><div><!-- --></div></div>
                <label for="MAPFORMID_label">Label:</label><input type="text" id="MAPFORMID_label" value="..." />
            	<label for="MAPFORMID_link">Link:</label><input type="text" id="MAPFORMID_link" value="..." /> <?  echo $this->linkWizardIcon("MAPFORMID_linkwizard","MAPFORMID_link","MAPAREAVALUE_URL","canvasObject.triggerAreaLinkUpdate(\"OBJID\")"); ?>
            	<? echo $this->getIcon("gfx/button_up.gif","id=\"MAPFORMID_up\" alt=\"up\" class=\"ptr sortbtn upbtn\""); ?>
            	<? echo $this->getIcon("gfx/button_down.gif","id=\"MAPFORMID_down\" alt=\"down\"class=\"ptr sortbtn downbtn\""); ?>
            	<? echo $this->getIcon("gfx/garbage.gif","id=\"MAPFORMID_del\" class=\"ptr\" alt=\"expand\""); ?>
            	<div class="arrow exp ptr"><? echo $this->getIcon("gfx/pil2down.gif","class=\"ptr\" alt='expand'"); ?></div>
            </div>
            <div id="MAPFORMID_more" class="moreOptions">            	
                <div class="halfLine">
            	    <div id="MAPFORMID_color" class="colors"><div class="colorBox"><div><!-- --></div></div><div class="colorPicker"><!-- --></div><div class="cc""><!-- --></div></div>
                    <div id="MAPFORMID_stroke" class="colors"><div class="strokeBox"><div><!-- --></div></div><div class="strokePicker"><!-- --></div><div class="cc""><!-- --></div></div>
                </div>
                <div class="positionOptions halfLine"><label for="MAPFORMID_x1" class="XYlabel XYlabel-first">X1:</label><input type="text" class="formCoord" id="MAPFORMID_x1" value="x" /><label for="MAPFORMID_y1" class="XYlabel">Y1:</label><input type="text" class="formCoord" id="MAPFORMID_y1" value="y" /><label for="MAPFORMID_x2" class="XYlabel XYlabel-first">X2:</label><input type="text" class="formCoord" id="MAPFORMID_x2" value="x" /><label for="MAPFORMID_y2" class="XYlabel">Y2:</label><input type="text" class="formCoord" id="MAPFORMID_y2" value="y" /> <? echo $this->getIcon("gfx/refresh_n.gif","id=\"MAPFORMID_upd\"class=\"ptr\" alt=\"refresh\" title=\"refresh\""); ?><div class="cc"><!-- --></div></div>
                <div class="cc"><!-- --></div>
            </div>
        </div>
        <div id="circForm" class="areaForm bgColor5">
            <div id="MAPFORMID_main" class="basicOptions">
            	<div class="colorPreview ptr"><div><!-- --></div></div>
                <label for="MAPFORMID_label">Label:</label><input type="text" id="MAPFORMID_label" value="..." />
            	<label for="MAPFORMID_link">Link:</label><input type="text" id="MAPFORMID_link" value="..." /> <?  echo $this->linkWizardIcon("MAPFORMID_linkwizard","MAPFORMID_link","MAPAREAVALUE_URL","canvasObject.triggerAreaLinkUpdate(\"OBJID\")"); ?>
            	<? echo $this->getIcon("gfx/button_up.gif","id=\"MAPFORMID_up\" alt=\"up\" class=\"ptr sortbtn upbtn\""); ?>
            	<? echo $this->getIcon("gfx/button_down.gif","id=\"MAPFORMID_down\" alt=\"down\"class=\"ptr sortbtn downbtn\""); ?>
            	<? echo $this->getIcon("gfx/garbage.gif","id=\"MAPFORMID_del\" class=\"ptr\" alt=\"expand\""); ?>
            	<div class="arrow exp ptr"><? echo $this->getIcon("gfx/pil2down.gif","class=\"ptr\" alt='expand'"); ?></div>
            </div>
            <div id="MAPFORMID_more" class="moreOptions">            	
                <div class="halfLine">
            	    <div id="MAPFORMID_color" class="colors"><div class="colorBox"><div><!-- --></div></div><div class="colorPicker"><!-- --></div><div class="cc""><!-- --></div></div>
                    <div id="MAPFORMID_stroke" class="colors"><div class="strokeBox"><div><!-- --></div></div><div class="strokePicker"><!-- --></div><div class="cc""><!-- --></div></div>
                </div>
                <div class="positionOptions halfLine"><label for="MAPFORMID_x" class="XYlabel XYlabel-first">X:</label><input type="text" class="formCoord" id="MAPFORMID_x" value="x" /><label for="MAPFORMID_y1" class="XYlabel">Y:</label><input type="text" class="formCoord" id="MAPFORMID_y" value="y" /><label for="MAPFORMID_radius" class="XYlabel XYlabel-first">R:</label><input type="text" class="formCoord" id="MAPFORMID_radius" value="r" /> <? echo $this->getIcon("gfx/refresh_n.gif","id=\"MAPFORMID_upd\"class=\"ptr\" alt=\"refresh\" title=\"refresh\""); ?><div class="cc"><!-- --></div></div>
                <div class="cc"><!-- --></div>
            </div>
        </div>
        <div id="polyForm" class="areaForm bgColor5">
            <div id="MAPFORMID_main" class="basicOptions">
            	<div class="colorPreview ptr"><div><!-- --></div></div>
                <label for="MAPFORMID_label">Label:</label><input type="text" id="MAPFORMID_label" value="..." />
            	<label for="MAPFORMID_link">Link:</label><input type="text" id="MAPFORMID_link" value="..." /> <?  echo $this->linkWizardIcon("MAPFORMID_linkwizard","MAPFORMID_link","MAPAREAVALUE_URL","canvasObject.triggerAreaLinkUpdate(\"OBJID\")"); ?>
            	<? echo $this->getIcon("gfx/button_up.gif","id=\"MAPFORMID_up\" alt=\"up\" class=\"ptr sortbtn upbtn\""); ?>                
            	<? echo $this->getIcon("gfx/button_down.gif","id=\"MAPFORMID_down\" alt=\"down\"class=\"ptr sortbtn downbtn\""); ?>
            	<? echo $this->getIcon("gfx/garbage.gif","id=\"MAPFORMID_del\" class=\"ptr\" alt=\"expand\""); ?>
                <? echo $this->getIcon("gfx/add.gif","id=\"MAPFORMID_add\" alt=\"add\" class=\"ptr add\""); ?>
            	<div class="arrow exp ptr"><? echo $this->getIcon("gfx/pil2down.gif","class=\"ptr\" alt='expand'"); ?></div>
            </div>
            <div id="MAPFORMID_more" class="moreOptions">            	
                <div class="halfLine">
            	    <div id="MAPFORMID_color" class="colors"><div class="colorBox"><div><!-- --></div></div><div class="colorPicker"><!-- --></div><div class="cc""><!-- --></div></div>
                    <div id="MAPFORMID_stroke" class="colors"><div class="strokeBox"><div><!-- --></div></div><div class="strokePicker"><!-- --></div><div class="cc""><!-- --></div></div>
                </div>
                <div class="positionOptions halfLine">POLYCOORDS <? echo $this->getIcon("gfx/refresh_n.gif","id=\"MAPFORMID_upd\"class=\"ptr\" alt=\"refresh\" title=\"refresh\""); ?><div class="cc"><!-- --></div></div>
                <div class="cc"><!-- --></div>
            </div>
        </div>
        <div id="polyCoords" class="noIdWrap">
            <label for="MAPFORMID_xN" class="XYlabel XYlabel-first">XN:</label><input type="text" class="formCoord" id="MAPFORMID_xN" value="vX" /> <label for="MAPFORMID_yN" class="XYlabel">YN:</label><input type="text" class="formCoord" id="MAPFORMID_yN" value="vY" />
             <? echo $this->getIcon("gfx/arrowup.png","id=\"MAPFORMID_beforeN\" alt=\"add before\" title=\"add before\" class=\"coordOpt addCoord ptr\""); ?>            
             <? echo $this->getIcon("gfx/arrowdown.png","id=\"MAPFORMID_afterN\" alt=\"add after\" title=\"add after\" class=\"coordOpt addCoord ptr\""); ?>            
             <? echo $this->getIcon("gfx/close_gray.gif","id=\"MAPFORMID_rmN\" alt=\"rm\" title=\"rm\" class=\"coordOpt rmCoord ptr\""); ?>            
        </div>
    </div>

	<span class="cc"><!-- --></span>
</div>




