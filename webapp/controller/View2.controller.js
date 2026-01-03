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
					name: "sap.m.sample.SelectDialog.Dialog",
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
		onDialogClose: function (oEvent) {
			var aContexts = oEvent.getParameter("selectedContexts");
			if (aContexts && aContexts.length) {
				MessageToast.show("You have chosen " + aContexts.map(function (oContext) { return oContext.getObject().Name; }).join(", "));
			} else {
				MessageToast.show("No new item was selected.");
			}
			oEvent.getSource().getBinding("items").filter([]);
		},
		onValueHelpRequest: function () {
			var oView = this.getView();

			if (!this._pValueHelpDialog) {
				this._pValueHelpDialog = Fragment.load({
					id: oView.getId(),
					name: "sample.project1.view.Dialog",
					controller: this
				}).then(function (oValueHelpDialog) {
					this._pValueHelpDialog = oValueHelpDialog;
					this.getView().addDependent(oValueHelpDialog);
					oValueHelpDialog.open();
				}.bind(this));
			}
		},
		onDepartmentConfirm: function () {
			var oItem = oEvent.getParameter("selectedItem");
			if (oItem) {
				this.getView().getModel("employeeDetailModel")
					.setProperty("/Department", oItem.getTitle());
			}
		},
		onDepartmentCancel: function(){
			this.oValueHelpDialog.close();
		},
		onSearch: function (oEvent) {
			var sValue = oEvent.getParameter("value");
			var oFilter = new Filter("Name", FilterOperator.Contains, sValue);
			var oBinding = oEvent.getParameter("itemsBinding");
			oBinding.filter([oFilter]);
		},

	});
});