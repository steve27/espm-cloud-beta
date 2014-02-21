jQuery.sap.declare("sap.app.config");

jQuery.sap.require("sap.app.localstorage");

sap.app.config = {
	// default value of used backend type for getting business data.
	usedBackendType : sap.app.localStorage.PREF_USED_BACKEND_TYPE_CLOUD_LOCAL,

	// If 'true' welcome dialog is displayed
	displayWelcomeDialog : true,

	// If 'true' data source information is displayed in 'Select a Product' area (Abap or HANA Cloud) and
	// 'Customer reviews of selected product' area
	displayDataSourceInfo : false,

	// If 'true' Customer Reviews contents are displayed as a third tab
	displayCustomerReview : false,

	abapImagesBaseUrl : "",
	cloudImagesBaseUrl : "/espm-cloud-web/images/",

	// backend details used in settings and for odata service Url links. Keep this data in sync destinations
	cloudLocalOdataServiceUrl : window.location.origin + "/espm-cloud-web/espm.svc/",
	// see destinations/cloudbackend
	cloudOdataServiceUrl : "https://cloudmodelespmhana.hana.ondemand.com/espm-cloud-web/espm.svc",
	// see destinations/abapbackend
	abapOdataServiceUrlWithLogin : "http://ESPM_TEST:Espm1234@54.225.119.138:50000/sap/opu/odata/IWBEP/EPM_DEVELOPER_SCENARIO_SRV/",

	// for settings dialog
	displayAbapOdataServiceUrl : "http://54.225.119.138:50000/sap/opu/odata/IWBEP/EPM_DEVELOPER_SCENARIO_SRV/",
	displayAbapUser : "ESPM_TEST",
	displayAbapPassword : "Espm1234",

	// local JSON model provides customer, items and order for write access
	orderModelUrl : "/espm-cloud-web/webshop/data/order.json",

	// local JSON model provides countries for address data
	countriesModelUrl : "/espm-cloud-web/webshop/data/countries.json",

	productPlaceholderImg : "images/placeholder.product.150x150.png",
	// Symbol for Euro
	currencySymbol : "\u20AC",
	// Placeholder with Euro Symbol
	currencyFormat : "%1 \u20AC",
	currencyName : "Euro",
	// location (namespace) for views within an application
	viewNamespace : "espm-ui-shopping-web",
	// maximum number of rows to be displayed before a paging is available
	productsNumRows : 100,
	categoriesNumRows : 50,

	messageDuration : 8000

};
