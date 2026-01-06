sap.ui.define([
	"sap/ui/core/library", 
	'sap/uxap/BlockBase'], 
	function (library, BlockBase) {
	"use strict";

	var ViewType = library.mvc.ViewType;

	var SoftSkill = BlockBase.extend("sample.project1.Blocks.Skill.SoftSkill", {
		metadata: {
			views: {
				Collapsed: {
					viewName: "sample.project1.Blocks.Skill.SoftSkill",
					type: ViewType.XML
				},
				Expanded: {
					viewName: "sample.project1.Blocks.Skill.SoftSkill",
					type: ViewType.XML
				}
			}
		}
	});
	return SoftSkill;
});

