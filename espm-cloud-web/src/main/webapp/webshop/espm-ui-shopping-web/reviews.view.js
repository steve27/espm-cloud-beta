sap.ui.jsview("espm-ui-shopping-web.reviews", {

	getControllerName : function() {
		return "espm-ui-shopping-web.reviews";
	},

	createContent : function(oController) {
		var oReviewsViewLayout = new sap.ui.commons.layout.MatrixLayout({
			id : "reviews-view-layout-id",
		});

		oReviewsViewLayout.createRow(this.getProductSelectionPanel());
		oReviewsViewLayout.createRow(this.getCustomerReviewsPanel());

		return oReviewsViewLayout;
	},

	/**
	 * Panel contains the capabilities to select a single product and displays corresponding products details. The
	 * button on the panel opens a dialog from where a customer review can be created.
	 * 
	 * @returns {sap.ui.commons.Panel}
	 */
	getProductSelectionPanel : function() {

		var oProductSelectionLayout = new sap.ui.commons.layout.MatrixLayout({
			width : "100%",
		});

		// display data source info
		if (sap.app.localStorage.getPreference(sap.app.localStorage.PREF_DISPLAY_DATA_SOURCE_INFO)) {
			oProductSelectionLayout.createRow(new sap.ui.commons.layout.MatrixLayoutCell({
				content : [
						new sap.ui.commons.TextView({
							text : sap.app.i18n.getProperty("DATA_SOURCE_INFO") + ":",
							wrapping : false,
							design : sap.ui.commons.TextViewDesign.Bold
						}),
						new sap.ui.commons.TextView({
							text : sap.app.i18n.getProperty("DATA_SOURCE_INFO_DATA_RETRIEVED_FROM").replace(/&1/,
									sap.app.utility.getBackendTypeText()),
							wrapping : false,
						}).addStyleClass("textViewMarginsLeftRight"), new sap.ui.commons.TextView({
							text : '(',
							wrapping : false,
						}), new sap.ui.commons.Link({
							text : "{i18n>DATA_SOURCE_INFO_ESPM_LINK_TEXT}",
							href : sap.app.utility.getDataSourceInfoOdataServiceUrl(),
							target : "_blank"
						}), new sap.ui.commons.TextView({
							text : ')',
						}) ]
			}));
		}

		// category selection
		oProductSelectionLayout.createRow(new sap.ui.commons.layout.MatrixLayoutCell({
			content : [ sap.app.viewCache.get("categories-selection") ]
		}));

		// product selection
		oProductSelectionLayout.createRow(new sap.ui.commons.layout.MatrixLayoutCell({
			content : [ sap.app.viewCache.get("product-selection") ]
		}));

		var oProductSelectionPanel = new sap.ui.commons.Panel({
			id : "reviews-view-product-selection-panel-id",
			width : "100%",
			areaDesign : sap.ui.commons.enums.AreaDesign.Plain,
			borderDesign : sap.ui.commons.enums.BorderDesign.None,
			showCollapseIcon : false,
			content : [ oProductSelectionLayout ],
			title : new sap.ui.commons.Title({
				text : "{i18n>PRODUCT_SELECTION_PANEL_TITLE}"
			})
		});

		return oProductSelectionPanel;
	},

	/**
	 * Panel contains the list of available customer reviews of the product which has been selected in the product
	 * selection panel
	 * 
	 * @returns {sap.ui.commons.Panel}
	 */
	getCustomerReviewsPanel : function() {
		var oProductReviewsListLayout = new sap.ui.commons.layout.MatrixLayout({
			width : "100%",
		});

		oProductReviewsListLayout.createRow(new sap.ui.commons.layout.MatrixLayoutCell({
			content : [ sap.app.viewCache.get("customer-reviews") ]
		}));

		var oCustomerReviewsPanel = new sap.ui.commons.Panel({
			id : "reviews-view-customer-reviews-panel-id",
			width : "100%",
			areaDesign : sap.ui.commons.enums.AreaDesign.Plain,
			borderDesign : sap.ui.commons.enums.BorderDesign.None,
			showCollapseIcon : false,
			content : [ oProductReviewsListLayout ],
			title : new sap.ui.commons.Title({
				text : "{i18n>REVIEWS_LIST_PANEL_TITLE}"
			})
		});

		return oCustomerReviewsPanel;
	}
});