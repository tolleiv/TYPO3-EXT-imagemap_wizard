<?php

if (TYPO3_MODE=='BE') {
	$GLOBALS['TYPO3_CONF_VARS']['SC_OPTIONS']['GLOBAL']['softRefParser']['tx_imagemapwizard'] = "EXT:imagemap_wizard/classes/class.tx_imagemapwizard_softrefproc.php:&tx_imagemapwizard_softrefproc";
}

?>