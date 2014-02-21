sap.ui.controller("espm-ui-reviews-web.customer-review-creation",
		{

			publishReview : function(oCustomerReview) {
				// create customer review
				sap.ui.getCore().getModel("extensionodatamodel").create("/CustomerReviews", oCustomerReview, null,
						this.createCustomerReviewSuccess, this.showReadError);
			},

			createCustomerReviewSuccess : function() {
				sap.ui.commons.MessageBox.alert(sap.app.i18n.getProperty("CUSTOMER_REVIEW_SUCCESS_MSG"));
			},

			showReadError : function(oError) {
				sap.app.utility.showErrorMessage(sap.app.i18n.getProperty("CUSTOMER_REVIEW_ERROR_MSG") + ": "
						+ oError.message);
			},

			checkSubmitButtonEnabledState : function(commentLiveValue, firstNameLiveValue, lastNameLiveValue) {
				var commentValid = (commentLiveValue !== "");
				var ratingIndicatorValid = sap.ui.getCore().byId("review-rating-indicator-id").getValue() > 0;
				var firstNameValid = (firstNameLiveValue !== "");
				var lastNameValid = (lastNameLiveValue !== "");

				this.getView().setSubmitButtonEnabled(
						commentValid && ratingIndicatorValid && firstNameValid && lastNameValid);
			},

			openDialog : function(oBindingContext) {
				this.getView().setProductBindingContext(oBindingContext);
				this.getView().openDialog(this);
			}

		});