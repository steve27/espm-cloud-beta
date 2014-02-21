sap.app.viewCache = {

	oViewCache : {},

	/**
	 * Returns a cached view object. If it doesn't exist yet, it is created.
	 */
	get : function(viewName) {
		if (!this.oViewCache[viewName]) {
			var fullViewName = sap.app.config.viewNamespace + "." + viewName;
			this.oViewCache[viewName] = sap.ui.view({
				id : viewName,
				viewName : fullViewName,
				type : sap.ui.core.mvc.ViewType.JS
			});
		}
		return this.oViewCache[viewName];
	}
};
