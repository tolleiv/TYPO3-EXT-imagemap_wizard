<?php
$this->addExternalJS("templates/js/jquery-1.2.6.js");
$this->addExternalJS("templates/js/ui.core.js");
$this->addExternalJS("templates/js/wz_jsgraphics.js");
$this->addExternalJS("templates/js/im.previewCanvasClass.js");
$this->addExternalJS("templates/js/js.inheritance.js");
$this->addExternalJS("templates/js/im.areaClass.js");
$this->addExternalJS("templates/js/im.areaRectClass.js");
$this->addExternalJS("templates/js/im.areaCircleClass.js");
$this->addExternalJS("templates/js/im.areaPolyClass.js");


$existingFields = $this->data->listAreas("\tcanvasObject.addArea(new area##shape##Class(),'##coords##','##alt##','##link##','##color##');\n");

$this->addInlineJS('
jQuery.noConflict();
jQuery(document).ready(function(){
    canvasObject = new canvasClass();
    canvasObject.init("'.$this->getId().'","'.$this->data->getThumbnailScale().'");
	'.$existingFields.'
});
');
?>
<div class="imagemap_wiz" style="padding:5px;">
    <div id="<?php echo $this->getId(); ?>" style="position:relative">    
    <?php
        echo $this->data->renderThumbnail();
    ?>
    </div>
</div>