jQuery.sap.declare("sap.app.utility");

sap.app.utility = {

	iCounter : static = 0,

	getCounter : function() {
		return this.iCounter++;
	},

	getBackendDestination : function() {
		var prefBackendType = sap.app.localStorage.getPreference(sap.app.localStorage.PREF_USED_BACKEND_TYPE);
		if (prefBackendType === sap.app.localStorage.PREF_USED_BACKEND_TYPE_ABAP) {
			return ("proxy/abapbackend");
		} else if (prefBackendType === sap.app.localStorage.PREF_USED_BACKEND_TYPE_CLOUD_REMOTE) {
			return ("proxy/cloudbackend");
		} else {
			return ("/espm-cloud-web/espm.svc/");
		}
	},

	getBackendImagesDestination : function() {
		var prefBackendType = sap.app.localStorage.getPreference(sap.app.localStorage.PREF_USED_BACKEND_TYPE);
		if (prefBackendType === sap.app.localStorage.PREF_USED_BACKEND_TYPE_ABAP) {
			return ("proxy/abapbackendimages");
		} else if (prefBackendType === sap.app.localStorage.PREF_USED_BACKEND_TYPE_CLOUD_REMOTE) {
			return ("proxy/cloudbackendimages");
		} else {
			return ("");
		}
	},

	getImagesBaseUrl : function() {
		var prefBackendType = sap.app.localStorage.getPreference(sap.app.localStorage.PREF_USED_BACKEND_TYPE);
		if (prefBackendType === sap.app.localStorage.PREF_USED_BACKEND_TYPE_ABAP) {
			return (sap.app.config.abapImagesBaseUrl);
		} else {
			return (sap.app.config.cloudImagesBaseUrl);
		}
	},

	getBackendTypeText : function() {
		var prefBackendType = sap.app.localStorage.getPreference(sap.app.localStorage.PREF_USED_BACKEND_TYPE);
		if (prefBackendType === sap.app.localStorage.PREF_USED_BACKEND_TYPE_ABAP) {
			return (sap.app.i18n.getProperty("DATA_SOURCE_INFO_ABAP_BACKEND"));
		} else {
			return (sap.app.i18n.getProperty("DATA_SOURCE_INFO_HANA_CLOUD"));
		}
	},

	getDataSourceInfoOdataServiceUrl : function() {
		var prefBackendType = sap.app.localStorage.getPreference(sap.app.localStorage.PREF_USED_BACKEND_TYPE);
		if (prefBackendType === sap.app.localStorage.PREF_USED_BACKEND_TYPE_ABAP) {
			return (sap.app.config.abapOdataServiceUrlWithLogin);
		} else if (prefBackendType === sap.app.localStorage.PREF_USED_BACKEND_TYPE_CLOUD_REMOTE) {
			return (sap.app.config.cloudOdataServiceUrl);
		} else {
			return (sap.app.config.cloudLocalOdataServiceUrl);
		}
	},

	clearMessagesAfter : function(iMs) {
		window.setTimeout(function() {
			sap.app.messages.removeAllMessages();
		}, iMs);
	},

	/**
	 * getProductSorterControl: Sorter includes a label and dropdown listbox for sorting
	 * 
	 * @returns label and combo box in a matrix layout
	 */
	getProductSorterControl : function() {
		// return control if already created
		if (!this.sorter) {

			// create sorter control as matrix layout with label and combo box
			var oSortLabel = new sap.ui.commons.Label({
				id : "label-product-sorter",
				text : "{i18n>PRODUCT_LIST_SORT_BY}"
			}).addStyleClass("product-sorter-label");

			var oSortCB = new sap.ui.commons.ComboBox({
				id : "combobox-product-sorter",
				// create a empty line for initialization of ComboBox
				items : [ new sap.ui.core.ListItem({
					id : "sort_initial_id",
					text : "",
					key : "sort_initial",
				}), new sap.ui.core.ListItem({
					id : "sort_asced_descr_id",
					text : "{i18n>PRODUCT_LIST_SORT_NAME_DESCENDING}",
					key : "sort_asced_descr",
					customData : [ new sap.ui.core.CustomData({
						key : "path",
						value : "Name",
					}), new sap.ui.core.CustomData({
						key : "descending",
						value : true,
					}), ]
				}), new sap.ui.core.ListItem({
					id : "sort_asced_price_id",
					text : "{i18n>PRODUCT_LIST_SORT_PRICE_ASCENDING}",
					key : "sort_asced_price",
					customData : [ new sap.ui.core.CustomData({
						key : "path",
						value : "Price",
					}), new sap.ui.core.CustomData({
						key : "descending",
						value : false,
					}), ]
				}), new sap.ui.core.ListItem({
					id : "sort_desced_price_id",
					text : "{i18n>PRODUCT_LIST_SORT_PRICE_DESCENDING}",
					key : "sort_desced_price",
					customData : [ new sap.ui.core.CustomData({
						key : "path",
						value : "Price",
					}), new sap.ui.core.CustomData({
						key : "descending",
						value : true,
					}), ]
				}), ]
			});
			var oSorterContent = new sap.ui.commons.layout.HorizontalLayout({
				id : "product-sorter",
				content : [ oSortLabel, oSortCB ]
			});

			this.sorter = oSorterContent;

			/*
			 * attachChangeEvent - check if listener for combobox event 'change' are existing, then detach these
			 * listener and attach as listener the current view in which this control is used
			 */
			this.sorter.attachChangeEvent = function(oListener) {
				var oSortCB = sap.ui.getCore().byId("combobox-product-sorter");
				var i = 0;
				while (oSortCB.mEventRegistry.change) {
					oSortCB.detachChange(sap.app.utility.onSortProducts, oSortCB.mEventRegistry.change[i].oListener);
					i++;
				}
				oSortCB.attachChange(oListener.getDataForSorting(), sap.app.utility.onSortProducts, oListener);
			};

		}

		return this.sorter;
	},

	restoreSorterControl : function(oParentView) {
		// get control for product sorter
		var oSorterControl = sap.app.utility.getProductSorterControl(oParentView);
		var oContentForSorter = oParentView.getParentContentOfSorter();
		this.restoreControlInContent(oContentForSorter, oSorterControl);
		// set initial value in combo box after restore, this item is empty
		var oSortCB = sap.ui.getCore().byId("combobox-product-sorter");
		oSortCB.setSelectedItemId("sort_initial_id");

		// set right event handler and style for parent view
		oSorterControl.attachChangeEvent(oParentView);

		return oSorterControl;
	},
	/**
	 * restoreControlInContent: set the control to the content if not exists already
	 * 
	 * @param oContent:
	 *            content in which the control should be set
	 * @param oControl:
	 *            control to be set in content
	 */
	restoreControlInContent : function(oContent, oControl) {
		var indexOfSorter = oContent.indexOfContent(oControl);
		// the control is set to content only if not exists already
		if (indexOfSorter < 0) {
			oContent.addContent(oControl);
		}
	},
	/**
	 * onSortProducts: event handler for sorting in a product list
	 * 
	 * @param oEvent
	 * @param oRowRepeater:
	 *            data for sorting
	 */
	onSortProducts : function(oEvent, oRowRepeater) {
		// get selected id from combo box
		var idSelected = oEvent.getSource().getSelectedItemId();
		// get element with id for selected id
		var oSelectedItem = sap.ui.getCore().byId(idSelected);
		// get custom data from element
		var oCustData = oSelectedItem.getCustomData();
		if (oCustData.length != 0) {
			// create model sorter with given parameters from combo box
			var sorter = new sap.ui.model.Sorter(oCustData[0].getValue(), oCustData[1].getValue());
			oRowRepeater.getBinding("rows").sort(sorter);
		}

	},

};

