sap.ui.controller("espm-ui-retailer-web.main", {

	// instantiated view will be added to the oViewCache object and retrieved from there
	oViewCache : {},

	onInit : function() {
		sap.app.retailerController = this;
	},

	/**
	 * getCachedView checks if view already exists in oViewCache object, will create it if not, and return the view
	 */
	getCachedView : function(viewName) {
		if (!this.oViewCache[viewName]) {
			var fullViewName = sap.app.config.viewNamespace + "." + viewName;
			this.oViewCache[viewName] = sap.ui.view({
				id : viewName,
				viewName : fullViewName,
				type : sap.ui.core.mvc.ViewType.JS
			});
		}
		return this.oViewCache[viewName];
	},

});