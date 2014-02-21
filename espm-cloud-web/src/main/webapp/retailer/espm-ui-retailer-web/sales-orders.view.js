sap.ui.jsview("espm-ui-retailer-web.sales-orders", {

	getControllerName : function() {
		return "espm-ui-retailer-web.sales-orders";
	},

	createContent : function(oController) {

		// Create an instance of the sales order table control
		this.oTable = new sap.ui.table.Table("sales-order-main-table", {
			title : "{i18n>SHELL_WORKSET_SALES_ORDER}",
			visibleRowCount : 20,
			firstVisibleRow : 0,
			navigationMode : sap.ui.table.NavigationMode.Paginator,
			selectionMode : sap.ui.table.SelectionMode.Single,
		});

		var table = this.oTable;

		// Define the columns and the control templates to be used
		// Customer name
		var oColumn = new sap.ui.table.Column({
			label : new sap.ui.commons.Label({
				text : "{i18n>SALES_ORDER_CUSTOMER_NAME_COLUMN}"
			}),
			template : new sap.ui.commons.Link({
				text : {
					path : "Customer/FirstName",
					formatter : function(value) {
						if (value == null) {
							return value;
						}
						return value + ' '
								+ table.getModel().getProperty("Customer/LastName", this.getBindingContext());
					},
				},

				customData : [ new sap.ui.core.CustomData({
					key : "index",
					value : "{CustomerId}"
				}), ],
				press : function(oEvent) {
					var data = this.data("index");

					oController.launchCustomerSalesOrder(oEvent.getSource().getBindingContext());

				},
			}),
		// sortProperty : "Customer/LastName",
		// filterProperty : "Customer/LastName",
		});

		this.oTable.addColumn(oColumn);

		// Sales Order ID
		this.oTable.addColumn(new sap.ui.table.Column({
			label : new sap.ui.commons.Label({
				text : "{i18n>SALES_ORDER_SALES_ORDER_COLUMN}"
			}),
			template : new sap.ui.commons.Link({
				text : "{SalesOrderId}",
				customData : [ new sap.ui.core.CustomData({
					key : "index",
					value : "{SalesOrderId}"
				}), ],
				press : function(oEvent) {
					var data = this.data("index");

					oController.launchSalesOrderItems(oEvent.getSource().getBindingContext());
				}
			}),
			sortProperty : "SalesOrderId",
			filterProperty : "SalesOrderId",
		}));

		// Gross Amount
		this.oTable.addColumn(new sap.ui.table.Column({
			label : new sap.ui.commons.Label({
				text : "{i18n>SALES_ORDER_GROSS_AMOUNT_COLUMN}"
			}),
			template : new sap.ui.commons.TextView({
				text : {
					path : "GrossAmount",
					formatter : sap.app.formatter.price,
				}
			}),
			sortProperty : "GrossAmount",
		}));

		// Sales Order Date
		this.oTable.addColumn(new sap.ui.table.Column({
			label : new sap.ui.commons.Label({
				text : "{i18n>SALES_ORDER_DATE_COLUMN}"
			}),
			// template: new sap.ui.commons.TextView().bindProperty("text", "date"),
			template : new sap.ui.commons.TextView({
				text : {
					path : "CreatedAt",
					formatter : function(value) {
						if (value == null) {
							return value;
						}

						var formatorig = {};
						formatorig.pattern = 'yyyy-MM-ddTHH:mm:ss.SSS';
						var datetimeorig = sap.ui.core.format.DateFormat.getDateTimeInstance(formatorig);
						value = datetimeorig.parse(value);

						var format = {};
						format.pattern = 'MMMM dd, yyyy';
						var datetime = sap.ui.core.format.DateFormat.getDateTimeInstance(format);
						return datetime.format(value, false);
					}
				}
			}),
			sortProperty : "CreatedAt",
		// filterProperty : "CreatedAt",
		}));

		// Status
		this.oTable.addColumn(new sap.ui.table.Column({
			label : new sap.ui.commons.Label({
				text : "{i18n>SALES_ORDER_STATUS_COLUMN}"
			}),
			template : new sap.ui.commons.layout.HorizontalLayout({
				content : [ new sap.ui.commons.Image({
					src : {
						path : "LifeCycleStatus",
						formatter : function(value) {
							// TODO replace 0,1,2 with constants after model is finalised
							if (value === 'N') {
								return '';
							} else if (value === 'P') {
								return 'images/green_tick.png';
							} else if (value === 'X') {
								return 'images/red_cross.png';
							}
						}
					}
				}), new sap.ui.commons.TextView({
					text : {
						path : "LifeCycleStatus",
						formatter : function(value) {
							// TODO replace 0,1,2 with constants after model is finalised
							if (value === 'N') {
								return sap.app.i18n.getProperty("SALES_ORDER_STATUS_OPEN");
							} else if (value === 'P') {
								return sap.app.i18n.getProperty("SALES_ORDER_STATUS_ACCEPTED");
							} else if (value === 'X') {
								return sap.app.i18n.getProperty("SALES_ORDER_STATUS_REJECTED");
							}
						}
					}
				}), ],
			}),
			sortProperty : "LifeCycleStatus",
		}));

		// Define customer sales order thing inspector
		this.createCustomerSalesOrder(this);

		// Define Sales orders item thing inspector
		this.createSalesOrderDetails(this);

		// Bring the table onto the UI
		return this.oTable;
	},

	// Define Thing inspector for sales order details
	createSalesOrderDetails : function(view) {
		// Actions of the ThingInspector
		// Cancel action
		var oA3 = new sap.ui.ux3.ThingAction({
			id : "items-sales-order-close",
			text : "{i18n>CANCEL}",
			tooltip : "{i18n>CANCEL}"
		});

		// Accept action
		var oA1 = new sap.ui.ux3.ThingAction({
			id : "items-sales-order-accept",
			text : "{i18n>SALES_ORDER_ITEM_ACCEPT}",
			tooltip : "{i18n>SALES_ORDER_ITEM_ACCEPT}",
			enabled : {
				path : "LifeCycleStatus",
				formatter : function(value) {
					if (value === 'N') {
						return true;
					} else {
						return false;
					}
				}
			}
		});

		// Reject action
		var oA2 = new sap.ui.ux3.ThingAction({
			id : "items-sales-order-reject",
			text : "{i18n>SALES_ORDER_ITEM_REJECT}",
			tooltip : "{i18n>SALES_ORDER_ITEM_REJECT}",
			enabled : {
				path : "LifeCycleStatus",
				formatter : function(value) {
					if (value === 'N') {
						return true;
					} else {
						return false;
					}
				}
			}
		});

		// create the row repeater control
		var oRowRepeater = new sap.ui.commons.RowRepeater({
			design : sap.ui.commons.RowRepeaterDesign.BareShell,
		});
		oRowRepeater.setNoData(new sap.ui.commons.TextView({
			text : "{i18n>SALES_ORDER_ITEM_NO_DATA}"
		}));

		// create the template control that will be repeated and will display the data
		var oRowTemplate = new sap.ui.commons.layout.MatrixLayout();

		var matrixRow, matrixCell, control;
		// main matrix
		oRowTemplate.setWidth("100%");
		// main row
		matrixRow = new sap.ui.commons.layout.MatrixLayoutRow();
		// image
		control = new sap.ui.commons.Image({
			src : {
				path : "Product/PictureUrl",
				formatter : sap.app.formatter.productImage
			},
			width : "75px",
			height : "75px"
		});

		// First column
		matrixCell = new sap.ui.commons.layout.MatrixLayoutCell();
		matrixCell.addContent(control);

		// for test..... TODO
		matrixRow.addCell(matrixCell);

		// define labels for Product Name, Product Description and Quantity
		var productName = new sap.ui.commons.Label({
			design : sap.ui.commons.LabelDesign.Bold,
			text : "{Product/Name}",
		});
		productName.addStyleClass('salesOrderItemDetailName');

		var prodDesc = new sap.ui.commons.TextView({
			text : "{Product/LongDescription}",
		});

		var prodQuantityLbl = new sap.ui.commons.Label({
			text : "{i18n>SALES_ORDER_ITEM_QUANTITY}"
		});
		var prodQuantity = new sap.ui.commons.Label({
			text : {
				path : "Quantity",
				formatter : function(value) {
					return "     : " + value;
				}
			}
		});

		// Layout for Quantity label and value
		var horizontalLayout = new sap.ui.commons.layout.HorizontalLayout({
			content : [ prodQuantityLbl, prodQuantity ]
		});
		horizontalLayout.addStyleClass('salesOrderItemDetailQuantity');

		var veriticalLayout = new sap.ui.commons.layout.VerticalLayout({
			content : [ productName, prodDesc, horizontalLayout ]
		});

		// second column
		matrixCell = new sap.ui.commons.layout.MatrixLayoutCell({
			colSpan : 1,
		});
		matrixCell.addContent(veriticalLayout);
		matrixRow.addCell(matrixCell);

		// price
		control = new sap.ui.commons.Label({
			text : {
				path : "GrossAmount",
				formatter : function(value) {
					return sap.app.formatter.priceWithLabel(value);
				}
			},
			design : sap.ui.commons.LabelDesign.Bold,
		});

		// third column
		matrixCell = new sap.ui.commons.layout.MatrixLayoutCell();
		matrixCell.addContent(control);
		matrixCell.addStyleClass('salesOrderItemPrice');
		// matrixCell.setHAlign(sap.ui.commons.layout.HAlign.Right);
		matrixRow.addCell(matrixCell);

		// add row to matrix
		oRowTemplate.addRow(matrixRow);
		oRowTemplate.addStyleClass('salesOrderItemBackground');

		// total label
		var lblTotal = new sap.ui.commons.TextView({
			text : "",
			design : sap.ui.commons.TextViewDesign.H1,
			textAlign : sap.ui.core.TextAlign.Right,
		});
		lblTotal.setWidth('100%');

		// Facet content of the ThingInspector
		var oFC1 = new sap.ui.ux3.ThingGroup({
			colspan : true,
			content : [ oRowRepeater, lblTotal ]
		});

		// email row
		var emailRow = view.row("{i18n>CONTACT_EMAIL}", "{Customer/EmailAddress}", "mailto:");

		// ThingInspector
		view.salesOrderDetailTI = new sap.ui.ux3.ThingInspector({
			firstTitle : "",
			type : "{i18n>CUSTOMER}",
			icon : 'images/Employee.png',
			favoriteActionEnabled : false,
			updateActionEnabled : false,
			followActionEnabled : false,
			flagActionEnabled : false,
			openButtonVisible : false,
			facets : [ new sap.ui.ux3.NavigationItem({
				key : "salesorder",
				text : "{i18n>SALES_ORDER_SALES_ORDER_COLUMN}"
			}), ],
			headerContent : [ new sap.ui.ux3.ThingGroup({
				title : "{i18n>Contact}",
				content : [ new sap.ui.commons.layout.MatrixLayout({
					rows : [ view.row("{i18n>CONTACT_FIRST_NAME}", "{Customer/FirstName}"),
							view.row("{i18n>CONTACT_LAST_NAME}", "{Customer/LastName}"), emailRow,
							view.row("{i18n>CONTACT_BUILDING_NUMBER}", "{Customer/HouseNumber}"),
							view.row("{i18n>CONTACT_STREET}", "{Customer/Street}"),
							view.row("{i18n>CONTACT_CITY}", "{Customer/City}"),
							view.row("{i18n>CONTACT_COUNTRY}", "{Customer/Country}"),
							view.row("{i18n>CONTACT_POST_CODE}", "{Customer/PostalCode}"),

					]
				}) ]
			}) ],
			facetSelected : function(oEvent) {
				view.salesOrderDetailTI.destroyActions();
				view.salesOrderDetailTI.destroyFacetContent();

				view.salesOrderDetailTI.removeAllFacetContent();
				view.salesOrderDetailTI.removeAllActions();

				view.salesOrderDetailTI.addAction(oA1);
				view.salesOrderDetailTI.addAction(oA2);
				view.salesOrderDetailTI.addAction(oA3);
				view.salesOrderDetailTI.addFacetContent(oFC1);
			},
			actionSelected : function(oEvent) {
				var oAction = oEvent.getParameter("action");
				var sActionId = oAction.getId();

				if (sActionId == "items-sales-order-close") {
					if (view.salesOrderDetailTI.isOpen()) {
						// view.salesOrderDetailTI.destroyActions();
						view.salesOrderDetailTI.close();
						return;
					}
				}

				if (sActionId == "items-sales-order-accept") {

					var id = sap.app.model.getProperty("SalesOrderId", view.salesOrderDetailTI.getBindingContext());

					var sFilterString = "SalesOrderId='" + id + "'";
					var aParams = [];
					aParams.push(sFilterString);

					sap.app.model.read("ConfirmSalesOrder", null, aParams, false, function() {

						view.oTable.getModel().refresh();
					}, function() {
						alert('error');
					});

					if (view.salesOrderDetailTI.isOpen()) {
						// view.salesOrderDetailTI.destroyActions();
						view.salesOrderDetailTI.close();
						return;
					}
				}

				if (sActionId == "items-sales-order-reject") {

					var id = sap.app.model.getProperty("SalesOrderId", view.salesOrderDetailTI.getBindingContext());

					var sFilterString = "SalesOrderId='" + id + "'";
					var aParams = [];
					aParams.push(sFilterString);

					sap.app.model.read("CancelSalesOrder", null, aParams, false, function() {
						view.oTable.getModel().refresh();
					}, function() {
						alert('error');
					});

					if (view.salesOrderDetailTI.isOpen()) {
						// view.salesOrderDetailTI.destroyActions();
						view.salesOrderDetailTI.close();
						return;
					}
				}
			},
			close : function() {
				// view.salesOrderDetailTI.destroyActions();
			}
		});

		view.salesOrderDetailTI.emailRow = emailRow;
		view.salesOrderDetailTI.rowTemplate = oRowTemplate;
		view.salesOrderDetailTI.rowRepeater = oRowRepeater;
		view.salesOrderDetailTI.totalLbl = lblTotal;
	},

	// method to define thing inspector for customer sales orders
	createCustomerSalesOrder : function(view) {

		var oCon = view.getController();

		// definer close action
		var oA1 = new sap.ui.ux3.ThingAction({
			id : "cust-sales-order-close",
			text : "{i18n>CLOSE}",
			tooltip : "{i18n>CLOSE}"
		});

		// Table for sales orders
		var oTable = new sap.ui.table.Table("customerSOTable", {
			visibleRowCount : 5,
			firstVisibleRow : 0,
			navigationMode : sap.ui.table.NavigationMode.Paginator,
			selectionMode : sap.ui.table.SelectionMode.Single,
		});

		// Define the columns and the control templates to be used
		// Sales Order ID
		oTable.addColumn(new sap.ui.table.Column({
			label : new sap.ui.commons.Label({
				text : "{i18n>SALES_ORDER_SALES_ORDER_COLUMN}"
			}),
			template : new sap.ui.commons.Link({
				text : "{SalesOrderId}",
				customData : [ new sap.ui.core.CustomData({
					key : "index",
					value : "{SalesOrderId}"
				}), ],
				press : function(oEvent) {
					var data = this.data("index");

					oCon.launchSalesOrderItems(oEvent.getSource().getBindingContext());
				}
			}),
			sortProperty : "SalesOrderId",
		// filterProperty : "SalesOrderId",
		}));

		// Gross Amount
		oTable.addColumn(new sap.ui.table.Column({
			label : new sap.ui.commons.Label({
				text : "{i18n>SALES_ORDER_GROSS_AMOUNT_COLUMN}"
			}),
			template : new sap.ui.commons.TextView({
				text : {
					path : "GrossAmount",
					formatter : sap.app.formatter.price,
				}
			}),
			sortProperty : "GrossAmount",
		}));

		// Sales Order Date
		oTable.addColumn(new sap.ui.table.Column({
			label : new sap.ui.commons.Label({
				text : "{i18n>SALES_ORDER_DATE_COLUMN}"
			}),
			// template: new sap.ui.commons.TextView().bindProperty("text", "date"),
			template : new sap.ui.commons.TextView({
				text : {
					path : "CreatedAt",
					formatter : function(value) {
						if (value == null) {
							return value;
						}
						var formatorig = {};
						formatorig.pattern = 'yyyy-MM-ddTHH:mm:ss.SSS';
						var datetimeorig = sap.ui.core.format.DateFormat.getDateTimeInstance(formatorig);
						value = datetimeorig.parse(value);

						var format = {};
						format.pattern = 'MMMM dd, yyyy';
						var datetime = sap.ui.core.format.DateFormat.getDateTimeInstance(format);
						return datetime.format(value, false);
					}
				}
			}),
			sortProperty : "CreatedAt",
		// filterProperty : "CreatedAt",
		}));

		// Status
		oTable.addColumn(new sap.ui.table.Column({
			label : new sap.ui.commons.Label({
				text : "{i18n>SALES_ORDER_STATUS_COLUMN}"
			}),
			template : new sap.ui.commons.layout.HorizontalLayout({
				content : [ new sap.ui.commons.Image({
					src : {
						path : "LifeCycleStatus",
						formatter : function(value) {
							// TODO replace 0,1,2 with constants after model is finalised
							if (value === 'N') {
								return '';
							} else if (value === 'P') {
								return 'images/green_tick.png';
							} else if (value === 'X') {
								return 'images/red_cross.png';
							}
						}
					}
				}), new sap.ui.commons.TextView({
					text : {
						path : "LifeCycleStatus",
						formatter : function(value) {
							// TODO replace 0,1,2 with constants after model is finalised
							if (value === 'N') {
								return sap.app.i18n.getProperty("SALES_ORDER_STATUS_OPEN");
							} else if (value === 'P') {
								return sap.app.i18n.getProperty("SALES_ORDER_STATUS_ACCEPTED");
							} else if (value === 'X') {
								return sap.app.i18n.getProperty("SALES_ORDER_STATUS_REJECTED");
							}
						}
					}
				}), ],
			}),
			sortProperty : "LifeCycleStatus",
		}));

		// Facet content of the ThingInspector
		var oFC1 = new sap.ui.ux3.ThingGroup({
			content : [ oTable ]
		});

		// row for email
		var emailRow = view.row("{i18n>CONTACT_EMAIL}", "{Customer/EmailAddress}", "mailto:");

		// ThingInspector
		view.customerTI = new sap.ui.ux3.ThingInspector({
			firstTitle : "",
			type : "{i18n>CUSTOMER}",
			icon : 'images/Employee.png',
			favoriteActionEnabled : false,
			updateActionEnabled : false,
			followActionEnabled : false,
			flagActionEnabled : false,
			openButtonVisible : false,
			facets : [ new sap.ui.ux3.NavigationItem({
				key : "salesorder",
				text : "{i18n>SALES_ORDER_SALES_ORDER_COLUMN}"
			}), ],
			headerContent : [ new sap.ui.ux3.ThingGroup({
				title : "{i18n>Contact}",
				content : [ new sap.ui.commons.layout.MatrixLayout({
					rows : [ view.row("{i18n>CONTACT_FIRST_NAME}", "{Customer/FirstName}"),
							view.row("{i18n>CONTACT_LAST_NAME}", "{Customer/LastName}"), emailRow,
							view.row("{i18n>CONTACT_BUILDING_NUMBER}", "{Customer/HouseNumber}"),
							view.row("{i18n>CONTACT_STREET}", "{Customer/Street}"),
							view.row("{i18n>CONTACT_CITY}", "{Customer/City}"),
							view.row("{i18n>CONTACT_COUNTRY}", "{Customer/Country}"),
							view.row("{i18n>CONTACT_POST_CODE}", "{Customer/PostalCode}"),

					]
				}) ]
			}) ],
			facetSelected : function(oEvent) {
				view.customerTI.removeAllFacetContent();
				view.customerTI.removeAllActions();
				view.customerTI.destroyActions();

				view.customerTI.addAction(oA1);
				view.customerTI.addFacetContent(oFC1);
			},
			actionSelected : function(oEvent) {
				var oAction = oEvent.getParameter("action");
				var sActionId = oAction.getId();

				if (sActionId == "cust-sales-order-close") {
					if (view.customerTI.isOpen()) {
						// view.customerTI.destroyActions();
						view.customerTI.close();
						return;
					}
				}
			},
			close : function() {
				// view.customerTI.destroyActions();
			}
		});

		view.customerTI.emailRow = emailRow;
	},

	// Helper function to easier create a Matrixlayout
	row : function(sLabel, sText, sUrl) {
		var oControl;
		if (!sUrl) {
			oControl = new sap.ui.commons.TextView({
				text : sText,
				tooltip : sText
			});
		} else {
			oControl = new sap.ui.commons.Link({
				text : sText,
				href : sUrl,
				tooltip : sText,
				target : "_blank"
			});
		}

		var oLabel = new sap.ui.commons.Label({
			text : sLabel,
			design : sap.ui.commons.LabelDesign.Bold,
			labelFor : oControl
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

		return new sap.ui.commons.layout.MatrixLayoutRow({
			cells : [ oMLCell1, oMLCell2 ]
		});
	},

});
