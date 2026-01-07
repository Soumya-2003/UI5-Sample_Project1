sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	"sap/ui/core/Fragment",
	"sap/m/MessageBox",
	"sample/project1/helper/themeHelper",
	"sap/m/MessageToast",
	"sap/ui/model/Sorter",
], (Controller, History, Fragment, MessageBox, themeHelper, MessageToast, Sorter) => {
	"use strict";
	return Controller.extend("sample.project1.controller.View2", {
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
		onWelcome: function () {
			const sName = this.byId("nameInput").getValue();

			this.getOwnerComponent().getRouter().navTo("WelcomePage", {
				userName: sName
			});
		},

		addEmployee: function () {
			const oModel = this.getView().getModel("employeeDetailModel");
			const aEmployeeData = oModel.getProperty("/EmployeeList");

			const EmployeeID = oModel.getProperty("/EmployeeID");
			const Name = oModel.getProperty("/Name");
			const Address = oModel.getProperty("/Address");
			const Phone = oModel.getProperty("/Phone");
			const Department = oModel.getProperty("/Department");
			const Level = oModel.getProperty("/Level");

			if (!EmployeeID || !Name || !Address || !Phone || !Department || !Level) {
				sap.m.MessageBox.warning("Please fill all fields");
				return;
			}

			const oEmployeeData = { EmployeeID, Name, Address, Phone, Department, Level };

			aEmployeeData.push(oEmployeeData);
			oModel.refresh(true);

			MessageBox.success(`${Name} is added as an Employee`);

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

		// 
		onValueHelpRequest: function () {
			var oView = this.getView();
			Fragment.load({
				name: "sample.project1.view.Dialog",
				controller: this
			}).then(function (oDialog) {
				this._valueHelpDialog = oDialog;
				oView.addDependent(oDialog);
				oDialog.open();
			}.bind(this));
			this._oDeptDialog.open();
		},

		onDepartmentConfirm: function (oEvent) {
			var oSelectedItem = oEvent.getParameter("selectedItem");

			const sDept = oSelectedItem.getTitle();
			this.getView().getModel("employeeDetailModel").setProperty("/Department", sDept);

			MessageToast.show(sDept + " is selected");
		},

		sortEmployeeName: function (oEvent) {
			const oView = this.getView();
			const oTable = oView.byId("table");
			oTable.getBinding("items").sort(new Sorter("Name", false));
		},

		clearAllSortings: function () {
			const oTable = this.byId("table");
			oTable.getBinding("items").sort(null);
		}
	});
});