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
 * Class/Function ...
 *
 * @author	Tolleiv Nietsch <info@tolleiv.de>
 */

require_once(t3lib_extMgm::extPath('imagemap_wizard').'classes/model/class.tx_imagemapwizard_mapper.php');

 class tx_imagemapwizard_parser extends tslib_pibase {

	public function applyImageMap($content,$conf) {
		//	t3lib_div::debug(array($content,$conf,$this->cObj->data));

		$converter = t3lib_div::makeInstance('tx_imagemapwizard_mapper');
		//$converter->init();
        $mapname = $this->cObj->stdWrap(preg_replace('/\s/','-',$this->cObj->getData($conf['map.']['name'],$this->cObj->data)),$conf['map.']['name.']);
		$map = $converter->generateMap($this->cObj,$mapname,$this->cObj->getData($conf['map.']['data'],$this->cObj->data));

		return str_replace('###IMAGEMAP_USEMAP###',$mapname,$content).$map;
	}


 }


?>