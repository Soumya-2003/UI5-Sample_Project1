sap.ui.define([
	"sap/ui/core/library", 
	'sap/uxap/BlockBase'], 
	function (library, BlockBase) {
	"use strict";

	var ViewType = library.mvc.ViewType;

	var AboutBlock = BlockBase.extend("Blocks.About.About", {
		metadata: {
			views: {
				Collapsed: {
					viewName: "Blocks.About.About",
					type: ViewType.XML
				},
				Expanded: {
					viewName: "Blocks.About.About",
					type: ViewType.XML
				}
			}
		}
	});
	return AboutBlock;
});

