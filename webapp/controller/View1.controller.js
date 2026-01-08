sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/ui/core/Fragment",
    "sample/project1/helper/themeHelper",
    "sap/ui/Device",
    "sap/base/Log"
], (Controller, JSONModel, MessageBox, Fragment, themeHelper, Device, Log) => {
    "use strict";
    return Controller.extend("sample.project1.controller.View1", {
        onInit: function () {
            themeHelper.initTheme();
            this.getSplitAppObj().setHomeIcon({
                'phone': 'phone-icon.png',
                'tablet': 'tablet-icon.png',
                'icon': 'desktop.ico'
            });
            var oSplitApp = this.getSplitAppObj();
            oSplitApp.toMaster(this.createId("master-place-order"));
            oSplitApp.toDetail(this.createId("add-order"));
            Device.orientation.attachHandler(this.onOrientationChange, this);
        },
        getSplitAppObj: function () {
            var result = this.byId("SplitAppDemo1");
            if (!result) {
                Log.info("SplitApp object can't be found");
            }
            return result;
        },
        goBack: function () {

        },
        addOrder: function () {
            this.getSplitAppObj().toDetail(this.createId("add-order"));
        },
        listOrder: function () {
            this.getSplitAppObj().toDetail(this.createId("list-order"));
        },
        gotoProfile: function () {
            this.getSplitAppObj().toDetail(this.createId("profilePage"));
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
            if (sKey === "user") {
                oRouter.navTo("RouteUser", {});
            }
            else if (sKey === "welcome") {
                oRouter.navTo("WelcomePage", {});
            }
            else if (sKey === "employee") {
                oRouter.navTo("EmployeePage", {});
            }

            this._oPopover.close();
        },
        onPress: function (oEvent) {
            const oModel = this.getView().getModel("orderDetailModel");
            const aOrderData = oModel.getProperty("/orderDetails");

            const nOrderID = oModel.getProperty("/OrderID");
            const sCustomer = oModel.getProperty("/CustomerName");
            const sProduct = oModel.getProperty("/ProductName");
            const nQty = oModel.getProperty("/Quantity");
            const sStock = oModel.getProperty("/Stock");

            if (!nOrderID || !sCustomer || !sProduct || !nQty || !sStock) {
                sap.m.MessageBox.warning("Please fill all fields");
                return;
            }

            aOrderData.push({
                OrderID: nOrderID,
                CustomerName: sCustomer,
                ProductName: sProduct,
                Quantity: nQty,
                Stock: sStock
            })

            oModel.refresh(true);

            MessageBox.success(`${sProduct} Placed with Order ID: ${nOrderID}`);

            oModel.setProperty("/OrderID", "");
            oModel.setProperty("/CustomerName", "");
            oModel.setProperty("/ProductName", "");
            oModel.setProperty("/Quantity", "");
            oModel.setProperty("/Stock", "");

        },
        // onCheckBoxSelect: function (oEvent) {
        //     var bFixedLayout = oEvent.getParameter("selected");
        //     var oTable = oEvent.getSource().getParent().getParent();
        //     oTable.setFixedLayout(bFixedLayout);
        // },
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