sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/Fragment",
	"sap/m/MessageBox",
	"sample/project1/helper/themeHelper"
], (Controller, Fragment, MessageBox, themeHelper) => {
	"use strict";
	// var ButtonType = library.ButtonType;
	return Controller.extend("sample.project1.controller.View2", {
		onInit: function () {
			themeHelper.initTheme();
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

			this._oPopover.close();
		},

		addEmployee: function () {
			const oModel = this.getView().getModel("employeeDetailModel");
			const aEmployeeData = oModel.getProperty("/EmployeeList");

			const oEmployeeData = {
				EmployeeID: oModel.getProperty("/EmployeeID"),
				Name: oModel.getProperty("/Name"),
				Address: oModel.getProperty("/Address"),
				Phone: oModel.getProperty("/Phone"),
				Department: oModel.getProperty("/Department"),
				Level: oModel.getProperty("/Level")
			}

			aEmployeeData.push(oEmployeeData);
			oModel.refresh(true);

			oModel.setProperty("/EmployeeID", "");
			oModel.setProperty("/Name", "");
			oModel.setProperty("/Address", "");
			oModel.setProperty("/Phone", "");
			oModel.setProperty("/Department", "");
			oModel.setProperty("/Level", "");
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
		onSelectDialogPress: function (oEvent) {
			var oButton = oEvent.getSource(),
				oView = this.getView();

			if (!this._pDialog) {
				this._pDialog = Fragment.load({
					id: oView.getId(),
					name: "sample.project1.view.Dialog",
					controller: this
				}).then(function (oDialog) {
					oDialog.setModel(oView.getModel());
					return oDialog;
				});
			}

			this._pDialog.then(function (oDialog) {
				this._configDialog(oButton, oDialog);
				oDialog.open();
			}.bind(this));

		},
		onValueHelpRequest: function () {
			var oView = this.getView();
			if (!this._oDeptDialog) {
				Fragment.load({
					name: "sample.project1.view.Dialog",
					controller: this
				}).then(function (oDialog) {
					this._oDeptDialog = oDialog;
					oView.addDependent(oDialog);
					oDialog.open();
				}.bind(this));
			}
			else{
				this._oDeptDialog.open();
			}

		},

		onDepartmentConfirm: function () {
			var oSelectedItem = oEvent.getParameter("selectedItem"),


			if (oSelectedItem) {
				var sValue = oSelectedItem.getTitle();
				this.byId("departmentInput").setValue(sValue);
			}
			oEvent.getSource().close();
		},
	});
});