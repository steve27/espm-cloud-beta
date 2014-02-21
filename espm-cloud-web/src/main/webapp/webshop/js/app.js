jQuery.sap.registerModulePath('app', '/espm-cloud-web/webshop/js');

jQuery.sap.require("app.localstorage");
jQuery.sap.require("app.config");
jQuery.sap.require("app.formatter");
jQuery.sap.require("app.utility");
jQuery.sap.require("app.messages");
jQuery.sap.require("app.validator");
jQuery.sap.require("app.welcome");
jQuery.sap.require("app.viewcache");

// module path for custom controls
jQuery.sap.registerModulePath('composite', '/espm-cloud-web/webshop/js/controls');
jQuery.sap.require("composite.productActions");

// Internationalization:
// create global i18n resource bundle for texts in application UI
sap.app.i18n = new sap.ui.model.resource.ResourceModel({
	bundleUrl : "/espm-cloud-web/webshop/i18n/i18n.properties",
	locale : sap.ui.getCore().getConfiguration().getLanguage()
});
sap.ui.getCore().setModel(sap.app.i18n, "i18n");

// create global i18n resource bundle for country names
sap.app.countryBundle = jQuery.sap.resources({
	url : "/espm-cloud-web/webshop/i18n/countries.properties",
	locale : sap.ui.getCore().getConfiguration().getLanguage()
});

// get the data for the dropdown listbox with the country names in the address view (checkoutStep2)
sap.app.countries = new sap.ui.model.json.JSONModel(sap.app.config.countriesModelUrl);
sap.app.countries.setSizeLimit(300);

// create initial filters and sorter for product listing
sap.app.product = {};
sap.app.product.searchFilter = null;
sap.app.product.categoryFilter = null;
sap.app.product.nameSorter = new sap.ui.model.Sorter("Name", false);

// instantiate initial view with a shell
// sap.ui.localResources(sap.app.config.viewNamespace);
jQuery.sap.registerModulePath(sap.app.config.viewNamespace, '/espm-cloud-web/webshop/espm-ui-shopping-web');

var oMainView = sap.ui.view({
	id : "main-shell",
	viewName : "espm-ui-shopping-web.main",
	type : sap.ui.core.mvc.ViewType.JS
});

// get business data from OData service
sap.app.odatamodel = new sap.ui.model.odata.ODataModel(sap.app.utility.getBackendDestination(), true);
// ensure that CSRF token is not taken from cache
sap.app.odatamodel.refreshSecurityToken();
// set model to core
sap.ui.getCore().setModel(sap.app.odatamodel);

// get categories from OData model
sap.app.odatamodel.read("/ProductCategories", null, null, false, sap.app.readOdata.readCategoriesSuccess,
		sap.app.readOdata.readError);

// get extension business data (reviews related data) from remote odata service as defined in destination with name
// 'cloudextensionbackend'
sap.app.extensionodatamodel = new sap.ui.model.odata.ODataModel("proxy/cloudextensionbackend");
sap.app.extensionodatamodel.setCountSupported(false);
sap.app.extensionodatamodel.attachRequestCompleted(sap.app.readExtensionOData.requestCompleted);
sap.ui.getCore().setModel(sap.app.extensionodatamodel, "extensionodatamodel");

oMainView.placeAt("content");