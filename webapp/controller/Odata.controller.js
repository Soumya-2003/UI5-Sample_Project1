sap.ui.define([
    "sap/ui/core/Fragment",
    "sample/project1/helper/themeHelper",
    "sample/project1/controller/BaseController",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
], (Fragment, themeHelper, BaseController, MessageToast, MessageBox) => {
    "use strict";
    return BaseController.extend("sample.project1.controller.Odata", {
        onInit: function () {
            themeHelper.initTheme();
        },
        onNavBack: function () {
            this.navBack();
        },
        onToggleSideNav: async function (oEvent) {
            this.toggleSideNav(oEvent);
        },

        onItemSelect: function (oEvent) {
            this.itemSelect(oEvent);
        },

        onOpenThemeMenu: function(oEvent){
            this.openThemeMenu(oEvent);
        },

        onSelectTheme: function(oEvent){
            this.selectTheme(oEvent);
        },

        onPressCreate: async function () {
            const oView = this.getView();

            if (!this._oCreateDialog) {
                this._oCreateDialog = await sap.ui.core.Fragment.load({
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

        onCancelUpdate: function () {
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