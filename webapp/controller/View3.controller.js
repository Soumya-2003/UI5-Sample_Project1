sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "sap/ui/core/Fragment",
    "sample/project1/helper/themeHelper",
], (Controller, History, Fragment, themeHelper) => {
    "use strict";
    return Controller.extend("sample.project1.controller.View3", {
        onInit: function () {
            themeHelper.initTheme();
            this.getOwnerComponent().getRouter().getRoute("WelcomePage").attachPatternMatched(this.onRouteMatched, this);
        },
        onRouteMatched: function (oEvent) {
            const sFullName = decodeURIComponent(oEvent.getParameter("arguments").userName);
            let sfirstName = sFullName.trim().split(" ")[0];
            this.byId("welcomeText").setText("Welcome! " + sfirstName);
            this.byId("Username").setText(sFullName);

        },
        onNavBack: function () {
            var oHistory = History.getInstance();
            var sPreviousHash = oHistory.getPreviousHash();

            if (sPreviousHash !== undefined) {
                window.history.go(-1);
            } else {
                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("RouteView1", {});
            }
        },
        onToggleSideNav: async function (oEvent) {
            var oButton = oEvent.getSource(),
                oView = this.getView();

            if (!this._oPopover) {
                this._oPopover = await Fragment.load({
                    id: oView.getId(),
                    name: "sample.project1.view.Popover",
                    controller: this
                });
                oView.addDependent(this._oPopover);
                this._oPopover.setShowHeader(Device.system.phone);
            }

            if (this._oPopover.isOpen()) {
                this._oPopover.close();
            } else {
                this._oPopover.openBy(oButton);
            }
        },

        onItemSelect: function (oEvent) {
            var sKey = oEvent.getParameter("item").getKey();
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            if (sKey === "home") {
                oRouter.navTo("RouteView1", {});
            }
            else if (sKey === "user") {
                oRouter.navTo("RouteUser", {});
            }
            else if (sKey === "employee") {
				oRouter.navTo("EmployeePage", {});
			}
            this._oPopover.close();
        },



        onOpenThemeMenu: function (oEvent) {
            var oView = this.getView();

            if (!this._oThemeMenu) {
                Fragment.load({
                    name: "sample.project1.view.Menu",
                    controller: this
                }).then(function (oMenu) {
                    this._oThemeMenu = oMenu;
                    oView.addDependent(oMenu);
                    oMenu.openBy(oEvent.getSource());
                }.bind(this));
            } else {
                this._oThemeMenu.openBy(oEvent.getSource());
            }
        },
        onSelectTheme: function (oEvent) {
            var sTheme = oEvent.getParameter("item").getKey();
            themeHelper.setTheme(sTheme);
        },




    });
});