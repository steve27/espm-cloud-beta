sap.ui.controller("espm-ui-shopping-web.customer-reviews", {

	onInit : function() {
		var oModel = new sap.ui.model.json.JSONModel({
			selectedProductId : ""
		});
		this.getView().setModel(oModel);

		var that = this;
		var oEventBus = sap.ui.getCore().getEventBus();
		oEventBus.subscribe("sap.app", "selectedProductChanged", function(channelId, eventId, oData) {
			var sSelectedProductId = oData.selectedProductId;
			if (sSelectedProductId) {
				that.getView().getModel().oData.selectedProductId = sSelectedProductId;
				that.getCustomerReviews();
			} else {
				sap.app.viewCache.get("reviews").getController().showLoadingCustomerReviewsPanel();
			}
		});
	},

	getCustomerReviews : function() {
		var selectedProductId = this.getView().getModel().getData()["selectedProductId"];
		var extensionODataModel = sap.ui.getCore().getModel("extensionodatamodel");
		var oRowRepeater = sap.ui.getCore().byId("customer-reviews-row-repeater-id");
		var oModelFilter = new sap.ui.model.Filter("ProductId", sap.ui.model.FilterOperator.EQ, selectedProductId);
		sap.app.viewCache.get("reviews").getController().showLoadingCustomerReviewsPanel();
		oRowRepeater.setModel(extensionODataModel);
		var oRowRepeaterFilter = new sap.ui.commons.RowRepeaterFilter({
			text : "hiddenByCssClass",
			filters : [ oModelFilter ]
		});
		oRowRepeater.getBinding("rows").aFilters = [];
		oRowRepeater.getBinding("rows").aPredefinedFilters = [];
		oRowRepeater.removeAllFilters();
		oRowRepeater.addFilter(oRowRepeaterFilter);
		oRowRepeater.applyFilter(oRowRepeaterFilter.getId());
	},

	setRatingInfo : function(oRatingInfo) {
		this.getView().setRatingIndicatorValue(oRatingInfo.fAverageRating);
	},

	setUiControlIsVisible : function(id, isVisible) {
		var uiControl = sap.ui.getCore().byId(id);
		if (uiControl !== null) {
			uiControl.setVisible(isVisible);
		}
	},

	showRowRepeaterHeaderLayout : function() {
		this.setUiControlIsVisible("customer-reviews-header-layout-id", true);
	},

	hideRowRepeaterHeaderLayout : function() {
		this.setUiControlIsVisible("customer-reviews-header-layout-id", false);
	},

	showRowRepeaterFooterLayout : function() {
		this.setUiControlIsVisible("customer-reviews-footer-layout-id", true);
	},

	hideRowRepeaterFooterLayout : function() {
		this.setUiControlIsVisible("customer-reviews-footer-layout-id", false);
	},

	showRowRepeater : function() {
		this.setUiControlIsVisible("customer-reviews-row-repeater-id", true);
	},

	hideRowRepeater : function() {
		this.setUiControlIsVisible("customer-reviews-row-repeater-id", false);
	}

});
