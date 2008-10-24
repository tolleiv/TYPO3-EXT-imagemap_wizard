<?php
$this->addExternalJS("templates/js/jquery-1.2.6.js");
$this->addExternalJs("templates/js/ui.core.js");
$this->addExternalJs("templates/js/ui.sortable.js");
$this->addExternalJs("templates/js/jquery.timers.js");
$this->addExternalJs("templates/js/jquery.simpleColor.mod.js");
$this->addExternalJs("templates/js/wz_jsgraphics.js");
$this->addExternalJs("templates/js/imagemap-stuff.js");
$this->addExternalCSS("templates/default.css");

$existingFields = $this->data->listAreas("\tcanvasObject.add##shape##Area('##coords##','##link##','##color##',0);\n");

$this->addInlineJs('
$(document).ready(function(){
    canvasObject = new canvasClass();
    canvasObject.init("canvas","picture","areaForms");
	 // add existing stuff
	'.$existingFields.'

    // add Button-Actions
    $("#addRect").click(function(event) {
    	//TODO find useful default???
        canvasObject.addRectArea(\'100,100,50,50\',\'\',\'\',1);
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
    <input type="button" id="addCirc" value="Add Circ-Area" class="niy" />
    <input type="button" id="addPoly" value="Add Poly-Area" class="niy" />
    <input type="button" id="submit" value="Save &amp; Close" />
    </div>
    <div id="info"><!-- --></div>
    <div id="areaForms">
        <div id="rectForm">
            <div id="MAPFORMID_main" class="basicOptions">
            	<div class="colorPreview ptr"><div><!-- --></div></div>
            	<input type="text" id="MAPFORMID_link" value="..." /> <?  echo $this->linkWizardIcon("MAPFORMID_linkwizard","MAPFORMID_link","MAPAREAVALUE_URL","canvasObject.triggerAreaLinkUpdate(\"OBJID\")"); ?>
            	<input type="button" id="MAPFORMID_del" value="D" />
            	<div class="arrow exp ptr"><? echo $this->getIcon("gfx/pil2down.gif","alt='expand'"); ?></div>
            </div>
            <div id="MAPFORMID_more" class="moreOptions">            	
            	<div id="MAPFORMID_color" class="colors halfLine"><div class="colorBox"><div><!-- --></div></div><div class="colorPicker"><!-- --></div><div class="cc""><!-- --></div></div>
                <div class="positionOptions halfLine">X1: <input type="text" class="formCoord" id="MAPFORMID_x1" value="x" /> Y1: <input type="text" class="formCoord" id="MAPFORMID_y1" value="y" /><br/>X2: <input type="text" class="formCoord" id="MAPFORMID_x2" value="x" /> Y2: <input type="text" class="formCoord" id="MAPFORMID_y2" value="y" /> <input type="button" id="MAPFORMID_upd" value="R" /></div>
                <div class="cc"><!-- --></div>
            </div>
        </div>
        <div id="circForm">circForm is not rady yet</div>
        <div id="polyForm">polyForm is not rady yet</div>
    </div>

	<span class="cc"><!-- --></span>
</div>




