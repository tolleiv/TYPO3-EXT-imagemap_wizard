<?php

require_once(t3lib_extMgm::extPath('imagemap_wizard').'classes/model/class.tx_imagemapwizard_mapper.php');

class converting_testcase extends tx_phpunit_testcase {

	public function test_basicMap2ArrayWorks() {
    	$helper = t3lib_div::makeInstance('tx_imagemapwizard_mapper');

		$this->assertEquals(array('name'=>'map'),$helper->map2array('<map></map>'),'Map to Array mappings fails to convert empty Maps');
		$this->assertEquals(array('name'=>'map'),$helper->map2array('<map />'),'Map to Array mappings fails to convert empty Maps');
		$this->assertEquals(array('name'=>'map','@'=>array('name'=>'test')),$helper->map2array('<map name="test"></map>'),'Map to Array fails to extract the Name-Attribute.');
	}
	public function test_singleAreaInMap2ArrayWorks() {
    	$helper = t3lib_div::makeInstance('tx_imagemapwizard_mapper');

        $supposed = array(
        		'name'=>'map',
                '@'=>array('name'=>'test'),
                '#'=>array(array('name'=>'area','@'=>array('shape'=>'rect','coord'=>'0,0,1,1'))),
        );

        $this->assertEquals($supposed,$helper->map2array('<map name="test"><area shape="rect" coord="0,0,1,1" /></map>'),'Map is not converted as supposed');

        $supposed['#'][0]['value']='1';
        $this->assertEquals($supposed,$helper->map2array('<map name="test"><area shape="rect" coord="0,0,1,1">1</area></map>'),'Map is not converted / Value is ot set as supposed');

    }

    public function test_basicArray2MapWorks() {
    	$helper = t3lib_div::makeInstance('tx_imagemapwizard_mapper');

    	$this->assertEquals('<map />',$helper->array2map(array()),'Empty Map-creation fails.');
    	$this->assertEquals('<map name="test" />',$helper->array2map(array('name'=>'map','@'=>array('name'=>'test'))),'Map without areas is not created as supposed');
    	$this->assertEquals('<map>value</map>',$helper->array2map(array('value'=>'value')),'Values are not represented within the map.');
    }

    public function test_simpleMapWithAreaConverts() {
    	$helper = t3lib_div::makeInstance('tx_imagemapwizard_mapper');

        $inputArray = array(
        		'name'=>'map',
                '@'=>array('name'=>'test'),
                '#'=>array(array('name'=>'area','@'=>array('shape'=>'rect','coord'=>'0,0,1,1','typolink'=>'1'))),
        );

		$inputString = '<map name="test"><area shape="rect" coord="0,0,1,1" typolink="1" /></map>';

        $this->assertEquals($inputString,$helper->array2map($helper->map2array($inputString)),'Map is destroyed within the conversions');
        $this->assertEquals($inputArray,$helper->map2array($helper->array2map($inputArray)),'Map is destroyed within the conversions');
    }


}


?>