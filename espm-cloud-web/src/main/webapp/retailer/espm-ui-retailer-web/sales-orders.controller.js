sap.ui.controller("espm-ui-retailer-web.sales-orders", {

	// This method is called at start
	onInit : function() {
		sap.app.salesOrderController = this;

		// assign view
		var view = this.getView();

		view.oTable.bindRows({
			path : "/SalesOrderHeaders",
			sorter : new sap.ui.model.Sorter("LifeCycleStatus", false),
			parameters : {
				expand : "Customer"
			}
		});

		// Initially sort the table
		// view.oTable.sort(view.oTable.getColumns()[0]);
	},

	// to launch the thing inspector for all sales orders for a particular customer with customer details
	launchCustomerSalesOrder : function(data) {

		// assign the controller
		var oCon = this;
		var view = oCon.getView();

		var customerName = sap.ui.getCore().getModel().getProperty("Customer/FirstName", data) + ' '
				+ sap.ui.getCore().getModel().getProperty("Customer/LastName", data);

		// set first title
		view.customerTI.setFirstTitle(customerName);

		// set target for email
		view.customerTI.emailRow.getCells()[1].getContent()[0].setHref("mailto:"
				+ sap.ui.getCore().getModel().getProperty("Customer/EmailAddress", data));

		// open thing inspector
		if (!view.customerTI.isOpen()) {
			view.customerTI.open();
		}

		view.customerTI.bindElement(data + '', {
			path : data + '',
			parameters : {
				expand : "Customer",
				sSorter : new sap.ui.model.Sorter("SalesOrderId", true),
				filters : [ new sap.ui.model.Filter("CustomerId", sap.ui.model.FilterOperator.EQ, data
						.getProperty('CustomerId')) ]
			},
		});

		// bind table
		view.customerTI.getFacetContent()[0].getContent()[0].bindAggregation("rows", {
			path : "/SalesOrderHeaders",
			parameters : {
				expand : "Customer"
			},
			oSorter : new sap.ui.model.Sorter("LifeCycleStatus", false),
			filters : [ new sap.ui.model.Filter("CustomerId", sap.ui.model.FilterOperator.EQ, data
					.getProperty('CustomerId')) ],
		});

	},

	// to launch the thing inspector for all sales orders for a particular customer with customer details
	launchSalesOrderItems : function(data) {

		// assign controller instance
		var oCon = this;
		var view = oCon.getView();

		var customerName = sap.ui.getCore().getModel().getProperty("Customer/FirstName", data) + ' '
				+ sap.ui.getCore().getModel().getProperty("Customer/LastName", data);

		// set customer name
		view.salesOrderDetailTI.setFirstTitle(customerName);

		// set email
		view.salesOrderDetailTI.emailRow.getCells()[1].getContent()[0].setHref("mailto:"
				+ sap.ui.getCore().getModel().getProperty("Customer/EmailAddress", data));

		// set total amount
		view.salesOrderDetailTI.totalLbl.setText(sap.app.formatter.total(sap.ui.getCore().getModel().getProperty(
				"GrossAmount", data)));

		view.salesOrderDetailTI.unbindElement();
		view.salesOrderDetailTI.bindElement(data + '', {
			path : data + '',
			template : view.salesOrderDetailTI.rowTemplate,
			parameters : {
				expand : "SalesOrderItems/Product,Customer"
			},
		});

		// bind the table
		view.salesOrderDetailTI.rowRepeater.destroyRows().bindAggregation("rows", {
			path : data + '/SalesOrderItems',
			template : view.salesOrderDetailTI.rowTemplate,
			parameters : {
				expand : "Product"
			},
		});

		// open thing inspector
		if (!view.salesOrderDetailTI.isOpen()) {
			view.salesOrderDetailTI.open();
		}

	}
});