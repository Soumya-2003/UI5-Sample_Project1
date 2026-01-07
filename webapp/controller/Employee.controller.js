sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/Device",
    "sap/base/Log",
], (Controller, Device, Log) => {
    "use strict";
    return Controller.extend("sample.project1.controller.Employee", {
        onInit: function () {
            
            var oModel = this.getOwnerComponent().getModel("departmentModel");
            this.getView().setModel(oModel, "departmentModel");

            this.getSplitAppObj().setHomeIcon({
                'phone': 'phone-icon.png',
                'tablet': 'tablet-icon.png',
                'icon': 'desktop.ico'
            });

            var oSplitApp = this.getSplitAppObj();
            oSplitApp.toMaster(this.createId("master"));
            oSplitApp.toDetail(this.createId("detail"));

            Device.orientation.attachHandler(this.onOrientationChange, this);
        },
        onPressGoToMaster: function (oEvent) {
            var oDept = oEvent.getSource()
                .getBindingContext("departmentModel")
                .getObject();

            this.getView().getModel("departmentModel")
                .setProperty("/selectedDepartment", oDept);

            this.getSplitAppObj().toMaster(this.createId("master2"));
        },
        onPressMasterBack: function () {
            this.getSplitAppObj().backMaster();
        },
        onEmployeePress: function (oEvent) {
            var oEmp = oEvent.getParameter("listItem")
                .getBindingContext("departmentModel")
                .getObject();

            this.getView().getModel("departmentModel")
                .setProperty("/selectedEmployee", oEmp);

            this.getSplitAppObj().toDetail(this.createId("detail"));
        },
        getSplitAppObj: function () {
            var oSplitApp = this.byId("SplitAppDemo");
            if (!oSplitApp) {
                Log.info("SplitApp object can't be found");
            }
            return oSplitApp;
        }



    });
});