/**
 * formatter.js
 * 
 * 
 */

jQuery.sap.declare("sap.app.formatter");

jQuery.sap.require("sap.app.config");
jQuery.sap.require("sap.ui.core.format.NumberFormat");

// define some formatting functions for usage on UI
sap.app.formatter = {

	currencyFormat : sap.ui.core.format.NumberFormat.getFloatInstance({
		maxFractionDigits : 2,
		minFractionDigits : 2,
		groupingEnabled : true,
		groupingSeparator : ".",
		decimalSeparator : ","
	}),

	price : function(price) {
		if (price !== 0 && !price) {
			return;
		}
		return sap.app.config.currencyFormat.replace("%1", sap.app.formatter.currencyFormat.format(price));
	},

	priceWithLabel : function(price) {
		if (price !== 0 && !price) {
			return;
		}
		return sap.app.i18n.getProperty("STOCK_PRODUCT_PRICE_COLUMN") + " "
				+ sap.app.config.currencyFormat.replace("%1", sap.app.formatter.currencyFormat.format(price));
	},

	total : function(price) {
		if (price !== 0 && !price) {
			return;
		}
		return sap.app.i18n.getProperty("SALES_ORDER_TOTAL") + " "
				+ sap.app.config.currencyFormat.replace("%1", sap.app.formatter.currencyFormat.format(price));
	},

	productImage : function(src) {
		if (!src) {
			return sap.app.config.productPlaceholderImg;
		}
		// return sap.app.utility.getServiceUrl(sap.app.config.productImageBaseUrl + src);
		return sap.app.config.productImageBaseUrl + src;
	},

	quantityFormat : sap.ui.core.format.NumberFormat.getFloatInstance({
		maxFractionDigits : 0,
		minFractionDigits : 0,
		groupingEnabled : false,
	}),

	quantity : function(quantity) {
		if (quantity !== 0 && !quantity) {
			return;
		}
		return sap.app.formatter.quantityFormat.format(quantity);
	},

};
