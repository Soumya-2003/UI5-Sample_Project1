sap.ui.define([
	"sap/ui/core/library", 
	'sap/uxap/BlockBase'], 
	function (library, BlockBase) {
	"use strict";

	var ViewType = library.mvc.ViewType;

	var CourseBlock = BlockBase.extend("sample.project1.Blocks.Course.CourseBlock", {
		metadata: {
			views: {
				Collapsed: {
					viewName: "sample.project1.Blocks.Course.CourseBlock",
					type: ViewType.XML
				},
				Expanded: {
					viewName: "sample.project1.Blocks.Course.CourseBlock",
					type: ViewType.XML
				}
			}
		}
	});
	return CourseBlock;
});

