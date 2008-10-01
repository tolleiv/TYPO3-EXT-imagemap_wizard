<?php
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
/**
 * Class/Function provides form-field which can be integrated into a normal TCE-Form
 *
 * @author	Tolleiv Nietsch <info@tolleiv.de>
 */

require_once(t3lib_extMgm::extPath('imagemap_wizard').'classes/model/class.tx_imagemapwizard_dataObject.php');

class tx_imagemapwizard_formController {

    protected $TCEForms;

	/**
	 * Generate the Form
	 *
	 * @param	Object		PA
	 * @param	Object		fobj
	 * @return	String		HTMLCode with form-field
	 */
    function renderForm($PA, $fobj) {
		$dataClass = t3lib_div::makeInstanceClassName('tx_imagemapwizard_dataObject');
		$data = new $dataClass($PA['table'],$PA['field'],$PA['row']['uid']);

		if(!$data->hasValidImageFile()) {
			//TODO: implement ajax reload thing
			return 'no targetimage defined yet';
		}

        return $PA['pObj']->getSingleField_typeText($PA['table'],$PA['field'],$PA['row'],$PA);
     	$content = $PA['pObj']->getSingleHiddenField($PA['table'],$PA['field'],$PA['row'],$PA);
        return $PA['pObj']->renderWizards(array($content,'..altItem..?'),$PA['fieldConf']['config']['wizards'],$PA['table'],$PA['row'],$PA['field'],$PA,$PA['itemFormElName'],array(),1);
    }
}

?>