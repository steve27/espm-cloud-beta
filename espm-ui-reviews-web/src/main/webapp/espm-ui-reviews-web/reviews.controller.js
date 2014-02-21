sap.ui.controller("espm-ui-reviews-web.reviews", {

	onInit : function() {
		sap.app.viewCache.get("categories-selection").getController().loadCategories();
	},

	openCustomerReviewCreationDialog : function() {
		var oBindingContext = sap.app.viewCache.get("product-selection").getSelectedProductItem().getBindingContext();
		var oCustomerReviewCreationView = sap.app.viewCache.get("customer-review-creation");
		oCustomerReviewCreationView.getController().openDialog(oBindingContext);
	},

	showFilledCustomerReviewsPanel : function() {
		sap.app.viewCache.get("customer-reviews").getController().showRowRepeaterHeaderLayout();
		sap.app.viewCache.get("customer-reviews").getController().showRowRepeater();
		sap.app.viewCache.get("customer-reviews").getController().hideRowRepeaterFooterLayout();
	},

	showEmptyCustomerReviewsPanel : function() {
		sap.app.viewCache.get("customer-reviews").getController().hideRowRepeaterHeaderLayout();
		sap.app.viewCache.get("customer-reviews").getController().hideRowRepeater();
		sap.app.viewCache.get("customer-reviews").getController().showRowRepeaterFooterLayout();
	},

	showLoadingCustomerReviewsPanel : function() {
		sap.app.viewCache.get("customer-reviews").getController().hideRowRepeaterHeaderLayout();
		sap.app.viewCache.get("customer-reviews").getController().hideRowRepeater();
		sap.app.viewCache.get("customer-reviews").getController().hideRowRepeaterFooterLayout();
	}

});
