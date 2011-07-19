<?php
/**
 * AllSystemTest file
 *
 * Bancha Project : Combining Ext JS and CakePHP (http://banchaproject.org)
 * Copyright 2011, Roland Schuetz, Kung Wong, Andreas Kern, Florian Eckerstorfer
 *
 * Licensed under The MIT License
 * Redistributions of files must retain the above copyright notice.
 *
 * @package       bancha.libs
 * @copyright     Copyright 2011 Roland Schuetz, Kung Wong, Andreas Kern, Florian Eckerstorfer
 * @link          http://banchaproject.org Bancha Project
 * @since         Bancha v1.0
 * @license       MIT License (http://www.opensource.org/licenses/mit-license.php)
 * @author        Florian Eckerstorfer <f.eckerstorfer@gmail.com>
 * @author        Andreas Kern <andreas.kern@gmail.com>
 * @author        Roland Schuetz <mail@rolandschuetz.at>
 * @author        Kung Wong <kung.wong@gmail.com>
 */

/**
 * AllSystemTest class
 *
 * This test group will run all test in the Bancha/Test/Case/System directory
 *
 * @package       bancha.tests.groups
 */
class AllSystemTest extends PHPUnit_Framework_TestSuite {

/**
 * Suite define the tests for this suite
 *
 * @return void
 */
	public static function suite() {
		$suite = new CakeTestSuite('System tests');

		$path = dirname(__FILE__) . DS . 'System';
		$suite->addTestFile($path . DS . 'BanchaCrudTest.php');
		$suite->addTestFile($path . DS . 'BanchaFormTest.php');
		$suite->addTestFile($path . DS . 'ConsistentModelTest.php');

		$suite->addTestDirectory($path);
		return $suite;
	}
}