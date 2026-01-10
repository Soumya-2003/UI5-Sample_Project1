sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "sap/ui/core/Fragment",
    "sample/project1/helper/themeHelper",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
], (Controller, History, Fragment, themeHelper, MessageToast, MessageBox) => {
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

        onPressCreate: async function () {
            const oView = this.getView();

            if (!this._oCreateDialog) {
                this._oCreateDialog = await sap.ui.core.Fragment.load({
                    id: oView.getId(),
                    name: "sample.project1.fragments.CreateProduct",
                    controller: this
                });
                oView.addDependent(this._oCreateDialog);
            }

            const oModelProduct = oView.getModel("productModel");
            oModelProduct.setProperty("/productID", "");
            oModelProduct.setProperty("/productName", "");
            oModelProduct.setProperty("/productDesc", "");
            oModelProduct.setProperty("/productPrice", "");

            this._oCreateDialog.open();
        },

        addProductOnTable: function (oEvent) {
            const oDataModel = this.getView().getModel();
            const oModelProduct = this.getView().getModel("productModel");

            const ID = oModelProduct.getProperty("/productID");
            const Name = oModelProduct.getProperty("/productName");
            const Description = oModelProduct.getProperty("/productDesc");
            const Price = oModelProduct.getProperty("/productPrice");

            if (!ID || !Name || !Description || !Price) {
                MessageBox.warning("Please fill all fields");
                return;
            }

            const oPayLoad = { ID, Name, Description, Price }
            oDataModel.setUseBatch(false);

            oDataModel.create("/Products", oPayLoad, {
                success: () => {
                    MessageToast.show("Created Successfully");
                    oDataModel.refresh(true);
                    this._oCreateDialog.close();
                },
                error: (oError) => {
                    console.log(oError);
                    MessageToast.show("Failed to create");
                }
            })
        },


        onPressCancelNewProduct: function () {
            this._oCreateDialog.close();
        },

        onAfterCloseDialog: function () {
            const oModelProduct = this.getView().getModel("productModel");
            oModelProduct.setProperty("/productID", "");
            oModelProduct.setProperty("/productName", "");
            oModelProduct.setProperty("/productDesc", "");
            oModelProduct.setProperty("/productPrice", "");
        },

        onItemPress: function (oEvent) {
            const oSelectedProduct = oEvent.getParameter("listItem");
            const oSelectedProductContext = oSelectedProduct.getBindingContext();
            const oSelectedProductData = oSelectedProductContext.getObject();

            this._sUpdatePath = oSelectedProductContext.getPath();

            const oProductModel = this.getView().getModel("productModel");
            oProductModel.setData({
                productID: oSelectedProductData.ID,
                productName: oSelectedProductData.Name,
                productDesc: oSelectedProductData.Description,
                productPrice: oSelectedProductData.Price
            })

            this._openUpdateDialog();

        },

        _openUpdateDialog: async function () {
            const oView = this.getView();

            if (!this._oUpdateDialog) {
                this._oUpdateDialog = await Fragment.load({
                    id: oView.getId(),
                    name: "sample.project1.fragments.UpdateProduct",
                    controller: this
                });
                oView.addDependent(this._oUpdateDialog);
            }

            this._oUpdateDialog.open();
        },

        onPressUpdateProduct: function () {
            const oModel = this.getView().getModel();
            const oProductModel = this.getView().getModel("productModel").getData();
            const oPayload = {
                Name: oProductModel.productName,
                Description: oProductModel.productDesc,
                Price: oProductModel.productPrice
            };
            oModel.update(this._sUpdatePath, oPayload, {
                success: () => {
                    MessageToast.show("Product updated");
                    oModel.refresh(true);
                    this._oUpdateDialog.close();
                },
                error: (err) => {
                    console.log(err);
                    MessageToast.show("Update failed")
                }
            });
        },

        onPressCancelEditProduct: function () {
            this._oUpdateDialog.close();
        },

        onPressDeleteProduct: function () {
            const oModel = this.getView().getModel();
            const sPath = this._sUpdatePath;

            MessageBox.confirm("Are you sure you want to delete this product?", {
                onClose: (sAction) => {
                    if (sAction === "OK") {
                        oModel.remove(sPath, {
                            success: () => {
                                MessageToast.show("Product deleted");
                                oModel.refresh(true);
                                this._oUpdateDialog.close();
                            },
                            error: () => {
                                MessageBox.error("Delete failed");
                            }
                        });
                    }
                }
            });
        }



    });
});