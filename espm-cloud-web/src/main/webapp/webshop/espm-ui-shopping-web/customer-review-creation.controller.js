sap.ui.controller("espm-ui-shopping-web.customer-review-creation", {

	publishReview : function(selectedProductId, oCustomerReview) {
		// calculated (productive) or predefined (for development only)
		var oCreationDateField = sap.ui.getCore().byId("review-creation-date-field-id");

		if (oCreationDateField) {
			// development case
			oCustomerReview.CreationDate = oCreationDateField.getValue();
		} else {
			oCustomerReview.CreationDate = new Date().toISOString().replace("Z", "0000");
		}
		var oProductIdField = sap.ui.getCore().byId("review-product-id-field-id");

		if (oProductIdField) {
			// development case
			oCustomerReview.ProductId = oProductIdField.getValue();
		} else {
			oCustomerReview.ProductId = selectedProductId;
		}

		// create customer review
		sap.ui.getCore().getModel("extensionodatamodel").create("/CustomerReviews", oCustomerReview, null,
				this.createCustomerReviewSuccess, this.showReadError);
	},

	createCustomerReviewSuccess : function() {
		sap.ui.commons.MessageBox.alert(sap.app.i18n.getProperty("CUSTOMER_REVIEW_SUCCESS_MSG"));
	},

	showReadError : function(oError) {
		sap.app.utility.showErrorMessage(sap.app.i18n.getProperty("READ_ODATA_ERROR_MSG") + ": " + oError.message);
	},

	checkSubmitButtonEnabledState : function(commentLiveValue, firstNameLiveValue, lastNameLiveValue) {
		var commentValid = (commentLiveValue !== "");
		var ratingIndicatorValid = sap.ui.getCore().byId("review-rating-indicator-id").getValue() > 0;
		var firstNameValid = (firstNameLiveValue !== "");
		var lastNameValid = (lastNameLiveValue !== "");

		this.getView().setSubmitButtonEnabled(commentValid && ratingIndicatorValid && firstNameValid && lastNameValid);
	},

	openDialog : function(oBindingContext) {
		this.getView().setProductBindingContext(oBindingContext);
		this.getView().openDialog(this);
	}

});