/* global QUnit */
QUnit.config.autostart = false;

sap.ui.require(["sample/project1/test/integration/AllJourneys"
], function () {
	QUnit.start();
});
