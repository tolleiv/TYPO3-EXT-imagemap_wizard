<?php

########################################################################
# Extension Manager/Repository config file for ext: "imagemap_wizard"
#
# Auto generated 24-03-2009 20:48
#
# Manual updates:
# Only the data in the array - anything else is removed by next write.
# "version" and "dependencies" must not be touched!
########################################################################

$EM_CONF[$_EXTKEY] = array(
	'title' => 'Imagemap Wizard',
	'description' => 'Provides an TYPO3 Wizard which enables interactive Imagemap-Creation - related to the TYPO3-Linkwizard. Supported by AOE media.',
	'category' => 'be',
	'shy' => 0,
	'version' => '0.3.7',
	'dependencies' => 'cms,css_styled_content',
	'conflicts' => '',
	'priority' => '',
	'loadOrder' => '',
	'module' => '',
	'state' => 'beta',
	'uploadfolder' => 0,
	'createDirs' => '',
	'modify_tables' => 'tt_content',
	'clearcacheonload' => 1,
	'lockType' => '',
	'author' => 'Tolleiv Nietsch',
	'author_email' => 'extensions@<myfirstname>.de',
	'author_company' => '',
	'CGLcompliance' => '',
	'CGLcompliance_note' => '',
	'constraints' => array(
		'depends' => array(
			'php' => '5.0.0-5.2.99',
			'typo3' => '3.8.0-4.2.99',
			'cms' => '0.0.0',
			'css_styled_content' => '0.0.0',
		),
		'conflicts' => array(
		),
		'suggests' => array(
			'phpunit' => '0.0.0',
		),
	),
	'_md5_values_when_last_written' => 'a:53:{s:9:"Thumbs.db";s:4:"b99b";s:21:"ext_conf_template.txt";s:4:"6250";s:12:"ext_icon.gif";s:4:"f19a";s:17:"ext_localconf.php";s:4:"cd7f";s:14:"ext_tables.php";s:4:"a8c7";s:14:"ext_tables.sql";s:4:"cb43";s:13:"locallang.xml";s:4:"ca43";s:21:"locallang_csh_ttc.xml";s:4:"0238";s:23:"tt_content_imagemap.gif";s:4:"2e67";s:10:"wizard.php";s:4:"420e";s:14:"doc/manual.sxw";s:4:"6d5b";s:42:"classes/class.tx_imagemapwizard_parser.php";s:4:"416a";s:47:"classes/class.tx_imagemapwizard_softrefproc.php";s:4:"aef3";s:43:"classes/class.tx_imagemapwizard_wizicon.php";s:4:"c93b";s:63:"classes/controller/class.tx_imagemapwizard_wizardController.php";s:4:"c2bf";s:52:"classes/model/class.tx_imagemapwizard_dataObject.php";s:4:"db20";s:48:"classes/model/class.tx_imagemapwizard_mapper.php";s:4:"b4ed";s:50:"classes/model/class.tx_imagemapwizard_typo3env.php";s:4:"c87f";s:53:"classes/view/class.tx_imagemapwizard_abstractView.php";s:4:"818a";s:52:"classes/view/class.tx_imagemapwizard_backendView.php";s:4:"9d3b";s:49:"classes/view/class.tx_imagemapwizard_formView.php";s:4:"d0ea";s:21:"templates/default.css";s:4:"827f";s:29:"templates/defaultTemplate.php";s:4:"658e";s:26:"templates/formTemplate.php";s:4:"e1cf";s:21:"templates/gfx/add.gif";s:4:"408a";s:27:"templates/gfx/arrowdown.png";s:4:"11e7";s:25:"templates/gfx/arrowup.png";s:4:"d4e0";s:29:"templates/gfx/button_down.gif";s:4:"fa54";s:27:"templates/gfx/button_up.gif";s:4:"0cc7";s:28:"templates/gfx/close_gray.gif";s:4:"31ee";s:25:"templates/gfx/garbage.gif";s:4:"90c6";s:28:"templates/gfx/link_popup.gif";s:4:"1ec5";s:26:"templates/gfx/pil2down.gif";s:4:"176b";s:24:"templates/gfx/pil2up.gif";s:4:"b617";s:27:"templates/gfx/refresh_n.gif";s:4:"604b";s:25:"templates/gfx/zoom_in.gif";s:4:"620e";s:26:"templates/gfx/zoom_out.gif";s:4:"f318";s:34:"templates/js/im.areaCircleClass.js";s:4:"a22b";s:28:"templates/js/im.areaClass.js";s:4:"c551";s:32:"templates/js/im.areaPolyClass.js";s:4:"7d90";s:32:"templates/js/im.areaRectClass.js";s:4:"bbd0";s:30:"templates/js/im.canvasClass.js";s:4:"de06";s:37:"templates/js/im.previewCanvasClass.js";s:4:"8608";s:28:"templates/js/jquery-1.2.6.js";s:4:"98e4";s:38:"templates/js/jquery.simpleColor.mod.js";s:4:"dbc1";s:29:"templates/js/jquery.timers.js";s:4:"ebd5";s:30:"templates/js/js.inheritance.js";s:4:"2e6f";s:23:"templates/js/ui.core.js";s:4:"a84b";s:27:"templates/js/ui.sortable.js";s:4:"4f6c";s:29:"templates/js/wz_jsgraphics.js";s:4:"8a6f";s:35:"tests/class.converting_testcase.php";s:4:"c030";s:33:"tests/class.mappings_testcase.php";s:4:"02d6";s:32:"tests/class.softref_testcase.php";s:4:"dfd4";}',
	'suggests' => array(
	),
);

?>