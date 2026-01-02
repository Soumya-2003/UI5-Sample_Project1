sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/ui/core/Fragment"
], (Controller, JSONModel, MessageBox, Fragment) => {
    "use strict";

    return Controller.extend("sample.project1.controller.View1", {
        onInit: function () {
            var oTableModel = new JSONModel({
                orders: []
            });
            this.getView().setModel(oTableModel);
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
        onPressOpenOverflowMenu: function (oEvent) {
            var oView = this.getView();

            if (!this._oThemeMenu) {
                Fragment.load({
                    name: "sample.project1.view.overflowMenu",
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
            sap.ui.getCore().applyTheme(sTheme);
        }

    });
});