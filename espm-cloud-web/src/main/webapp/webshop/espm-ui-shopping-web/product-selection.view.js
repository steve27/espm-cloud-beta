sap.ui.jsview("espm-ui-shopping-web.product-selection", {

	oProductListItemTemplate : new sap.ui.core.ListItem({
		key : "{ProductId}",
		text : "{Name}"
	}),

	oProductsDropdownBox : new sap.ui.commons.DropdownBox({
		id : "product-selection-dropdown-box-id",
		width : "280px"
	}),

	oProductDetailsLayout : null,

	getControllerName : function() {
		return "espm-ui-shopping-web.product-selection";
	},

	createContent : function(oController) {
		this.oProductsDropdownBox.attachChange(oController.selectedProductChanged, oController);

		this.oProductDetailsLayout = this.createProductDetailsLayout();

		var oLayout = new sap.ui.commons.layout.VerticalLayout({
			content : [ new sap.ui.commons.Label({
				text : "{i18n>PRODUCTS_LABEL}"
			}), this.oProductsDropdownBox, new sap.ui.commons.Label({
				text : "{i18n>PRODUCT_DETAILS_LABEL}"
			}), this.oProductDetailsLayout, new sap.ui.commons.Button({
				id : "product-selection-create-customer-review-button-id",
				text : "{i18n>WRITE_CUSTOMER_REVIEW_BUTTON}",
				press : $.proxy(oController.openCustomerReviewCreationDialog, oController)
			}) ]
		});

		return oLayout;
	},

	createProductDetailsLayout : function() {
		var oVerticalProductNameDescLayout = new sap.ui.commons.layout.VerticalLayout({
			width : "500px",
			content : [ new sap.ui.commons.TextView({
				id : "selected-product-name-view-id",
				text : "{Name}",
			}), new sap.ui.commons.TextView({
				id : "selected-product-desc-view-id",
				text : "{ShortDescription}",
			}) ]
		}).addStyleClass("layoutPaddingProductDetails");

		return new sap.ui.commons.layout.HorizontalLayout({
			content : [
					new sap.ui.commons.Image({
						id : "selected-product-image-id",
						src : {
							path : "PictureUrl",
							formatter : function(src) {
								if (!src) {
									return (sap.app.config.productPlaceholderImg);
								} else {
									var re = /.JPG/g;
									src = src.replace(re, ".jpg");
									return (sap.app.utility.getBackendImagesDestination()
											+ sap.app.utility.getImagesBaseUrl() + src);
								}
							}
						},
						width : "75px",
						height : "75px"
					}), oVerticalProductNameDescLayout ]
		});
	},

	setProductFilter : function(aFilter) {
		var oController = this.getController();
		var oOldBinding = this.oProductsDropdownBox.getBinding("items");
		if (oOldBinding) {
			oOldBinding.detachChange(oController.selectedProductChanged, oController);
		}
		this.oProductsDropdownBox.bindItems("/Products", this.oProductListItemTemplate, new sap.ui.model.Sorter("Name",
				false), aFilter);
		this.oProductsDropdownBox.getBinding("items").attachChange(oController.selectedProductChanged, oController);
	},

	getSelectedProductItem : function() {
		var aItems = this.oProductsDropdownBox.getItems();
		for ( var i = 0; i < aItems.length; i++) {
			if (aItems[i].getKey() === this.oProductsDropdownBox.getSelectedKey()) {
				return aItems[i];
			}
		}
	}
});
