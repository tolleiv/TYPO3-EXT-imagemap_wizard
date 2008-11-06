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
	protected $row,$liveRow,$table,$mapField,$imageField,$backPath;
	public function __construct($table,$field,$uid) {
	    $this->table = $table;
	    t3lib_div::loadTCA($this->table);

		$this->imageField = $this->determineImageFieldName();
		$this->row = t3lib_BEfunc::getRecordWSOL($table,$uid);
        $this->liveRow = $this->row;
        t3lib_BEfunc::fixVersioningPid($table,$this->liveRow);
	    $this->mapField = $field;
	    $this->map = t3lib_div::makeInstance("tx_imagemapwizard_mapper")->map2array($this->row[$this->mapField]);
        
	    $this->backPath = eval('return '.t3lib_div::makeInstanceClassName('tx_imagemapwizard_typo3env').'::getBackPath();');
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
        $t3env = t3lib_div::makeInstance('tx_imagemapwizard_typo3env');
		if(!$t3env->initTSFE($this->getLivePid(),$GLOBALS['BE_USER']->workspace,$GLOBALS['BE_USER']->user['uid'])) {
            return 'Can\'t render image since TYPO3 Environment is not ready.<br/>Error was:'.$t3env->get_lastError();
        }        
		$conf = array('table'=>$this->table,'select.'=>array('uidInList'=>$this->getLiveUid()));
		//render like in FE with WS-preview etc...
		$t3env->prepareEnv($this->backPath);
		$result = $GLOBALS['TSFE']->cObj->CONTENT($conf);
		$t3env->releaseEnv(t3lib_extMgm::extPath('imagemap_wizard'));		

		// extract the image
		$matches=array();
		if(!preg_match('/(<img[^>]+usemap="####IMAGEMAP_USEMAP###"[^>]*\/>)/',$result,$matches)) {
            return 'No Image rendered from TSFE. :(';
        }
		$result = str_replace('src="','src="'.$this->backPath,$matches[1]);
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
								"##alt##"=>$area["@"]["alt"],
							);

			$result .= str_replace(array_keys($markers),array_values($markers),$template);

		}
		return $result;
	}
    
    protected function getLivePid() {
        return $this->row['pid']>0?$this->row['pid']:$this->liveRow['pid'];
    }
    
    protected function getLiveUid() {
        return ($GLOBALS['BE_USER']->workspace===0)?$this->row['uid']:$this->row['t3ver_oid'];
    }

	protected function determineImageFieldName() {
		return isset($GLOBALS['TCA'][$this->table]['columns'][$this->mapField]['config']['userImageField'])?$GLOBALS['TCA'][$this->table]['columns'][$this->mapField]['config']['userImageField']:'image';
	}

}

?>
