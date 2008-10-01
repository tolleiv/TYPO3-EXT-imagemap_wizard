<?php


class mappings_testcase extends tx_phpunit_testcase {

  function test_creatingEmptyMap() {
    $cObj = $this->getMock('tslib_cObj', array('typolink'));
    $cObj->expects($this->never())->method('typolink');

    $supposedOutput = '<map name="testname" />';
    $this->assertEquals($supposedOutput,$this->mapper->generateMap($cObj,'testname'),'Empty Map is not created as supposed');
    $this->assertEquals($supposedOutput,$this->mapper->generateMap($cObj,'testname',array()),'Empty Map is not created as supposed');
  }

  function test_creatingValidMapNames() {
    $cObj = $this->getMock('tslib_cObj', array('typolink'));
    $cObj->expects($this->never())->method('typolink');

  	$regEx = '/^[a-zA-Z0-9\-_]+$/i';
    $this->assertEquals(1,preg_match($regEx,$this->mapper->createValidNameAttribute('test name')),'Attribute is not cleaned as supposed...');
    $this->assertEquals(1,preg_match($regEx,$this->mapper->createValidNameAttribute('test näme')),'Attribute is not cleaned as supposed...');
    $this->assertEquals(1,preg_match($regEx,$this->mapper->createValidNameAttribute('ÄÖÜ..')),'Attribute is not cleaned as supposed...');
    $regEx = '/^<map name="[a-zA-Z0-9\-_]+" \/>$/i';
    $this->assertEquals(1,preg_match($regEx,$this->mapper->generateMap($cObj,'test name')),'Name-attribute is not cleaned as supposed...');
    $this->assertEquals(1,preg_match($regEx,$this->mapper->generateMap($cObj,'test näme')),'Name-attribute is not cleaned as supposed...');
    $this->assertEquals(1,preg_match($regEx,$this->mapper->generateMap($cObj,'ÄÖÜ..')),'Name-attribute is not cleaned as supposed...');
  }

  function test_creatingSimpleRectMap() {
	$cObj = $this->getMock('tslib_cObj', array('typolink'));
	$cObj->expects($this->atLeastOnce())->method('typolink')->will($this->returnValue('<a href="http://www.foo.org" title="tt">text</a>'));

	$input = '<map><area shape="rect">1</area></map>';
	$output = '<map name="test"><area href="http://www.foo.org" title="tt" shape="rect" /></map>';
	$this->assertEquals($output,$this->mapper->generateMap($cObj,'test',$input),'Generator Output looks not as supposed');
  }
  function test_creatingMapGeneratorKeepsIndividualAttributes() {
	$cObj = $this->getMock('tslib_cObj', array('typolink'));
	$cObj->expects($this->atLeastOnce())->method('typolink')->will($this->returnValue('<a href="http://www.foo.org" title="tt">text</a>'));

	$input = '<map><area shape="rect" title="individual title" xyz="1">1</area></map>';
	$output = '<map name="test"><area href="http://www.foo.org" title="individual title" shape="rect" xyz="1" /></map>';
	$this->assertEquals($output,$this->mapper->generateMap($cObj,'test',$input),'Individual Attributes are lost after Generation');
  }

  function test_creatingMapUsingHrefAttrIfNoValueExists() {
	$cObj = $this->getMock('tslib_cObj', array('typolink'));
	$cObj->expects($this->atLeastOnce())->method('typolink')->will($this->returnValue('<a href="http://www.foo.org">text</a>'));

	//stupid href-value but this proveds that the typolink-function is really used
	$input = '<map><area href="1" shape="rect" /></map>';
	$output = '<map name="test"><area href="http://www.foo.org" shape="rect" /></map>';
	$this->assertEquals($output,$this->mapper->generateMap($cObj,'test',$input),'Href-Attribute is not recognized for the area-link creation.');
  }

  function setUp() {
    require_once(t3lib_extMgm::extPath('imagemap_wizard').'classes/model/class.tx_imagemapwizard_mapper.php');
    $this->mapper = t3lib_div::makeInstance('tx_imagemapwizard_mapper');
  }
  function tearDown() {
    unset($this->mapper);
  }
}


?>
