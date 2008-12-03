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
 * Class/Function which renders the TCE-Form with the Data provided by the given Data-Object.
 *
 * @author	Tolleiv Nietsch <info@tolleiv.de>
 */

require_once(t3lib_extMgm::extPath('imagemap_wizard').'classes/model/class.tx_imagemapwizard_typo3env.php');
require_once(t3lib_extMgm::extPath('imagemap_wizard').'classes/view/class.tx_imagemapwizard_abstractView.php');


class tx_imagemapwizard_formView extends tx_imagemapwizard_abstractView {

	protected $form;

	public function setTCEForm($form) {
		$this->form = $form;    	
	}
	
  /**
   * Renders Content and prints it to the screen (or any active output buffer)
   */
	public function renderContent($formName,$wizardConf) {    
		if(!$this->data->hasValidImageFile()) {
			$content = $this->form->sL('LLL:EXT:imagemap_wizard/locallang.xml:form.no_image');
		} else {
			$content = $this->renderTemplate('formTemplate.php');
			$this->form->additionalCode_pre[] = $this->getExternalJSIncludes();
			$this->form->additionalCode_pre[] = $this->getInlineJSIncludes();
		}
		$a = array('fieldChangeFunc'=>array('imagemapwizard_valueChanged(field);'));
		$content .= $this->form->getSingleHiddenField($this->data->getTablename(),$this->data->getFieldname(),$this->data->getRow());
		return '<div id="'.$this->getId().'">'.$this->form->renderWizards(array($content,''),$wizardConf,$this->data->getTablename(),$this->data->getRow(),$this->data->getFieldname(),$a,$formName,array(),1).'</div>';
	}
}

if (defined('TYPO3_MODE') && $TYPO3_CONF_VARS[TYPO3_MODE]['XCLASS']['ext/imagemap_wizard/classes/view/class.tx_imagemapwizard_formView.php'])    {
    include_once($TYPO3_CONF_VARS[TYPO3_MODE]['XCLASS']['ext/imagemap_wizard/classes/view/class.tx_imagemapwizard_formView.php']);
}
?>