sap.app.readExtensionOData = {

	requestCompleted : function(oEvent) {

		var oExtensionODataModel = sap.ui.getCore().getModel("extensionodatamodel");
		var oReviews = oExtensionODataModel.getProperty("/");
		var sSelectedProductId = sap.app.viewCache.get("customer-reviews").getModel().getData()["selectedProductId"];
		var oRatingInfo = sap.app.readExtensionOData.getRatingInfo(oReviews, sSelectedProductId);

		// customer reviews exists
		if (oRatingInfo.iReviewsCount > 0) {
			// set average rating value
			sap.app.viewCache.get("customer-reviews").getController().setRatingInfo(oRatingInfo);

			sap.app.viewCache.get("reviews").getController().showFilledCustomerReviewsPanel();
		} else {
			sap.app.viewCache.get("reviews").getController().showEmptyCustomerReviewsPanel();
		}
	},

	getRatingInfo : function(oReviews, sSelectedProductId) {
		var iReviewsCount = 0;
		var fRatingsSum = 0.0;
		var fAverageRating = 0.0;

		for ( var sReviewId in oReviews) {
			var oReview = oReviews[sReviewId];
			if (sSelectedProductId === oReview.ProductId) {
				iReviewsCount++;
				fRatingsSum += parseFloat(oReview.Rating);
			}
		}

		if (iReviewsCount > 0) {
			fAverageRating = fRatingsSum / iReviewsCount;
		}
		return {
			iReviewsCount : iReviewsCount,
			fAverageRating : fAverageRating
		};
	}
};

