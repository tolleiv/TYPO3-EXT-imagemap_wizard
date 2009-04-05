<?php

t3lib_div::loadTCA('tt_content');

$GLOBALS['TCA']['tt_content']['columns']['CType']['config']['items'][] = array(
    0 => 'LLL:EXT:imagemap_wizard/locallang.xml:imagemap.title',
    1 => 'imagemap_wizard',
    2 => 'i/tt_content_image.gif',
);

$tempColumns = array (
	'tx_imagemapwizard_links' => array(
		'label' => 'LLL:EXT:imagemap_wizard/locallang.xml:tt_content.tx_imagemapwizard_links',
		'config' => array (
			'type' => 'user',
			'userFunc' => 'tx_imagemapwizard_wizardController->renderForm',
            'wizards' => array(
                'imagemap' => array(
                    'type' => 'popup',
                    'script' => 'EXT:imagemap_wizard/wizard.php',
                    'title' => 'ImageMap',
                    'JSopenParams' => 'height=700,width=780,status=0,menubar=0,scrollbars=1',
                    'icon' => 'link_popup.gif',
                ),
            ),
            'softref'=>'tx_imagemapwizard',
        ),
	),
);
t3lib_extMgm::addTCAcolumns("tt_content",$tempColumns,1);


$GLOBALS['TCA']['tt_content']['types']['imagemap_wizard'] = $GLOBALS['TCA']['tt_content']['types']['image'];
t3lib_extMgm::addToAllTCAtypes('tt_content','tx_imagemapwizard_links', 'imagemap_wizard','after:image');
// CSH context sensitive help
t3lib_extMgm::addLLrefForTCAdescr('tt_content','EXT:imagemap_wizard/locallang_csh_ttc.xml');

if (TYPO3_MODE=='BE')    {
    $GLOBALS['TBE_MODULES_EXT']['xMOD_db_new_content_el']['addElClasses']['tx_imagemapwizard_wizicon'] = t3lib_extMgm::extPath($_EXTKEY).'classes/class.tx_imagemapwizard_wizicon.php';
}

?>