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
 * Class/Function encapsulates TYPO3 enviromental operations
 *
 * @author	Tolleiv Nietsch <info@tolleiv.de>
 */


define('PATH_tslib', PATH_site.'typo3/sysext/cms/tslib/');

class tx_imagemapwizard_typo3env {

	/**
	 * Initialize TSFE so that the Frontend-Stuff can also be used in the Backend
	 *
	 * @param	Integer		pid The pid if the page which is simulated
	 * @return	Boolean		returns success of the operation
	 */
	function initTSFE($pid = 1){
		require_once(PATH_site.'typo3/sysext/cms/tslib/class.tslib_fe.php');
		require_once(PATH_site.'t3lib/class.t3lib_userauth.php');
		require_once(PATH_site.'typo3/sysext/cms/tslib/class.tslib_feuserauth.php');
		require_once(PATH_site.'t3lib/class.t3lib_cs.php');
		require_once(PATH_site.'typo3/sysext/cms/tslib/class.tslib_content.php') ;
		require_once(PATH_site.'t3lib/class.t3lib_tstemplate.php');
		require_once(PATH_site.'t3lib/class.t3lib_page.php');
		require_once(PATH_site.'t3lib/class.t3lib_timetrack.php');

		$TSFEclassName = t3lib_div::makeInstanceClassName('tslib_fe');
		$GLOBALS['TSFE'] = new $TSFEclassName($GLOBALS['TYPO3_CONF_VARS'], $pid, '0', 0, '','','','');
		$temp_TTclassName = t3lib_div::makeInstanceClassName('t3lib_timeTrack');
		$GLOBALS['TT'] = new $temp_TTclassName();
		$GLOBALS['TT']->start();
		$GLOBALS['TSFE']->config['config']['language']=$_GET['L'];
		$GLOBALS['TSFE']->id = $pid;
		$GLOBALS['TSFE']->connectToMySQL();
		$sqlDebug = $GLOBALS['TYPO3_DB']->debugOutput;
		$GLOBALS['TYPO3_DB']->debugOutput = false;
		$GLOBALS['TSFE']->initLLVars();
		$GLOBALS['TSFE']->initFEuser();
		$GLOBALS['TSFE']->sys_page = t3lib_div::makeInstance('t3lib_pageSelect');
		$GLOBALS['TSFE']->sys_page->init($GLOBALS['TSFE']->showHiddenPage);
		$GLOBALS['TSFE']->sys_page->init($GLOBALS['TSFE']->showHiddenPage);
		$page = $GLOBALS['TSFE']->sys_page->getPage($pid);
		if (count($page) == 0) {
			$GLOBALS['TYPO3_DB']->debugOutput = $sqlDebug;
			return false;
		}
		if ($page['doktype']==4 && count($GLOBALS['TSFE']->getPageShortcut($page['shortcut'],$page['shortcut_mode'],$page['uid'])) == 0) {
			$GLOBALS['TYPO3_DB']->debugOutput = $sqlDebug;
			return false;
		}

		if ($page['doktype'] == 199 || $page['doktype'] == 254) {
			$GLOBALS['TYPO3_DB']->debugOutput = $sqlDebug;
			return false;
		}
		$GLOBALS['TSFE']->getPageAndRootline();
		$GLOBALS['TSFE']->initTemplate();
		$GLOBALS['TSFE']->forceTemplateParsing = 1;
		$GLOBALS['TSFE']->tmpl->start($GLOBALS['TSFE']->rootLine);
		$GLOBALS['TSFE']->sPre = $GLOBALS['TSFE']->tmpl->setup['types.'][$GLOBALS['TSFE']->type];        // toplevel - objArrayName
		$GLOBALS['TSFE']->pSetup = $GLOBALS['TSFE']->tmpl->setup[$GLOBALS['TSFE']->sPre.'.'];
		if (!$GLOBALS['TSFE']->tmpl->loaded || ($GLOBALS['TSFE']->tmpl->loaded && !$GLOBALS['TSFE']->pSetup)) {
			$GLOBALS['TYPO3_DB']->debugOutput = $sqlDebug;
			return false;
		}
		$GLOBALS['TSFE']->getConfigArray();
		$GLOBALS['TSFE']->getCompressedTCarray();
		$GLOBALS['TSFE']->inituserGroups();
		$GLOBALS['TSFE']->connectToDB();
		$GLOBALS['TSFE']->determineId();
		$GLOBALS['TSFE']->newCObj();
		return true;
	}
}



?>