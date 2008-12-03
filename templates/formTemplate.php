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


$existingFields = $this->data->listAreas("\tcanvasObject.addArea(new area##shape##Class(),'##coords##','##alt##','##link##','##color##',0);\n");

$this->addInlineJS('
jQuery.noConflict();

function imagemapwizard_valueChanged(field) {  
    jQuery.ajaxSetup({
        url: "'.$this->getAjaxURL('wizard.php').'",
        global: false,
        type: "GET",
        success: function(data, textStatus) { 
            if(textStatus==\'success\') {
                /*alert(data);*/
                jQuery("#'.$this->getId().'").html(data);
            }
        },
        data: { context:"formAjax", 
                formField:field.name,
                value:field.value, 
                table:"'.$this->data->getTablename().'", 
                field:"'.$this->data->getFieldname().'", 
                uid:"'.$this->data->getUid().'"
        }
    });
    jQuery.ajax();    
}
');

?>
<div class="imagemap_wiz" style="padding:5px;">
    <div id="<?php echo $this->getId(); ?>-canvas" style="position:relative">
    <?php
        echo $this->data->renderThumbnail();
    ?>
    </div>
</div>
<script type="text/javascript">

jQuery(document).ready(function(){
    canvasObject = new previewCanvasClass();
    canvasObject.init("<?php echo $this->getId(); ?>-canvas","<?php echo $this->data->getThumbnailScale() ?>");
	<?php echo $existingFields; ?>
});

</script>
