sap.ui.define([], () => {
	"use strict";

	return {
		sLevelCheck(level) {
			switch (level) {
				case "b":
					return "Beginner";
				case "p":
					return "Professional";
				case "e":
					return "Expert";
				default:
					return "Novice";
			}
		}
	};
});