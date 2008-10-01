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
 * Class/Function which renders the Witard-Form with the Data provided by the given Data-Object.
 *
 * @author	Tolleiv Nietsch <info@tolleiv.de>
 */

require_once(t3lib_extMgm::extPath('css_styled_content').'pi1/class.tx_cssstyledcontent_pi1.php');

class tx_imagemapwizard_backendView {

    protected $doc,$data,$jsFiles,$cssFiles,$inlineJs,$id;
  /**
   * Just initialize the View, fill internal variables etc...
   */
    public function init() {
    $this->jsFiles = array();
    $this->cssFiles = array();
    $this->id = "imagemap".t3lib_div::shortMD5(rand(1,100000));
        $this->doc = t3lib_div::makeInstance('noDoc');
    $this->doc->backPath = $GLOBALS['BACK_PATH'];
    $this->doc->docType = 'xhtml_trans';
    $this->doc->form = $this->getFormTag();
    }

  /**
   * Sets the relates Data-Model-Object
   *
   * @param tx_imagemapwizard_dataObject Data-Object
   */
    public function setData(tx_imagemapwizard_dataObject $data) {
      $this->data=$data;
    }

  /**
   * Renders Content and prints it to the screen (or any active output buffer)
   */
    public function renderContent() {
        $this->params = t3lib_div::_GP('P');
        // t3lib_div::debug($this->params);
        // Setting field-change functions:
    $fieldChangeFuncArr = $this->params['fieldChangeFunc'];
    $update = '';
    if (is_array($fieldChangeFuncArr))	{
      unset($fieldChangeFuncArr['alert']);
      foreach($fieldChangeFuncArr as $v)	{
        $update.= '
        parent.opener.'.$v;
      }
    }

    $this->doc->JScode = $this->doc->wrapScriptTags('
      function checkReference()	{	//
        if (parent.opener && parent.opener.document && parent.opener.document.'.$this->params['formName'].' && parent.opener.document.'.$this->params['formName'].'["'.$this->params['itemName'].'"])	{
          return parent.opener.document.'.$this->params['formName'].'["'.$this->params['itemName'].'"];
        } else {
          close();
        }
      }
      function setValue(input)	{	//
        var field = checkReference();
        if (field)	{
          field.value = input;
          '.$update.'
        }
      }
      function getValue()	{	//
        var field = checkReference();
        return field.value;
      }
    ');

        $this->content.=$this->doc->startPage($GLOBALS['LANG']->getLL('imagemap_wizard.title'));

        ob_start();
        include(t3lib_extMgm::extPath('imagemap_wizard').'templates/defaultTemplate.php');
        $mainContent = ob_get_contents();
        ob_end_clean();
        $this->content.= $this->doc->section($GLOBALS['LANG']->getLL('imagemap_wizard.title'), $mainContent, 0,1);
        $this->content.= $this->doc->endPage();

        $this->content = $this->insertMyStylesAndJs($this->content);

    echo $this->doc->insertStylesAndJS($this->content);
    }

  /**
   * Collect required Javascript-Resoucres
   *
   * @param String Filename
   */
    protected function addExternalJS($file) {
      if(!in_array($file,$this->jsFiles)) {
        $this->jsFiles[] = $file;
      }
    }

    /**
     * Collect required Inline-Javascript.
     *
     * @param String Javascript-Block
     */
    protected function addInlineJs($js) {
    $this->inlineJs .= "\n\n".$js;
    }


  /**
   * Collect required CSS-Resoucres
   *
   * @param String Filename
   */
    protected function addExternalCSS($file) {
      if(!in_array($file,$this->cssFiles)) {
        $this->cssFiles[] = $file;
      }
    }

  /**
   * Inserts the collected Resource-References to the Header
   *
   * @param String Content
   */
    protected function insertMyStylesAndJs($content) {

      if(is_array($this->jsFiles)) {
        foreach($this->jsFiles as $file) {
          $scriptTag = '<script type="text/javascript" src="'.$file.'"></script>';
          $content = str_replace('<!--###POSTJSMARKER###-->',$scriptTag.'<!--###POSTJSMARKER###-->',$content);
        }
      }

      if(trim($this->inlineJs)) {
        $scriptTag = '<script type="text/javascript">'.trim($this->inlineJs).'</script>';
        $content = str_replace('<!--###POSTJSMARKER###-->',$scriptTag.'<!--###POSTJSMARKER###-->',$content);
      }

      if(is_array($this->cssFiles)) {
        foreach($this->cssFiles as $file) {
          $linkTag = '<link rel="stylesheet" type="text/css" href="'.$file.'" />';
          $content = str_replace('<!--###POSTJSMARKER###-->',$linkTag.'<!--###POSTJSMARKER###-->',$content);
        }
      }
      return $content;
    }

  /**
   * Create a Wizard-Icon for the Link-Wizard
   *
   * @param String linkId ID for the id-attribute of the generated Link
   * @param String fieldName Name of the edited field
   * @param String fieldValue current value of the field (mostly a placeholder is used)
   * @param String updateCallback the Javascript-Callback in case of successful change
   * @return String Generated HTML-link to the Link-Wizard
   */
    protected function linkWizardIcon($linkId,$fieldName,$fieldValue,$updateCallback='') {

      $params = array(
        //'act' => 'page',
        'mode' => 'wizard',
        //'table' => 'tx_dummytable',
        'field' => $fieldName,
        'P[returnUrl]' => t3lib_div::linkThisScript(),
        'P[formName]' => $this->id,
        'P[itemName]' => $fieldName,
        'P[fieldChangeFunc][focus]' => 'focus()',
        'P[currentValue]' => $fieldValue,
      );
      if($updateCallback) $params['P[fieldChangeFunc][callback]'] = $updateCallback;

         $link = t3lib_div::linkThisUrl($this->doc->backPath.'browse_links.php', $params);
         return "<a href=\"#\" id=\"".$linkId."\" onclick=\"this.blur(); vHWin=window.open('".$link."','','height=600,width=500,status=0,menubar=0,scrollbars=1');vHWin.focus();return false;\">".$this->getIcon("gfx/link_popup.gif")."</a>";
  }

	/**
	 * Create a valid and unique form-tag
	 *
	 * @return String the HTML-form-tag
	 */
	protected function getFormTag() {
		return "<form id='".$this->id."' name='".$this->id."'>";
	}

	/**
	 * Create a img-tag with a TYPO3-Skinicon
	 *
	 * @param String skinPath the Path to the TYPO3-icon
	 * @param String attr additional required attributes
	 * @return String HTML-img-tag
	 */
	protected function getIcon($skinPath,$attr='') {
		return "<img ".t3lib_iconWorks::skinImg($this->doc->backPath,$skinPath).($attr?' '.$attr:'')." />";
	}

}

?>