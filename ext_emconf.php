<?php

########################################################################
# Extension Manager/Repository config file for ext "imagemap_wizard".
#
# Auto generated 17-10-2009 17:51
#
# Manual updates:
# Only the data in the array - everything else is removed by next
# writing. "version" and "dependencies" must not be touched!
########################################################################

$EM_CONF[$_EXTKEY] = array(
	'title' => 'Imagemap Wizard',
	'description' => 'Provides an TYPO3 Wizard which enables interactive Imagemap-Creation - related to the TYPO3-Linkwizard. Supported by AOE media.',
	'category' => 'be',
	'shy' => 0,
	'version' => '0.5.1',
	'dependencies' => 'cms,css_styled_content',
	'conflicts' => '',
	'priority' => '',
	'loadOrder' => '',
	'module' => '',
	'state' => 'stable',
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
			'typo3' => '3.8.0-4.3.99',
			'cms' => '0.0.0',
			'css_styled_content' => '0.0.0',
		),
		'conflicts' => array(
		),
		'suggests' => array(
			'phpunit' => '0.0.0',
		),
	),
	'_md5_values_when_last_written' => 'a:45:{s:16:"ext_autoload.php";s:4:"ffd2";s:21:"ext_conf_template.txt";s:4:"ceee";s:12:"ext_icon.gif";s:4:"a9eb";s:17:"ext_localconf.php";s:4:"5c6e";s:14:"ext_tables.php";s:4:"708c";s:14:"ext_tables.sql";s:4:"cb43";s:13:"locallang.xml";s:4:"dba4";s:21:"locallang_csh_ttc.xml";s:4:"20a4";s:23:"tt_content_imagemap.gif";s:4:"2e67";s:10:"wizard.php";s:4:"5776";s:42:"classes/class.tx_imagemapwizard_parser.php";s:4:"c4db";s:47:"classes/class.tx_imagemapwizard_softrefproc.php";s:4:"333b";s:43:"classes/class.tx_imagemapwizard_wizicon.php";s:4:"c93b";s:64:"classes/controller/class.tx_imagemapwizard_controller_wizard.php";s:4:"13cb";s:58:"classes/model/class.tx_imagemapwizard_model_dataObject.php";s:4:"a741";s:54:"classes/model/class.tx_imagemapwizard_model_mapper.php";s:4:"9914";s:56:"classes/model/class.tx_imagemapwizard_model_typo3env.php";s:4:"abce";s:54:"classes/view/class.tx_imagemapwizard_view_abstract.php";s:4:"a43b";s:53:"classes/view/class.tx_imagemapwizard_view_tceform.php";s:4:"b4f0";s:52:"classes/view/class.tx_imagemapwizard_view_wizard.php";s:4:"8a8f";s:14:"doc/manual.sxw";s:4:"afcb";s:21:"templates/default.css";s:4:"d416";s:21:"templates/tceform.php";s:4:"0dd4";s:20:"templates/wizard.php";s:4:"22d5";s:21:"templates/gfx/add.gif";s:4:"408a";s:27:"templates/gfx/arrowdown.png";s:4:"11e7";s:25:"templates/gfx/arrowup.png";s:4:"d4e0";s:29:"templates/gfx/button_down.gif";s:4:"fa54";s:27:"templates/gfx/button_up.gif";s:4:"0cc7";s:28:"templates/gfx/close_gray.gif";s:4:"31ee";s:25:"templates/gfx/garbage.gif";s:4:"90c6";s:28:"templates/gfx/link_popup.gif";s:4:"1ec5";s:26:"templates/gfx/pil2down.gif";s:4:"176b";s:24:"templates/gfx/pil2up.gif";s:4:"b617";s:22:"templates/gfx/redo.gif";s:4:"cde8";s:27:"templates/gfx/refresh_n.gif";s:4:"604b";s:25:"templates/gfx/zoom_in.gif";s:4:"620e";s:26:"templates/gfx/zoom_out.gif";s:4:"f318";s:30:"templates/img/form-tooltip.png";s:4:"bd81";s:32:"templates/js/jquery-1.3.2.min.js";s:4:"bb38";s:42:"templates/js/jquery-ui-1.7.2.custom.min.js";s:4:"9f7a";s:35:"templates/js/wizard.all.js.ycomp.js";s:4:"7dc0";s:35:"tests/class.converting_testcase.php";s:4:"d1aa";s:33:"tests/class.mappings_testcase.php";s:4:"9819";s:32:"tests/class.softref_testcase.php";s:4:"571b";}',
	'suggests' => array(
	),
);

?>