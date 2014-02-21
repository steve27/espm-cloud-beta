sap.ui.controller("espm-ui-shopping-web.product-selection", {

	onInit : function() {
		var that = this;
		var oEventBus = sap.ui.getCore().getEventBus();
		oEventBus.subscribe("sap.app", "selectedCategoryChanged", function(channelId, eventId, oData) {
			that.filterProducts(oData.selectedCategoryId);
		});
	},

	filterProducts : function(sSelectedCategoryId) {
		var aFilter = [];
		if (sSelectedCategoryId !== sap.app.i18n.getProperty("ALL_CATEGORIES_LIST_ENTRY")) {
			var categoryFilter = new sap.ui.model.Filter("Category", sap.ui.model.FilterOperator.EQ,
					sSelectedCategoryId);
			aFilter.push(categoryFilter);
		}
		this.getView().setProductFilter(aFilter);
		this.clearSelectedProduct();
	},

	selectedProductChanged : function() {
		var selectedItemId = this.getView().oProductsDropdownBox.getSelectedItemId();
		var oSelectedItem;
		if (selectedItemId) {
			oSelectedItem = sap.ui.getCore().byId(selectedItemId);
		} else {
			oSelectedItem = this.getView().oProductsDropdownBox.getItems()[0];
		}
		if (oSelectedItem) {
			this.setProductDetailsBindingContext(oSelectedItem.getBindingContext());
			this.publishSelectedProductChanged(oSelectedItem.getKey());
		} else {
			this.clearSelectedProduct();
		}
	},

	clearSelectedProduct : function() {
		this.setProductDetailsBindingContext();
		this.publishSelectedProductChanged();
	},

	publishSelectedProductChanged : function(sProductId) {
		var oEventBus = sap.ui.getCore().getEventBus();
		oEventBus.publish("sap.app", "selectedProductChanged", {
			selectedProductId : sProductId
		});
	},

	setProductDetailsBindingContext : function(bindingCtx) {
		sap.ui.getCore().byId("selected-product-image-id").setBindingContext(bindingCtx);
		sap.ui.getCore().byId("selected-product-name-view-id").setBindingContext(bindingCtx);
		sap.ui.getCore().byId("selected-product-desc-view-id").setBindingContext(bindingCtx);
	},

	openCustomerReviewCreationDialog : function() {
		var oBindingContext = this.getView().getSelectedProductItem().getBindingContext();

		var oCustomerReviewCreationView = sap.app.viewCache.get("customer-review-creation");
		oCustomerReviewCreationView.getController().openDialog(oBindingContext);
	}
});
