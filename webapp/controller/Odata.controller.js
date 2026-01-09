sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "sap/ui/core/Fragment",
    "sample/project1/helper/themeHelper",
    "sap/m/MessageToast"
], (Controller, History, Fragment, themeHelper, MessageToast) => {
    "use strict";
    return Controller.extend("sample.project1.controller.Odata", {
        onInit: function () {
            themeHelper.initTheme();
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
            else if (sKey === "welcome") {
                oRouter.navTo("WelcomePage", {});
            }
            else if (sKey === "employee") {
                oRouter.navTo("EmployeePage", {});
            }
            this._oPopover.close();
        },

        addProduct: function (oEvent) {
            const oModel = this.getView().getModel();
            const oModelProduct = this.getView().getModel("productModel");

            const ID = oModelProduct.getProperty("/productID");
            const Name = oModelProduct.getProperty("/productName");
            const Description = oModelProduct.getProperty("/productDesc");
            const Price = oModelProduct.getProperty("/productPrice");

            const oPayLoad = { ID, Name, Description, Price }
            oModel.setUseBatch(false);

            oModel.create("/Products", oPayLoad, {
                success: function () {
                    MessageToast.show("Created Successfully");
                    oModel.refresh(true);
                    oModelProduct.setProperty("/productID", "");
                    oModelProduct.setProperty("/productName", "");
                    oModelProduct.setProperty("/productDesc", "");
                    oModelProduct.setProperty("/productPrice", "");
                },
                error: function () {
                    MessageToast.show("Failed to create");
                }
            })
        }

        // updateProduct: function(){

        // }


    });
});