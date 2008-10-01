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
 * Class/Function provides basic action for the Wizard-Form
 *
 * @author	Tolleiv Nietsch <info@tolleiv.de>
 */

require_once(t3lib_extMgm::extPath('imagemap_wizard').'classes/model/class.tx_imagemapwizard_dataObject.php');

class tx_imagemapwizard_wizardcontroller {

    protected $view;

	/**
	 * Initialize Context and required View
	 */
    public function __construct() {
        $this->view = t3lib_div::makeInstance("tx_imagemapwizard_backendView");
        $this->initContext();
        $this->view->init($this->context);
    }

	/**
	 * Execute required action which is determined by the given context
	 */
	public function triggerAction() {
		call_user_func_array(array($this, $this->context.'Action'),array());
	}

	/**
	 * Default action just renders the Wizard with the default view.
	 */
    protected function defaultAction() {
		$params = t3lib_div::_GP('P');

		//TODO: use-Flex-DataObject if needed
		$dataClass = t3lib_div::makeInstanceClassName('tx_imagemapwizard_dataObject');
		$data = new $dataClass($params['table'],$params['field'],$params['uid']);

		$this->view->setData($data);
        $this->view->renderContent();
    }

	/**
	 * Is supposed the process AJAX-Requests (not used yet)
	 */
	protected function ajaxAction() {
		echo '<div>jep I\'m here</div>';
	}

	/**
	 * Determine context
	 */
    protected function initContext() {
        $this->context = t3lib_div::_GP('ajax')?'ajax':'default';
    }



}

?>