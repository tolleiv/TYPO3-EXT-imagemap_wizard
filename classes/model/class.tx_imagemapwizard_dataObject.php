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
    protected $modifiedFlag = false;
	public function __construct($table,$field,$uid,$currentValue=NULL) {
	    $this->table = $table;
	    t3lib_div::loadTCA($this->table);
		$this->imageField = $this->determineImageFieldName();
	    $this->mapField = $field;
        $this->row = t3lib_BEfunc::getRecordWSOL($table,$uid);
        if($currentValue) { $this->useCurrentData($currentValue); }        
        $this->liveRow = $this->row;
        t3lib_BEfunc::fixVersioningPid($table,$this->liveRow);

	    $this->map = t3lib_div::makeInstance("tx_imagemapwizard_mapper")->map2array($this->row[$this->mapField]);

        //eval for the XCLASSes
	    $this->backPath = eval('return '.t3lib_div::makeInstanceClassName('tx_imagemapwizard_typo3env').'::getBackPath();');
    }

	public function getFieldValue($field,$listNum=-1) {
		if(is_array($this->row) && array_key_exists($field,$this->row)) {
            if($listNum == -1) {
                return $this->row[$field];
            } else {
                $tmp = split(',',$this->row[$field]);
                return $tmp[$listNum];
            }
        }
		return NULL;
	}
    /**
    *   retrives current imagelocation - if multiple files are stored in the field only the first is recognized
    */
	public function getImageLocation($abs=false) {
		return ($abs?PATH_site:$this->backPath).$GLOBALS['TCA'][$this->table]['columns'][$this->imageField]['config']['uploadfolder'].'/'.$this->getFieldValue($this->imageField,0);
	}
    
	public function hasValidImageFile() {
		return is_file($this->getImageLocation(true))&&is_readable($this->getImageLocation(true));
	}

	public function renderImage() {
		$t3env = t3lib_div::makeInstance('tx_imagemapwizard_typo3env');
		if(!$t3env->initTSFE($this->getLivePid(),$GLOBALS['BE_USER']->workspace,$GLOBALS['BE_USER']->user['uid'])) {
			return 'Can\'t render image since TYPO3 Environment is not ready.<br/>Error was:'.$t3env->get_lastError();
		}
		$conf = array('table'=>$this->table,'select.'=>array('uidInList'=>$this->getLiveUid()));

		//render like in FE with WS-preview etc...
		$t3env->pushEnv();
		$t3env->setEnv(PATH_site);
        $t3env->resetEnableColumns($this->table);       // no fe_group, start/end, hidden restrictions needed :P
		$result = $GLOBALS['TSFE']->cObj->CONTENT($conf);
		$t3env->popEnv();

		// extract the image
		$matches=array();
		if(!preg_match('/(<img[^>]+usemap="####IMAGEMAP_USEMAP###"[^>]*\/>)/',$result,$matches)) {
			return 'No Image rendered from TSFE. :(<br/>Error was:'.$t3env->get_lastError();
		}
		$result = str_replace('src="','src="'.($this->backPath),$matches[1]);
		return $result;
	}

    public function renderThumbnail($confKey,$defaultMaxWH) {
        $maxSize = t3lib_div::makeInstance('tx_imagemapwizard_typo3env')->getExtConfValue($confKey,$defaultMaxWH);
		$img = $this->renderImage();
		$matches = array();
		if(preg_match('/width="(\d+)" height="(\d+)"/',$img,$matches)) {
			$width = intval($matches[1]);
			$height = intval($matches[2]);
			if(($width > $maxSize) && ($width >= $height)) {
				$height = ($maxSize/$width)*$height;
				$width = $maxSize;
			} else if($height > $maxSize) {
				$width = ($maxSize/$height)*$width;	
				$height = $maxSize;
			}
			return preg_replace('/width="(\d+)" height="(\d+)"/','width="'.$width.'" height="'.$height.'"',$img);
			
		} else {
			return '';
		}
    }
    
    public function getThumbnailScale($confKey,$defaultMaxWH) {
        $maxSize = t3lib_div::makeInstance('tx_imagemapwizard_typo3env')->getExtConfValue($confKey,$defaultMaxWH);    
        $ret = 1;
		$img = $this->renderImage();
		$matches = array();
		if(preg_match('/width="(\d+)" height="(\d+)"/',$img,$matches)) {
			$width = intval($matches[1]);
			$height = intval($matches[2]);
			if(($width > $maxSize) && ($width >= $height)) {
				$ret = ($maxSize/$width);
			} else if($height > $maxSize) {
				$ret = ($maxSize/$height);
			}
		}
		return $ret;
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
                                "##attributes##"=>$this->listAttributesAsSet($area)
							);

			$result .= str_replace(array_keys($markers),array_values($markers),$template);

		}
		return $result;
	}
    
    protected function listAttributesAsSet($area) {
        $relAttr = $this->getAttributeKeys();
        $ret = array();
        foreach($relAttr as $key) {
            $ret[] = $key.':\''.(array_key_exists($key,$area["@"])?$area["@"][$key]:'').'\'';
        }
        return implode(',',$ret);
    }

    public function getAttributeKeys() {
        $keys = t3lib_div::trimExplode(',',eval('return '.t3lib_div::makeInstanceClassName('tx_imagemapwizard_typo3env').'::getExtConfValue(\'additionalAttributes\',\'\');'),true);
        return array_diff($keys,array('alt','href','shape','coords'));
    }


    protected function getLivePid() {
        return $this->row['pid']>0?$this->row['pid']:$this->liveRow['pid'];
    }

    protected function getLiveUid() {
        return (($GLOBALS['BE_USER']->workspace===0) || ($this->row['t3ver_oid']==0))?$this->row['uid']:$this->row['t3ver_oid'];
    }

	protected function determineImageFieldName() {
		return isset($GLOBALS['TCA'][$this->table]['columns'][$this->mapField]['config']['userImageField'])?$GLOBALS['TCA'][$this->table]['columns'][$this->mapField]['config']['userImageField']:'image';
	}

    public function getTablename() {
        return $this->table;
    }

    public function getFieldname() {
        return $this->mapField;
    }

    public function getRow() {
        return $this->row;
    }
    
    public function getUid() {
        return $this->row['uid'];
    }
    
    public function useCurrentData($value) {        
        if(!t3lib_div::makeInstance("tx_imagemapwizard_mapper")->compareMaps($this->row[$this->mapField],$value)) {
            $this->modifiedFlag = true;
        }
        $this->row[$this->mapField] = $value;
    }
    
    public function hasDirtyState() {
        return $this->modifiedFlag;
    }
}


if (defined('TYPO3_MODE') && $TYPO3_CONF_VARS[TYPO3_MODE]['XCLASS']['ext/imagemap_wizard/classes/model/class.tx_imagemapwizard_dataObject.php'])    {
    include_once($TYPO3_CONF_VARS[TYPO3_MODE]['XCLASS']['ext/imagemap_wizard/classes/model/class.tx_imagemapwizard_dataObject.php']);
}

?>
