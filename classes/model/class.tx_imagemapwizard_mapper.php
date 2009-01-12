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
 * Class/Function provides various convertion-methods for Map-Data and generates a HTML-Imagemap out of a given pseudo-map
 *
 * @author	Tolleiv Nietsch <info@tolleiv.de>
 */
class tx_imagemapwizard_mapper {

	/**
	 * Generate a HTML-Imagemap using Typolink etc..
	 *
	 * @param tslib_cObj cObj cObject we used for genenerating the Links
	 * @param String name Name of the generated map
	 * @param String mapping the XML_pseudo-imagemap
	 * @return String the valid HTML-imagemap (hopefully valid)
	 */
	public function generateMap(tslib_cObj &$cObj,$name,$mapping=NULL,$whitelist=NULL) {
        $useWhitelist = is_array($whitelist);
        if($useWhitelist) {
            $whitelist = array_flip($whitelist);
        }
		//$helper = t3lib_div::makeInstance('tx_imagemapwizard_mapconverter');
		$mapArray = self::map2array($mapping);
		$mapArray['@']['name']=$this->createValidNameAttribute($name);

		while(is_array($mapArray['#']) && (list($key,$node) = each($mapArray['#']))) {
			if(!$node['value'] && !$node['@']['href']) continue;
			$tmp = self::map2array($cObj->typolink('-',$this->getTypolinkSetup($node['value']?$node['value']:$node['@']['href'])),'a');
			if(is_array($tmp['@'])) {
				unset($mapArray['#'][$key]['@']['href']);
				$mapArray['#'][$key]['@'] = array_merge($tmp['@'],$mapArray['#'][$key]['@']);
                
                if($useWhitelist) {
                    $mapArray['#'][$key]['@'] = array_intersect_key($mapArray['#'][$key]['@'],$whitelist);
                }
                
				// if(!isset($mapArray['#'][$key]['@']['href']))... what to do here???
			}
			unset($mapArray['#'][$key]['value']);
		}
		return self::array2map($mapArray);
	}

	/**
	 * Encapsulates the creation of valid HTML-imagemap-names
	 *
	 * @param String value
	 * @return String transformed value
	 */

	public function createValidNameAttribute($value) {
        
        if(!preg_match('/\S+/',$value)) {
            $value = t3lib_div::shortMD5(rand(0,100));
        }
		return preg_replace('/[^a-zA-Z0-9\-_]/i','-',$value);
	}

	/**
	 * Encapsulates the creation of a valid typolink-conf array
	 *
	 * @param String param the paramater which is used for the link-generation
	 * @return Array typolink-conf array
	 */
	protected function getTypolinkSetup($param) {
		return array('parameter'=>$param);
	}


	/**
	 * Convert XML into a lightweight Array, keep Attributes, Values etc,
	 * is limited to one level (no recursion) since this is enough for the imagemap
	 *
	 * @see	 array2map
	 * @param String value the XML-map
	 * @param String basetag the Root-Tag of the resulting Array
	 * @return Array transformed Array keys: 'name'~Tagname, 'value'~Tagvalue, '@'~Sub-Array with Attributes, '#'~Sub-Array with Childnodes
	 */
	public static function map2array($value,$basetag='map') {
        $ret = array('name'=>$basetag);
		if(!($xml = @simplexml_load_string($value))) return $ret;

		if(!($xml->getName() == $basetag)) return $ret;

        if(self::nodeHasAttributes($xml)) {
            $ret['@'] = self::getAttributesFromXMLNode($xml);
       }
		$ret['#']=array();
		foreach ($xml->children() as $subNode) {
			$newChild = array();
			$newChild['name']=$subNode->getName();
			if((string)$subNode) {
				$newChild['value']=(string)$subNode;
			}
			if(self::nodeHasAttributes($subNode)) {
				$newChild['@']=self::getAttributesFromXMLNode($subNode);
			}
			$ret['#'][]=$newChild;
		}
       	if(!count($ret['#'])) unset($ret['#']);
		return $ret;
	}

	/**
	 * Convert a PHP-Array into a XML-Structure
	 *
	 * @see map2array
	 * @param Array value a Array which uses the same notation as described above
	 * @param Integer level counting the current level for recursion...
	 * @return String XML-String
	 */
	public static function array2map($value,$level=0) {

		if((!$value['name']) && ($level==0)) $value['name']='map';
		$ret = NULL;
		if(!$value['#'] && !$value['value']) {
			$ret = '<'.$value['name'].self::implodeXMLAttributes($value['@']).' />';
		} else {
			$ret = '<'.$value['name'].self::implodeXMLAttributes($value['@']).'>';
			while(is_array($value['#']) && (list(,$subNode) = each($value['#']))) {
				$ret .= self::array2map($subNode,$level+1);
			}
			$ret.= $value['value'];
			$ret.= '</'.$value['name'].'>';
		}
		return $ret;
	}

    /**
    *
    */
    public function compareMaps($map1,$map2) {
        $arrayMap1 = self::map2array($map1);
        $arrayMap2 = self::map2array($map2);
        return self::arrays_match($arrayMap1,$arrayMap2);
    }


	/**
	 * Encapsulate the extraction of Attributes out of the SimpleXML-Structure
	 *
	 * @param SimpleXMLNode node
	 * @param String attr determindes if a single of (if empty) all attributes should be extracted
	 * @return Mixed Extracted attribute(s)
	 *
	 */
    protected static function getAttributesFromXMLNode($node,$attr=NULL) {
    	$tmp = (array)$node->attributes();
        return ($attr==NULL)?$tmp['@attributes']:(string)$tmp['@attributes'][$attr];
    }

	/**
	 * Check whether a node has any attributes or not
	 *
	 * @param SimpleXMLNode node
	 * @return Boolean
	 */
    protected static function nodeHasAttributes($node) {
        return is_array(self::getAttributesFromXMLNode($node));
    }

	/**
	 * Combines a array of attributes into a HTML-conform list
	 *
	 * @param Array attributes
	 * @return String
	 */
	protected static function implodeXMLAttributes($attributes) {
		if(!is_array($attributes)) return '';
		$ret = '';
		foreach($attributes as $key=>$value) {
			$ret.= sprintf(' %s="%s"',$key,$value);
		}
		return $ret;
	}
    
    protected static function arrays_match($a,$b) {
        if(!is_array($a) || !is_array($b)) {        
            return $a==$b;
        }
        $match = true;
        foreach($a as $key=>$value) {
            $match = $match && self::arrays_match($a[$key],$b[$key]);
        }
        foreach($b as $key=>$value) {
            $match = $match && self::arrays_match($b[$key],$a[$key]);
        }
        return $match;
    }
}


if (defined('TYPO3_MODE') && $TYPO3_CONF_VARS[TYPO3_MODE]['XCLASS']['ext/imagemap_wizard/classes/model/class.tx_imagemapwizard_mapper.php'])    {
    include_once($TYPO3_CONF_VARS[TYPO3_MODE]['XCLASS']['ext/imagemap_wizard/classes/model/class.tx_imagemapwizard_mapper.php']);
}


?>