sap.ui.define([
	"sap/ui/core/library", 
	'sap/uxap/BlockBase'], 
	function (library, BlockBase) {
	"use strict";

	var ViewType = library.mvc.ViewType;

	var TechnicalSkill = BlockBase.extend("sample.project1.Blocks.Skill.TechnicalSkill", {
		metadata: {
			views: {
				Collapsed: {
					viewName: "sample.project1.Blocks.Skill.TechnicalSkill",
					type: ViewType.XML
				},
				Expanded: {
					viewName: "sample.project1.Blocks.Skill.TechnicalSkill",
					type: ViewType.XML
				}
			}
		}
	});
	return TechnicalSkill;
});

