sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment",
    "sample/project1/helper/themeHelper"
], function (Controller, Fragment, themeHelper) {
    "use strict";

    return Controller.extend("sample.project1.Blocks.Profile.ProfileObjectPage", {

        setUserData: function (sFullName) {
            let sFirst = sFullName.split(" ")[0];
            this.byId("welcomeText").setText("Welcome! " + sFirst);
            this.byId("Username").setText(sFullName);
        },

        onOpenThemeMenu: function (oEvent) {
            if (!this._oThemeMenu) {
                Fragment.load({
                    name: "sample.project1.view.Menu",
                    controller: this
                }).then(function (oMenu) {
                    this._oThemeMenu = oMenu;
                    this.getView().addDependent(oMenu);
                    oMenu.openBy(oEvent.getSource());
                }.bind(this));
            } else {
                this._oThemeMenu.openBy(oEvent.getSource());
            }
        }
    });
});
