sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"
], function (Controller, MessageToast) {
    "use strict";

    return Controller.extend("my.app.controller.Main", {
        onInit: function () {
            // Logic to run when the page loads
        },

        onButtonClick: function () {
            MessageToast.show("Button was pressed!");
        }
    });
});