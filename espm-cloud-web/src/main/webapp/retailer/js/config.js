/**
 * config.js
 * 
 * holds all configurable properties
 */

jQuery.sap.declare("sap.app.config");

sap.app.config = {
	// location (namespace) for views within an application
	viewNamespace : "espm-ui-retailer-web",
	// Java Service
	modelUrl : "/espm-cloud-web/espm.svc/secure/",
	// base URL for pictures in Java
	productImageBaseUrl : "/espm-cloud-web/images/",
	// Symbol for Euro
	currencySymbol : "\u20AC",
	// Placeholder with Euro Symbol
	currencyFormat : "%1 \u20AC",
	currencyName : "Euro",
	messageDuration : 8000
};
