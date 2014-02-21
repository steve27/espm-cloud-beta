sap.ui.jsview("espm-ui-retailer-web.stock", {

	getControllerName : function() {
		return "espm-ui-retailer-web.stock";
	},

	createContent : function(oController) {

		// Create an instance of the stock table control
		this.oTable = new sap.ui.table.Table("stock-main-table", {
			title : "{i18n>SHELL_WORKSET_STOCK}",
			visibleRowCount : 20,
			firstVisibleRow : 0,
			navigationMode : sap.ui.table.NavigationMode.Paginator,
			selectionMode : sap.ui.table.SelectionMode.Single,
		});

		// Define Columns and Control Templates for stock Table
		// Product name
		var oColumn = new sap.ui.table.Column({
			label : new sap.ui.commons.Label({
				text : "{i18n>STOCK_PRODUCT_NAME_COLUMN}"
			}),
			template : new sap.ui.commons.TextField().bindProperty("value", "Product/Name"),
		// sortProperty : "Product/Name",
		// filterProperty : "Product/Name",
		});
		this.oTable.addColumn(oColumn);

		// Product description
		this.oTable.addColumn(new sap.ui.table.Column({
			label : new sap.ui.commons.Label({
				text : "{i18n>STOCK_PRODUCT_DESCRIPTION_COLUMN}"
			}),
			template : new sap.ui.commons.TextField().bindProperty("value", "Product/ShortDescription"),
		// sortProperty : "Product/ShortDescription",
		// filterProperty : "Product/ShortDescription",
		}));

		// Product price
		this.oTable.addColumn(new sap.ui.table.Column({
			label : new sap.ui.commons.Label({
				text : "{i18n>STOCK_PRODUCT_PRICE_COLUMN}"
			}),
			template : new sap.ui.commons.TextField({
				value : {
					path : "Product/Price",
					formatter : sap.app.formatter.price,
				}
			}),
		// sortProperty : "Product/Price",
		// filterProperty : "Product/Price",
		}));

		// Items in stock
		this.oTable.addColumn(new sap.ui.table.Column({
			label : new sap.ui.commons.Label({
				text : "{i18n>STOCK_PRODUCT_IN_STOCK_COLUMN}"
			}),
			template : new sap.ui.commons.layout.HorizontalLayout({
				content : [ new sap.ui.commons.TextView({
					text : {
						path : "Quantity",
						formatter : sap.app.formatter.quantity
					},

				}),

				new sap.ui.commons.Label({
					text : " / "
				}),

				new sap.ui.commons.Link({
					text : {
						path : "MinStock",
						formatter : sap.app.formatter.quantity,
					},

					press : function(oEvent) {
						oController.launchStockDetails(oEvent.getSource().getBindingContext());
					},
				}) ],
			}),
		// sortProperty: "stock",
		// filterProperty: "stock",
		}));

		// Status
		this.oTable.addColumn(new sap.ui.table.Column({
			label : new sap.ui.commons.Label({
				text : "{i18n>STOCK_PRODUCT_STATUS_COLUMN}"
			}),
			template : new sap.ui.commons.layout.HorizontalLayout({
				content : [ new sap.ui.commons.Image({
					src : {
						path : "QuantityLessMin",
						// formatter: sap.app.formatter.price
						formatter : function(value) {
							if (value === 'false') {
								return 'images/green_tick.png';
							} else {
								return 'images/red_cross.png';
							}
						}
					}
				}),

				new sap.ui.commons.Button({
					text : "Order",
					visible : {
						path : "QuantityLessMin",
						formatter : function(value) {
							if (value === 'false') {
								return false;
							} else {
								return true;
							}
						}
					},
					press : function(oEvent) {
						oController.launchStockStatus(oEvent.getSource().getBindingContext());

					},

				}), ],
			}),
			// hAlign: "Center",
			sortProperty : "QuantityLessMin",
		}));

		// Define stock status thing inspector
		this.stockStatus(this);

		// Define stock details thing inspector
		this.stockDetails(this);

		return this.oTable;
	},

	// Define Thing Inspector for all stock details for particular products
	stockDetails : function(view) {
		// Actions of the ThingInspector
		// define Update action
		var oA1 = new sap.ui.ux3.ThingAction({
			id : "update",
			text : "{i18n>UPDATE}",
			tooltip : "{i18n>UPDATE}"
		});

		// define Cancel action
		var oA2 = new sap.ui.ux3.ThingAction({
			id : "cancel",
			text : "{i18n>CANCEL}",
			tooltip : "{i18n>CANCEL}"
		});

		// create TextView for the stock Details
		var setStockText = new sap.ui.commons.TextView({
			text : "{i18n>STOCK_PRODUCT_DETAILS_TEXT}",
			design : sap.ui.commons.TextViewDesign.H6
		});
		setStockText.addStyleClass('stockdetailsMargin');

		// create Facet content for Stock details
		var oFC1 = new sap.ui.ux3.ThingGroup({
			title : "Details",
			colspan : true,
			content : [
			// row for TextView defines the stock text under Details
			setStockText,

			// rows for min and item in stock
			new sap.ui.commons.layout.MatrixLayout("stockdetails", {
				rows : [ view.rowsDetails(view, "{i18n>STOCK_PRODUCT_MINIMUM}", "{MinStock}"),

				view.rowDetails("{i18n>STOCK_ORDER_ITEMS_IN_STOCK}", "{Quantity}") ]
			}),

			// horizontal divider
			new sap.ui.commons.HorizontalDivider({
				width : "100%"
			}), ]
		});

		// Price field in the Facet area of Status Details Thing Inspector
		// price label
		var oLabelPrice = new sap.ui.commons.Label({
			text : "{i18n>STOCK_PRODUCT_PRICE_COLUMN}",
			design : sap.ui.commons.LabelDesign.Bold,
			labelFor : oControlPrice,
		// width: "40%",
		});

		// price value
		var oControlPrice = new sap.ui.commons.TextView({
			text : {
				path : "Product/Price",
				formatter : sap.app.formatter.price,
			},
		// width: "100%"
		});

		var oMLCellLabelPrice = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.End,
			vAlign : sap.ui.commons.layout.VAlign.Top,
			content : [ oLabelPrice ]
		});

		var oMLCellPrice = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Top,
			content : [ oControlPrice ]
		});

		// row containing price label and value
		var OMrow = new sap.ui.commons.layout.MatrixLayoutRow({
			cells : [ oMLCellLabelPrice, oMLCellPrice ]
		});

		// Thing Inspector for Stock deatils
		view.stockdetailsTI = new sap.ui.ux3.ThingInspector({
			firstTitle : "{Product/Name}",
			// secondTitle: "{Products/Category}",
			type : "{Product/Category}",
			favoriteActionEnabled : false,
			updateActionEnabled : false,
			followActionEnabled : false,
			flagState : false,
			favoriteState : false,
			flagActionEnabled : false,
			openButtonVisible : false,
			facets : [ new sap.ui.ux3.NavigationItem({
				key : "details",
				text : "{i18n>STOCK_PRODUCT_DETAILS}"
			}), ],
			headerContent : [
					new sap.ui.ux3.ThingGroup({
						title : "{i18n>STOCK_PRODUCT_DESCRIPTION_COLUMN}",
						content : [ new sap.ui.commons.TextView({
							text : "{Product/ShortDescription}",
							width : "100%",
						}) ]

					}),
					new sap.ui.ux3.ThingGroup({
						title : "{i18n>STOCK_PRODUCT_GENERAL_INFORMATION}",
						content : [ new sap.ui.commons.layout.MatrixLayout(
								{
									rows : [
											view.row("{i18n>STOCK_PRODUCT_WEIGHT}", "{Product/Weight}",
													"{Product/WeightUnit}"),
											view.row("{i18n>STOCK_PRODUCT_HEIGHT}", "{Product/DimensionHeight}",
													"{Product/DimensionUnit}"),
											view.row("{i18n>STOCK_PRODUCT_WIDTH}", "{Product/DimensionWidth}",
													"{Product/DimensionUnit}"),
											view.row("{i18n>STOCK_PRODUCT_DEPTH}", "{Product/DimensionDepth}",
													"{Product/DimensionUnit}"), OMrow ]
								}) ]
					}), ],
			facetSelected : function(oEvent) {
				view.stockdetailsTI.destroyActions();
				view.stockdetailsTI.destroyFacetContent();

				view.stockdetailsTI.removeAllFacetContent();
				view.stockdetailsTI.removeAllActions();

				view.stockdetailsTI.addFacetContent(oFC1);
				view.stockdetailsTI.addAction(oA1);
				view.stockdetailsTI.addAction(oA2);

			},
			actionSelected : function(oEvent) {
				var oAction = oEvent.getParameter("action");
				var sActionId = oAction.getId();

				if (sActionId == "update") {

					if (view.stockdetailsTI.isOpen()) {
						// view.stockdetailsTI.destroyActions();
						view.stockdetailsTI.close();

						var oEntry = {};
						// oEntry.MinStock = view.MinStockEditText.getValue();
						oEntry.MinStock = $("#__field4").val();
						var oParams = {};
						oParams.fnSuccess = function() {
							sap.app.messages.addMessage("{i18n>STOCK_MINSTOCK_UPDATE_SUCCESS}",
									sap.ui.core.MessageType.Success, "odata_read_failed");
							sap.app.utility.clearMessagesAfter(sap.app.config.messageDuration);
						};
						oParams.fnError = function() {
							sap.app.messages.addMessage("{i18n>STOCK_MINSTOCK_UPDATE_ERROR}",
									sap.ui.core.MessageType.Error, "odata_read_failed");
							sap.app.utility.clearMessagesAfter(sap.app.config.messageDuration);
						};
						oParams.bMerge = true;
						// sap.app.model.update("/Stocks('" + sap.app.model.getProperty("ProductId", data) + "')",
						// oEntry, oParams);
						sap.app.model.update("/Stocks('"
								+ sap.app.model.getProperty("ProductId", view.stockdetailsTI.getBindingContext())
								+ "')", oEntry, oParams);

						return;
					}
				}

				if (sActionId == "cancel") {
					if (view.stockdetailsTI.isOpen()) {
						// view.stockdetailsTI.destroyActions();
						view.stockdetailsTI.close();
						return;
					}
				}
			},

		// close: function() {
		// view.stockdetailsTI.destroyActions();
		// }

		});

	},

	// thing inspector for item in stock details for a particular product which is less in stock (Order button)
	stockStatus : function(view) {

		var oCon = view.getController();
		// Actions of the ThingInspector

		// define order action
		var oA1 = new sap.ui.ux3.ThingAction({
			id : "order",
			text : "{i18n>ORDER}",
			tooltip : "{i18n>ORDER}"
		});

		// define cancel action
		var oA2 = new sap.ui.ux3.ThingAction({
			id : "cancelstatus",
			text : "{i18n>CANCEL}",
			tooltip : "{i18n>CANCEL}"
		});

		// define TextView for Order Items in stock details
		var setOrderText = new sap.ui.commons.TextView({
			text : "{i18n>STOCK_ORDER_ITEMS}",
			design : sap.ui.commons.TextViewDesign.H6
		});
		setOrderText.addStyleClass('stockdetailsMargin');

		// define TextView for total
		view.totalTextView = new sap.ui.commons.TextView({
			// text: "{i18n>SALES_ORDER_TOTAL}",
			design : sap.ui.commons.TextViewDesign.H1
		});

		// define label for order in MatrixRow for three cells in a row in Order Items under stock details
		var oLabel = new sap.ui.commons.Label({
			text : "{i18n>ORDER}"
		});

		view.orderEditText = new sap.ui.commons.TextField({
			editable : true,
			value : "{LotSize}",
			width : "40%",
		}).attachBrowserEvent('keyup', function() {
			var value = jQuery.sap.domById(this.getId()).value;
			if (isNaN(value)) {
				this.getInputDomRef().style.borderColor = '#FF0000';
				this.getInputDomRef().style.borderWidth = '2px';
			} else if (value > 0) {
				view.totalTextView.setText(sap.app.formatter
						.total(value
								* parseFloat(sap.app.model.getProperty("Product/Price", view.totalTextView
										.getBindingContext()))));
				this.getInputDomRef().style.borderWidth = '1px';
				this.getInputDomRef().style.borderColor = '#000000';
			} else {
				this.getInputDomRef().style.borderColor = '#FF0000';
				this.getInputDomRef().style.borderWidth = '2px';
			}
		});

		// define horizontal layout for the two items under the three rows ( TextField and Label ) in Order Items under
		// stock details
		var oHorItem = new sap.ui.commons.layout.HorizontalLayout({
			content : [ view.orderEditText,

			new sap.ui.commons.Label({
				text : "Items",
				textAlign : sap.ui.core.TextAlign.Left
			}) ]
		});

		var oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Top,
			content : [ oLabel ]
		});

		var oCell1 = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Top,
			content : [ oHorItem ],
		});

		var oCell2 = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Top,
		});

		var oCell3 = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Top,
		});

		// MatrixRow for three cells in a row in Order Items under stock details
		var oRow = new sap.ui.commons.layout.MatrixLayoutRow({
			cells : [ oCell, oCell1, oCell2, oCell3 ]
		});

		// Supplier name row
		view.supplierRow = view.rowDetails("{i18n>STOCK_ORDER_SUPPLIER}", "");

		// define Facet content for stock status ThingInspector
		// Facet Content for Details section
		var oFC1 = new sap.ui.ux3.ThingGroup({
			title : "Details",
			colspan : true,
			content : [

			// TextView for stock details screen
			// setStockText,

			// two rows for minimum and maximum stock level
			new sap.ui.commons.layout.MatrixLayout({
				rows : [ view.rowDetails("{i18n>STOCK_PRODUCT_MINIMUM}", "{MinStock}"), ]
			}),

			// horizontal divider between stock level details and Order Items details
			// new sap.ui.commons.HorizontalDivider({width:"100%"}),

			// TextView for Order Items detail
			setOrderText,

			// stock available details
			new sap.ui.commons.layout.MatrixLayout({
				rows : [ view.rowDetails("{i18n>STOCK_ORDER_ITEMS_IN_STOCK}", "{Quantity}") ]
			}),

			// row which contains no of items to be order
			new sap.ui.commons.layout.MatrixLayout({
				rows : [ oRow ]
			}),

			// row where the supplier can be selected
			new sap.ui.commons.layout.MatrixLayout({
				rows : [ view.supplierRow ]
			}),

			// row for phone number details
			new sap.ui.commons.layout.MatrixLayout({
				rows : [ view.rowDetails("{i18n>STOCK_ORDER_PHONE_NUMBER}", "{Product/Supplier/PhoneNumber}") ]
			}),

			// row for business partner details
			new sap.ui.commons.layout.MatrixLayout({
				rows : [ view.rowDetails("{i18n>CONTACT_EMAIL}", "{Product/Supplier/EmailAddress}") ]
			}),

			// horizontal divider between Order Items and Total
			new sap.ui.commons.HorizontalDivider({
				width : "100%"
			}),

			view.totalTextView,

			]
		});

		// Price field in the Facet area of Status Details Thing Inspector
		// price label
		var oLabelPrice = new sap.ui.commons.Label({
			text : "{i18n>STOCK_PRODUCT_PRICE_COLUMN}",
			design : sap.ui.commons.LabelDesign.Bold,
			labelFor : oControlPrice,
		// width: "40%",
		});

		// price value
		var oControlPrice = new sap.ui.commons.TextView({
			text : {
				path : "Product/Price",
				formatter : sap.app.formatter.price,
			},
		// width: "100%"
		});

		var oMLCellLabelPrice = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.End,
			vAlign : sap.ui.commons.layout.VAlign.Top,
			content : [ oLabelPrice ]
		});

		var oMLCellPrice = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Top,
			content : [ oControlPrice ],
		// width: "100%"
		});

		// row containing price label and value
		var OMrow = new sap.ui.commons.layout.MatrixLayoutRow({
			cells : [ oMLCellLabelPrice, oMLCellPrice ]
		});

		// Thing Inspector for Stock status
		view.stockstatusTI = new sap.ui.ux3.ThingInspector(
				{
					firstTitle : "{Product/Name}",
					// secondTitle: "{Products/Category}",
					type : "{Product/Category}",
					favoriteActionEnabled : false,
					updateActionEnabled : false,
					followActionEnabled : false,
					flagActionEnabled : false,
					openButtonVisible : false,
					facets : [ new sap.ui.ux3.NavigationItem({
						key : "details",
						text : "{i18n>STOCK_PRODUCT_DETAILS}"
					}), ],
					headerContent : [
							new sap.ui.ux3.ThingGroup({
								title : "{i18n>STOCK_PRODUCT_DESCRIPTION_COLUMN}",
								content : [ new sap.ui.commons.TextView({
									text : "{Product/ShortDescription}",
									width : "100%",
								}) ]

							}),
							new sap.ui.ux3.ThingGroup({
								title : "{i18n>STOCK_PRODUCT_GENERAL_INFORMATION}",
								content : [ new sap.ui.commons.layout.MatrixLayout({
									rows : [
											view.row("{i18n>STOCK_PRODUCT_WEIGHT}", "{Product/Weight}",
													"{Product/WeightUnit}"),
											view.row("{i18n>STOCK_PRODUCT_HEIGHT}", "{Product/DimensionHeight}",
													"{Product/DimensionUnit}"),
											view.row("{i18n>STOCK_PRODUCT_WIDTH}", "{Product/DimensionWidth}",
													"{Product/DimensionUnit}"),
											view.row("{i18n>STOCK_PRODUCT_DEPTH}", "{Product/DimensionDepth}",
													"{Product/DimensionUnit}"), OMrow ]
								}) ]
							}), ],
					facetSelected : function(oEvent) {
						view.stockstatusTI.destroyActions();
						view.stockstatusTI.destroyFacetContent();

						view.stockstatusTI.removeAllFacetContent();
						view.stockstatusTI.removeAllActions();

						view.stockstatusTI.addFacetContent(oFC1);
						view.stockstatusTI.addAction(oA1);
						view.stockstatusTI.addAction(oA2);

					},
					actionSelected : function(oEvent) {
						var oAction = oEvent.getParameter("action");
						var sActionId = oAction.getId();

						if (sActionId == "order") {
							if (view.stockstatusTI.isOpen()) {
								// view.stockstatusTI.destroyActions();
								view.stockstatusTI.close();

								oCon.createPurchaseOrder(oEvent.getSource().getBindingContext(), view.orderEditText
										.getValue());

								return;
							}
						}

						if (sActionId == "cancelstatus") {
							if (view.stockstatusTI.isOpen()) {
								// view.stockstatusTI.destroyActions();
								view.stockstatusTI.close();
								return;
							}
						}
					},
				// close: function() {
				// view.stockstatusTI.destroyActions();
				// }
				});

	},

	// Helper function to easier create a Matrixlayout
	// rows with TextView and Label for Header Area
	row : function(sLabel, sText, sUnit) {
		var oLabel = new sap.ui.commons.Label({
			text : sLabel,
			design : sap.ui.commons.LabelDesign.Bold,
			labelFor : oControl,
		// width: "40%"
		});

		var oControl = new sap.ui.commons.TextView({
			text : sText,
		// width: "100%"
		});

		var oUnit = new sap.ui.commons.TextView({
			text : sUnit,
		// width: "120%"
		});

		var hlayout = new sap.ui.commons.layout.HorizontalLayout({
			content : [ oControl, oUnit ]
		});

		var oMLCell1 = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.End,
			vAlign : sap.ui.commons.layout.VAlign.Top,
			content : [ oLabel ]
		});

		var oMLCell2 = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Top,
			content : [ hlayout ]
		});

		return new sap.ui.commons.layout.MatrixLayoutRow({
			cells : [ oMLCell1, oMLCell2 ]
		});
	},

	// rows with TextView and Label for Canvas Area in stock Details
	rowDetails : function(sLabel, sText, sUrl) {
		var oControl;
		if (!sUrl) {
			oControl = new sap.ui.commons.TextView({
				text : sText,
				width : "100%"
			});
		} else {
			oControl = new sap.ui.commons.Link({
				text : sText,
				href : sUrl,
				// tooltip: sText,
				target : "_blank"
			});
		}

		var oLabel = new sap.ui.commons.Label({
			text : sLabel,
			labelFor : oControl,
			width : "100%"
		});

		var oMLCell1 = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.End,
			vAlign : sap.ui.commons.layout.VAlign.Top,
			content : [ oLabel ]
		});

		var oMLCell2 = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Top,
			content : [ oControl ]
		});

		var oMLCell3 = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Top,
		});

		var oMLCell4 = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Top,
		});

		return new sap.ui.commons.layout.MatrixLayoutRow({
			cells : [ oMLCell1, oMLCell2, oMLCell3, oMLCell4 ]
		});
	},

	// rows with TextField and Label for Canvas Area in stock details screen
	rowsDetails : function(view, sLabel, sText) {
		view.MinStockEditText = new sap.ui.commons.TextField({
			value : sText,
			width : "50%",
			editable : true,
			tooltip : sText
		}).attachBrowserEvent('keyup', function() {
			var value = jQuery.sap.domById(this.getId()).value;
			if (isNaN(value) || value < 1) {
				this.getInputDomRef().style.borderColor = '#FF0000';
				this.getInputDomRef().style.borderWidth = '2px';
			} else {
				this.getInputDomRef().style.borderColor = '#000000';
				this.getInputDomRef().style.borderWidth = '1px';
			}
		});

		var oLabel = new sap.ui.commons.Label({
			text : sLabel,
			width : "100%",
			labelFor : view.MinStockEditText
		});

		var oMLCell1 = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.End,
			vAlign : sap.ui.commons.layout.VAlign.Top,
			content : [ oLabel ]
		});

		var oMLCell2 = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Top,
			content : [ view.MinStockEditText ]
		});

		var oMLCell3 = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Top,
		});

		var oMLCell4 = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Top,
		});

		return new sap.ui.commons.layout.MatrixLayoutRow({
			cells : [ oMLCell1, oMLCell2, oMLCell3, oMLCell4 ]
		});
	},
});
