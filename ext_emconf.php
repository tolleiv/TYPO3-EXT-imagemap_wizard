<?php

########################################################################
# Extension Manager/Repository config file for ext: "imagemap_wizard"
#
# Auto generated 18-04-2009 06:40
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
	'version' => '0.4.2',
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
	'_md5_values_when_last_written' => 'a:54:{s:21:"ext_conf_template.txt";s:4:"ceee";s:12:"ext_icon.gif";s:4:"f19a";s:17:"ext_localconf.php";s:4:"4257";s:14:"ext_tables.php";s:4:"d6b8";s:14:"ext_tables.sql";s:4:"cb43";s:13:"locallang.xml";s:4:"7644";s:21:"locallang_csh_ttc.xml";s:4:"20a4";s:23:"tt_content_imagemap.gif";s:4:"2e67";s:10:"wizard.php";s:4:"420e";s:14:"doc/manual.sxw";s:4:"9935";s:42:"classes/class.tx_imagemapwizard_parser.php";s:4:"2433";s:47:"classes/class.tx_imagemapwizard_softrefproc.php";s:4:"aef3";s:43:"classes/class.tx_imagemapwizard_wizicon.php";s:4:"c93b";s:63:"classes/controller/class.tx_imagemapwizard_wizardController.php";s:4:"7b79";s:52:"classes/model/class.tx_imagemapwizard_dataObject.php";s:4:"92e1";s:48:"classes/model/class.tx_imagemapwizard_mapper.php";s:4:"334d";s:50:"classes/model/class.tx_imagemapwizard_typo3env.php";s:4:"3d01";s:53:"classes/view/class.tx_imagemapwizard_abstractView.php";s:4:"9075";s:52:"classes/view/class.tx_imagemapwizard_backendView.php";s:4:"d8d8";s:49:"classes/view/class.tx_imagemapwizard_formView.php";s:4:"5396";s:21:"templates/default.css";s:4:"f1b4";s:29:"templates/defaultTemplate.php";s:4:"172a";s:26:"templates/formTemplate.php";s:4:"f928";s:21:"templates/gfx/add.gif";s:4:"408a";s:27:"templates/gfx/arrowdown.png";s:4:"11e7";s:25:"templates/gfx/arrowup.png";s:4:"d4e0";s:29:"templates/gfx/button_down.gif";s:4:"fa54";s:27:"templates/gfx/button_up.gif";s:4:"0cc7";s:28:"templates/gfx/close_gray.gif";s:4:"31ee";s:25:"templates/gfx/garbage.gif";s:4:"90c6";s:28:"templates/gfx/link_popup.gif";s:4:"1ec5";s:26:"templates/gfx/pil2down.gif";s:4:"176b";s:24:"templates/gfx/pil2up.gif";s:4:"b617";s:27:"templates/gfx/refresh_n.gif";s:4:"604b";s:25:"templates/gfx/zoom_in.gif";s:4:"620e";s:26:"templates/gfx/zoom_out.gif";s:4:"f318";s:34:"templates/js/im.areaCircleClass.js";s:4:"a257";s:28:"templates/js/im.areaClass.js";s:4:"2389";s:32:"templates/js/im.areaPolyClass.js";s:4:"dd03";s:32:"templates/js/im.areaRectClass.js";s:4:"f392";s:30:"templates/js/im.canvasClass.js";s:4:"075b";s:37:"templates/js/im.previewCanvasClass.js";s:4:"e583";s:28:"templates/js/jquery-1.2.6.js";s:4:"98e4";s:32:"templates/js/jquery-1.3.2.min.js";s:4:"bb38";s:38:"templates/js/jquery.simpleColor.mod.js";s:4:"dbc1";s:29:"templates/js/jquery.timers.js";s:4:"ebd5";s:30:"templates/js/js.inheritance.js";s:4:"2e6f";s:23:"templates/js/ui.core.js";s:4:"a84b";s:27:"templates/js/ui.sortable.js";s:4:"4f6c";s:29:"templates/js/wz_jsgraphics.js";s:4:"8a6f";s:30:"templates/img/form-tooltip.png";s:4:"8377";s:35:"tests/class.converting_testcase.php";s:4:"774f";s:33:"tests/class.mappings_testcase.php";s:4:"be0d";s:32:"tests/class.softref_testcase.php";s:4:"dfd4";}',
	'suggests' => array(
	),
);

?>