sap.app.readOdata = {

	getCustomerByEmailAddress : function() {
		var that = this;

		this.successResponse = function(oData, response) {
			if (response.statusCode == 200 && response.data.CustomerId) {
				that.result = true;
				sap.app.checkoutController.getView().getModel().setProperty("/customer", response.data);
				sap.app.customerCreated = false;
				sap.app.checkoutController.getView().getModel().setProperty("/payment/cardOwner",
						response.data.FirstName + " " + response.data.LastName);
			} else {
				that.result = false;
			}
		};
	},

	getCustomerByEmailAddressError : function(oError) {
		// if the requested e-mail does not exist an error (HTTP 400) is returned
	},

	readCategoriesSuccess : function(oData, response) {
		// prepare main- and child-categories by setting up a tree structure for the categories
		var oCategories = {};
		var aCategories = [];

		for ( var i = 0; i < oData.results.length; i++) {
			var oCurrentCategory = oData.results[i];
			// create main category if not existent
			if (!oCategories[oCurrentCategory.MainCategory]) {
				oCategories[oCurrentCategory.MainCategory] = {
					name : oCurrentCategory.MainCategoryName,
					category : oCurrentCategory.MainCategory,
					categories : []
				};
			}
			// add child category
			oCategories[oCurrentCategory.MainCategory].categories.push({
				name : oCurrentCategory.CategoryName,
				category : oCurrentCategory.Category,
				numberOfProducts : oCurrentCategory.NumberOfProducts
			});
		}
		for ( var key in oCategories) {
			aCategories.push(oCategories[key]);
		}

		var oCategoryModel = new sap.ui.model.json.JSONModel();
		oCategoryModel.setData({
			mainCategories : aCategories
		});
		// assign the category model to the categorie view
		sap.app.viewCache.get("categories").setModel(oCategoryModel);
	},

	createCustomer : function(oData, response) {
		if (response.statusCode == 201) {
			sap.app.checkoutController.getView().getModel().setProperty("/customer", response.data);
			sap.app.checkoutController.getView().getModel().setProperty("/payment/cardOwner",
					response.data.FirstName + " " + response.data.LastName);
			// sap.app.checkoutController.getView().getModel().setProperty("/customer/created",true);
			sap.app.customerCreatedId = response.data.CustomerId;
			sap.app.customerCreated = true;
		}
	},

	createCustomerError : function(oError) {
		var sMessageText = sap.app.i18n.getProperty("MSG_ERROR_ACCOUNT_CREATION_FAILED") + ": " + oError.message;
		sap.app.messages.addMessage(sMessageText, sap.ui.core.MessageType.Error, "customer_creation_failed");
		sap.app.utility.clearMessagesAfter(sap.app.config.messageDuration);
	},

	createOrder : function(oData, response) {
		if (response.statusCode == 201) {
			sap.app.checkoutController.getView().getModel().setProperty("/order", response.data);
			var prefBackendType = sap.app.localStorage.getPreference(sap.app.localStorage.PREF_USED_BACKEND_TYPE);
			if (!(prefBackendType === sap.app.localStorage.PREF_USED_BACKEND_TYPE_ABAP)) {
				var results = oData.SalesOrderItems.results;
				OData.request({
					requestUri : oData.__metadata.id + "/$links/Customer",
					method : "PUT",
					data : {
						"uri" : "Customers('" + response.data.CustomerId + "')"
					}
				}, function(data, response1) {
					// success handler
					var length = results.length;
					for ( var i = 0; i < length; i++) {
						OData.request({
							requestUri : results[i].__metadata.id + "/$links/Product",
							method : "PUT",
							data : {
								"uri" : "Products('" + results[i].ProductId + "')"
							}
						}, function(data, response) {

						}, function(error, response) {

						});
					}
				}, function(error, response) {

				});
			}
		}
	},

	createOrderError : function(oError) {
		var sMessageText = sap.app.i18n.getProperty("MSG_ERROR_ORDER_CREATION_FAILED") + ": " + oError.message;
		sap.app.messages.addMessage(sMessageText, sap.ui.core.MessageType.Error, "order_creation_failed");
		sap.app.utility.clearMessagesAfter(sap.app.config.messageDuration);
	},

	readError : function(oError) {
		var sMessageText = sap.app.i18n.getProperty("MSG_ERROR_ODATA_READ") + ": " + oError.message;
		sap.app.messages.addMessage(sMessageText, sap.ui.core.MessageType.Error, "odata_read_failed");
		sap.app.utility.clearMessagesAfter(sap.app.config.messageDuration);
	}
};
