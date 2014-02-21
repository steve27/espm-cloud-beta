/**
 * app.js
 * 
 * main application script - include required modules - instantiate localization model - init main shell view -
 * instantiate main product model
 */

// TODO: sapui5 version check, 1.8+ is required
jQuery.sap.registerModulePath('app', 'js');

jQuery.sap.require("app.config");
jQuery.sap.require("app.formatter");
jQuery.sap.require("app.messages");
jQuery.sap.require("app.utility");

// Internationalization:
// create global i18n resource bundle for texts in application UI
sap.app.i18n = new sap.ui.model.resource.ResourceModel({
	bundleUrl : "i18n/i18n.properties",
	locale : sap.ui.getCore().getConfiguration().getLanguage(),
});
sap.ui.getCore().setModel(sap.app.i18n, "i18n");

// instantiate initial view with a shell
sap.ui.localResources(sap.app.config.viewNamespace);
var oMainView = sap.ui.view({
	id : "main-shell",
	viewName : "espm-ui-retailer-web.main",
	type : sap.ui.core.mvc.ViewType.JS
});

// get OData Model from server
// sap.app.model = new sap.ui.model.odata.ODataModel(sap.app.utility.getServiceUrl(sap.app.config.modelUrl));
sap.app.model = new sap.ui.model.odata.ODataModel(sap.app.config.modelUrl, false);
// ensure that CSRF token is not taken from cache
sap.app.model.refreshSecurityToken();

// set model to core
sap.ui.getCore().setModel(sap.app.model);

oMainView.placeAt("content");
