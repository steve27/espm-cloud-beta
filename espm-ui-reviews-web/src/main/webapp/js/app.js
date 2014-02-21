jQuery.sap.registerModulePath('app', 'js');

jQuery.sap.require("app.localstorage");
jQuery.sap.require("app.config");
jQuery.sap.require("app.utility");
jQuery.sap.require("app.viewcache");

// create i18n resource bundle for UI texts
sap.app.i18n = new sap.ui.model.resource.ResourceModel({
	bundleUrl : "i18n/i18n.properties",
	locale : sap.ui.getCore().getConfiguration().getLanguage()
});
sap.ui.getCore().setModel(sap.app.i18n, "i18n");

// get business data (products and related data)
sap.app.odatamodel = new sap.ui.model.odata.ODataModel(sap.app.utility.getBackendDestination(), true);
sap.app.odatamodel.setCountSupported(false);
sap.app.odatamodel.refreshSecurityToken();
sap.ui.getCore().setModel(sap.app.odatamodel);

// get extension business data (reviews related data) either from local or remote odata service
// local: odata service exposed by the JPA model of the web application itself
sap.app.extensionodatamodel = new sap.ui.model.odata.ODataModel(sap.app.config.cloudExtensionOdataServiceName);
// remote: odata service defined in destination with name 'cloudextensionbackend'
// sap.app.extensionodatamodel = new sap.ui.model.odata.ODataModel("proxy/cloudextensionbackend");
sap.app.extensionodatamodel.setCountSupported(false);
sap.app.extensionodatamodel.attachRequestCompleted(sap.app.readExtensionOData.requestCompleted);
sap.ui.getCore().setModel(sap.app.extensionodatamodel, "extensionodatamodel");

// instantiate initial view
sap.ui.localResources(sap.app.config.viewNamespace);
sap.app.viewCache.get("main").placeAt("content");