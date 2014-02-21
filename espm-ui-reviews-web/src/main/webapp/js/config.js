jQuery.sap.declare("sap.app.config");

// jQuery.sap.require("sap.app.localstorage");
jQuery.sap.require('app.localstorage');

sap.app.config = {
	// location where views of the web application are located
	viewNamespace : "espm-ui-reviews-web",

	// default value of used backend type for getting business data.
	usedBackendType : sap.app.localStorage.PREF_USED_BACKEND_TYPE_ABAP,

	// If 'true' data source information is displayed in 'Select a Product' area (Abap or HANA Cloud) and
	// 'Customer reviews of selected product' area
	displayDataSourceInfo : true,

	cloudExtensionOdataServiceName : "espm.svc",

	// backend details used in settings and for odata service Url links. Keep this data in sync with destinations
	// see destinations/cloudbackend
	cloudOdataServiceUrl : "https://cloudmodelespmhana.hana.ondemand.com/espm-cloud-web/espm.svc",

	// see destinations/abapbackend
	abapOdataServiceUrlWithLogin : "http://ESPM_TEST:Espm1234@54.225.119.138:50000/sap/opu/odata/IWBEP/EPM_DEVELOPER_SCENARIO_SRV/",

	// for settings dialog
	displayAbapOdataServiceUrl : "http://54.225.119.138:50000/sap/opu/odata/IWBEP/EPM_DEVELOPER_SCENARIO_SRV/",
	displayAbapUser : "ESPM_TEST",
	displayAbapPassword : "Espm1234",

	abapImagesBaseUrl : "",
	cloudImagesBaseUrl : "/espm-model-web/images/",

	productPlaceholderImg : "images/placeholder.product.150x150.png",

	displayProductSelectionPanel : true,
	displayShell : true,
};
