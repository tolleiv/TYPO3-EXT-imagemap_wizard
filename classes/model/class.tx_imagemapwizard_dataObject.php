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
 * Class/Function used to access the given Map-Data within Backend-Forms
 *
 * @author	Tolleiv Nietsch <info@tolleiv.de>
 */

require_once(t3lib_extMgm::extPath('imagemap_wizard').'classes/model/class.tx_imagemapwizard_typo3env.php');
require_once(t3lib_extMgm::extPath('imagemap_wizard').'classes/model/class.tx_imagemapwizard_mapper.php');
require_once(PATH_t3lib.'class.t3lib_stdgraphic.php');
require_once(PATH_tslib.'class.tslib_gifbuilder.php');

class tx_imagemapwizard_dataObject {
	protected $row,$table,$mapField,$imageField,$backPath;
	public function __construct($table,$field,$uid) {
	    $this->table = $table;
	    t3lib_div::loadTCA($this->table);

		$this->imageField = $this->determineImageFieldName();

		$tmp = $GLOBALS['TYPO3_DB']->exec_SELECTgetRows('*',$table,' uid = "'.intval($uid).'"'.t3lib_BEfunc::deleteClause($this->table),'','');
		if(count($tmp)!=1) die("Inconsistend database...expected 1 dataset instead of " + count($tmp));
		$this->row = $tmp[0];

	    $this->mapField = $field;
	    $this->map = t3lib_div::makeInstance("tx_imagemapwizard_mapper")->map2array($this->row[$this->mapField]);
		$this->backPath = str_replace(TYPO3_mainDir,'',$GLOBALS['BACK_PATH']);

	}

	public function getFieldValue($field) {
		if(array_key_exists($field,$this->row)) return $this->row[$field];
		return NULL;
	}

	public function getImageLocation() {
		return $this->backPath.$GLOBALS['TCA'][$this->table]['columns'][$this->imageField]['config']['uploadfolder'].'/'.$this->getFieldValue($this->imageField);
	}

	public function hasValidImageFile() {
		return is_readable(PATH_site.$this->getImageLocation());
	}

	public function renderImage() {

		t3lib_div::makeInstance('tx_imagemapwizard_typo3env')->initTSFE($this->row['pid']);
		$conf = array('table'=>$this->table,'select.'=>array('uidInList'=>$this->row['uid']));

		chdir($this->backPath);
		//render like in FE
		$result = $GLOBALS['TSFE']->cObj->CONTENT($conf);

		// extract the image
		$matches=array();
		if(!preg_match('/(<img[^>]+usemap="####IMAGEMAP_USEMAP###"[^>]*\/>)/',$result,$matches)) die('no image found :(');
		$result = str_replace('src="','src="'.$this->backPath,$matches[1]);

		chdir(t3lib_extMgm::extPath('imagemap_wizard'));

		return $result;
	}


	public function listAreas($template="") {
		if(!is_array($this->map["#"])) return '';
		$result = '';
		foreach($this->map["#"] as $area) {
			$markers = array(	"##coords##"=>$area["@"]["coords"],
								"##shape##"=>ucfirst($area["@"]["shape"]),
								"##color##"=>$area["@"]["color"],
								"##link##"=>$area["value"],
							);

			$result .= str_replace(array_keys($markers),array_values($markers),$template);

		}
		return $result;
	}

	protected function determineImageFieldName() {
		return isset($GLOBALS['TCA'][$this->table]['columns'][$this->mapField]['config']['userImageField'])?$GLOBALS['TCA'][$this->table]['columns'][$this->mapField]['config']['userImageField']:'image';
	}

}

?>