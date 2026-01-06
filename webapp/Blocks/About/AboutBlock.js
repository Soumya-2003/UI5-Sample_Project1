sap.ui.define(["sap/ui/core/library", 'sap/uxap/BlockBase'], function (coreLibrary, BlockBase) {
	"use strict";

	var ViewType = coreLibrary.mvc.ViewType;

	var AboutBlock = BlockBase.extend("Blocks.About.AboutBlock", {
		metadata: {
			views: {
				Collapsed: {
					viewName: "Blocks.About.AboutBlock",
					type: ViewType.XML
				},
				Expanded: {
					viewName: "Blocks.About.AboutBlock",
					type: ViewType.XML
				}
			}
		}
	});
	return AboutBlock;
});
