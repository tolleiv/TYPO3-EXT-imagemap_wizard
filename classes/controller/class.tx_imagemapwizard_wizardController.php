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
    protected $context;
    protected $params;
    protected $forceValue   ;
	/**
	 * Initialize Context and required View
	 */
    public function __construct() {
        $this->initContext();    
        $this->initView();
    }

	/**
	 * Default action just renders the Wizard with the default view.
	 */
    protected function defaultAction() {
		$params = t3lib_div::_GP('P');
        $currentValue = $GLOBALS['BE_USER']->getSessionData ('imagemap_wizard.value');
		//TODO: use-Flex-DataObject if needed
		$dataClass = t3lib_div::makeInstanceClassName('tx_imagemapwizard_dataObject');
		$data = new $dataClass($params['table'],$params['field'],$params['uid'],$currentValue); //,$params['currentValue']);

		$this->view->setData($data);
        $this->view->renderContent();
    }

	/**
	 * Form action just renders the TCEForm which opens the wizard
     * comes with a cool preview and Ajax functionality which updates the preview...
	 */
    protected function formAction() {
    		
        $dataClass = t3lib_div::makeInstanceClassName('tx_imagemapwizard_dataObject');
        $data = new $dataClass($this->params['table'],$this->params['field'],$this->params['uid'],$this->forceValue);
        
        $this->view->setData($data);            
        $this->view->setTCEForm($this->params['pObj']);
    
        t3lib_div::loadTCA($this->params['table']);
        
        
        $wizConf = $GLOBALS['TCA'][$this->params['table']]['columns'][$this->params['field']]['config']['wizards'];
    
        return $this->view->renderContent($this->params['itemFormElName'],$wizConf);            
    }
    
	/**
	 * 
	 */
	protected function formAjaxAction() {
        $this->params['table'] = t3lib_div::_GP('table');
        $this->params['field'] = t3lib_div::_GP('field');
        $this->params['uid'] = t3lib_div::_GP('uid');        
		$this->params['pObj'] = t3lib_div::makeInstance('t3lib_TCEforms');
		$this->params['pObj']->initDefaultBEMode();
        $this->params['itemFormElName'] = t3lib_div::_GP('formField');

        $this->forceValue = t3lib_div::_GP('value');
        $GLOBALS['BE_USER']->setAndSaveSessionData('imagemap_wizard.value',$this->forceValue);
        echo $this->formAction();
	}



	/**
	 * Execute required action which is determined by the given context
	 */
	public function triggerAction() {
		return call_user_func_array(array($this, $this->context['key'].'Action'),array());
	}
    
	/**
	 * Determine context
	 */
    protected function initContext($forceContext=NULL) {
        $reqContext = $forceContext?$forceContext:t3lib_div::_GP('context');
        switch($reqContext) {
            case 'form':
            case 'formAjax':
                $this->context['key'] = $reqContext;
                $this->context['tpl'] = 'form';
                break;
            default:
                $this->context['key'] = 'default';
                $this->context['tpl'] = 'backend';
                
        }
    }

    protected function initView() {
        require_once(t3lib_extMgm::extPath('imagemap_wizard').'classes/view/class.tx_imagemapwizard_'.$this->context['tpl'].'View.php');        
        $this->view = t3lib_div::makeInstance('tx_imagemapwizard_'.$this->context['tpl'].'View');
        $this->view->init($this->context['key']);    
    }


	/**
	 * Generate the Form since this is directly called we have to repeat some initial steps
	 *
	 * @param	Object		PA
	 * @param	Object		fobj
	 * @return	String		HTMLCode with form-field
	 */
    function renderForm($PA, t3lib_TCEforms $fobj) {
        
        $GLOBALS['BE_USER']->setAndSaveSessionData('imagemap_wizard.value',NULL);            
        
        $this->params['table'] = $PA['table'];
        $this->params['field'] = $PA['field'];
        $this->params['uid'] = $PA['row']['uid'];
        $this->params['pObj'] = $PA['pObj'];
        $this->params['itemFormElName'] = $PA['itemFormElName'];

        $this->initContext('form');
        $this->initView();
        return $this->triggerAction();

    }
}

?>