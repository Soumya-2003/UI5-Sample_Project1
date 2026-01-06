sap.ui.define([
	"sap/ui/core/library", 
	'sap/uxap/BlockBase'], 
	function (library, BlockBase) {
	"use strict";

	var ViewType = library.mvc.ViewType;

	var AboutBlock = BlockBase.extend("sample.project1.Blocks.About.AboutBlock", {
		metadata: {
			views: {
				Collapsed: {
					viewName: "sample.project1.Blocks.About.AboutBlock",
					type: ViewType.XML
				},
				Expanded: {
					viewName: "sample.project1.Blocks.About.AboutBlock",
					type: ViewType.XML
				}
			}
		}
	});
	return AboutBlock;
});

