sap.ui.controller("espm-ui-retailer-web.stock", {

	// This method is called at start
	onInit : function() {

		// assign the controller
		sap.app.stockController = this;

		// assign the view
		var view = this.getView();

		// bind the table rows to this model
		view.oTable.bindRows({
			path : "/Stocks",
			sorter : new sap.ui.model.Sorter("QuantityLessMin", true),
			parameters : {
				expand : "Product/Supplier"
			}
		});

	},

	// to launch the thing inspector for stock status
	launchStockStatus : function(data) {
		// assign the controller
		var oCon = this;
		var view = oCon.getView();

		// set icon
		view.stockstatusTI.setIcon(sap.app.formatter.productImage(sap.ui.getCore().getModel().getProperty(
				"Product/PictureUrl", data)));

		var supplierName = sap.ui.getCore().getModel().getProperty("Product/Supplier/SupplierName", data);

		view.supplierRow.getCells()[1].getContent()[0].setText(supplierName);

		// open thing inspector
		if (!view.stockstatusTI.isOpen()) {
			view.stockstatusTI.open();
		}

		view.stockstatusTI.bindElement(data + '', {
			path : data + '',
			parameters : {
				expand : "Product/Supplier"
			},
		});

		view.totalTextView.setText(sap.app.formatter.total(parseFloat(sap.app.model.getProperty("LotSize", data))
				* parseFloat(sap.app.model.getProperty("Product/Price", data))));
	},

	// to launch the thing inspector for items in stock for a particular product
	launchStockDetails : function(data) {

		// assign the controller
		var oCon = this;
		var view = oCon.getView();

		// set icon
		view.stockdetailsTI.setIcon(sap.app.formatter.productImage(sap.ui.getCore().getModel().getProperty(
				"Product/PictureUrl", data)));

		// open thing inspector
		if (!view.stockdetailsTI.isOpen()) {
			view.stockdetailsTI.open();
		}

		view.stockdetailsTI.bindElement(data + '', {
			path : data + '',
			parameters : {
				expand : "Product"
			},
		});

	},

	// create purchase order
	/**
	 * create purchase order
	 */
	createPurchaseOrder : function(data, quantity) {

		var sSupplierId = sap.app.model.getProperty("Product/SupplierId", data);
		var PurchaseOrderHeader = {};

		PurchaseOrderHeader.SupplierId = sSupplierId;

		var items = [];
		var sProductId = sap.app.model.getProperty("ProductId", data);
		for ( var i = 0; i < 1; i++) {
			var item = {};

			// link Product with PurchaseOrderItem
			// item.Products = {};
			// var prodID = "/Product('" + sProductId + "')";
			// item.Products.__deferred = {};
			// item.Products.__deferred.uri = prodID;

			// item.Products = {};
			// item.Products = prodID;

			item.ProductId = sProductId;
			item.Quantity = parseInt(quantity, 10).valueOf();
			item.ItemNumber = 10 + "";
			item.QuantityUnit = sap.app.model.getProperty("Product/QuantityUnit", data);
			items.push(item);
		}

		PurchaseOrderHeader.PurchaseOrderItems = items;

		sap.app.model.create("/PurchaseOrderHeaders", PurchaseOrderHeader, null, function(data, response) {

			sap.app.messages.addMessage(sap.app.i18n.getProperty("STOCK_PURCHASE_ORDER_SUCCESS"),
					sap.ui.core.MessageType.Success, "odata_read_failed");
			sap.app.utility.clearMessagesAfter(sap.app.config.messageDuration);

			// linking of product with PurchaseOrderItems
			OData.request({
				requestUri : data.PurchaseOrderItems.results[0].__metadata.edit + "/$links/Product",
				method : "PUT",
				data : {
					"uri" : "Products('" + data.PurchaseOrderItems.results[0].ProductId + "')"
				}
			}, function(data, response1) {

			}, function(error, response) {

			});

		}, function() {
			sap.app.messages.addMessage(sap.app.i18n.getProperty("STOCK_PURCHASE_ORDER_ERROR"),
					sap.ui.core.MessageType.Error, "odata_read_failed");
			sap.app.utility.clearMessagesAfter(sap.app.config.messageDuration);
		});
	},
});
