sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/ui/core/Fragment",
    "sample/project1/helper/themeHelper"
], (Controller, JSONModel, MessageBox, Fragment, themeHelper) => {
    "use strict";
    // var ButtonType = library.ButtonType;
    return Controller.extend("sample.project1.controller.View1", {
        onInit: function () {
            themeHelper.initTheme();
        },
        onGoToUser: function () {
            this.getOwnerComponent().getRouter().navTo("View2");
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
            var oItem = oEvent.getParameter("item");
            var sKey = oItem.getKey();
            var oNavCon = this.byId("pageContainer");

            if (sKey && oItem.getSelectable()) {
                const oVBox = this.byId(sKey).getContent()[0];
                const oText = oVBox.getItems()[0];
                oText.setText("Fired event to load page " + sKey.replace("page", ""));
                oNavCon.to(this.byId(sKey));
            }

            if (this._oPopover.isOpen()) {
                this._oPopover.close();
            }
        },
        onPress: function (oEvent) {
            const oModel = this.getView().getModel("orderDetailModel");
            const aOrderData = oModel.getProperty("/orderDetails");

            const nOrderID = oModel.getProperty("/OrderID");
            const sCustomer = oModel.getProperty("/CustomerName");
            const sProduct = oModel.getProperty("/ProductName");
            const nQty = oModel.getProperty("/Quantity");

            if (!nOrderID || !sCustomer || !sProduct || !nQty) {
                sap.m.MessageBox.warning("Please fill all fields");
                return;
            }

            aOrderData.push({
                "OrderID": oModel.getProperty("/OrderID"),
                "CustomerName": oModel.getProperty("/CustomerName"),
                "ProductName": oModel.getProperty("/ProductName"),
                "Quantity": oModel.getProperty("/Quantity")
            })

            oModel.refresh(true);

            MessageBox.success(`Order ${nOrderID} is added`);

            oModel.setProperty("/OrderID", "");
            oModel.setProperty("/CustomerName", "");
            oModel.setProperty("/ProductName", "");
            oModel.setProperty("/Quantity", "");

        },
        onCheckBoxSelect: function (oEvent) {
            var bFixedLayout = oEvent.getParameter("selected");
            var oTable = oEvent.getSource().getParent().getParent();
            oTable.setFixedLayout(bFixedLayout);
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
        }

    });
});